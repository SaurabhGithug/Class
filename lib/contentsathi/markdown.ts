// Safe Markdown for posts that arrive from outside.
//
// This parses to a small tree of blocks and inlines; Markdown.tsx renders that
// tree as React elements. There is no HTML string anywhere, so there is nothing
// to escape wrongly: React escapes every text node, and the only attributes that
// ever come from the post are an href and an image src, both checked here.
//
//   • raw HTML in a post is shown as the literal text it is, never interpreted
//   • links: http, https, mailto, tel only — javascript:, data:, vbscript:, file:
//     and everything else become plain text (the link's label)
//   • images: https only
//
// What ContentSathi sends is Markdown or plain text. If a body looks like HTML
// (a CMS-style export), normalizeBody() turns the structural tags into Markdown
// and strips every other tag before anything is stored — text only, never kept.

export type Inline =
  | { t: "text"; v: string }
  | { t: "strong"; c: Inline[] }
  | { t: "em"; c: Inline[] }
  | { t: "code"; v: string }
  | { t: "link"; href: string; label: string };

export type Block =
  | { t: "h"; level: 2 | 3 | 4; c: Inline[] }
  | { t: "p"; c: Inline[] }
  | { t: "ul" | "ol"; items: Inline[][] }
  | { t: "quote"; c: Inline[] }
  | { t: "hr" }
  | { t: "img"; src: string; alt: string };

const LINK_SCHEMES = new Set(["http:", "https:", "mailto:", "tel:"]);

/** The URL itself if it is safe to put in an href, else null. */
export function safeHref(raw: string): string | null {
  const url = raw.trim();
  if (!url || /[\u0000-\u001f\u007f\s]/.test(url)) return null;
  // Relative links stay on the site; "//host" is protocol-relative, so it is not relative.
  if ((url.startsWith("/") && !url.startsWith("//")) || url.startsWith("#")) return url;
  try {
    return LINK_SCHEMES.has(new URL(url).protocol) ? url : null;
  } catch {
    return null;
  }
}

/** The URL itself if it is safe as an image src (https only), else null. */
export function safeImageSrc(raw: string): string | null {
  try {
    const u = new URL(raw.trim());
    return u.protocol === "https:" && !u.username && !u.password ? u.toString() : null;
  } catch {
    return null;
  }
}

// code | image/link | bold | italic. Underscore italics need a word boundary, so snake_case stays text.
// A link's URL may contain one level of balanced parentheses ("…/Foo_(bar)", "javascript:alert(1)"),
// so it is not cut at the first ")".
const URL_PART = String.raw`(?:[^()\s]|\([^()\s]*\))*`;
const INLINE = new RegExp(
  [
    "(`[^`\\n]+`)",
    String.raw`(!?\[[^\]\n]*\]\(${URL_PART}(?:\s+"[^"\n]*")?\))`,
    "(\\*\\*[^*\\n]+\\*\\*|__[^_\\n]+__)",
    "((?<![\\w*])\\*[^*\\s][^*\\n]*?\\*(?![\\w*])|(?<![\\w_])_[^_\\s][^_\\n]*?_(?![\\w_]))",
  ].join("|"),
  "g",
);
const LINK_PARTS = new RegExp(String.raw`^(!?)\[([^\]\n]*)\]\((${URL_PART})`);
const ONLY_IMAGE = new RegExp(String.raw`^!\[([^\]\n]*)\]\((${URL_PART})(?:\s+"[^"\n]*")?\)$`);

export function parseInline(text: string): Inline[] {
  const out: Inline[] = [];
  let last = 0;
  const push = (v: string) => {
    if (v) out.push({ t: "text", v });
  };
  for (const m of text.matchAll(INLINE)) {
    const at = m.index ?? 0;
    push(text.slice(last, at));
    last = at + m[0].length;
    if (m[1]) {
      out.push({ t: "code", v: m[1].slice(1, -1) });
    } else if (m[2]) {
      const parts = LINK_PARTS.exec(m[2]);
      const label = parts?.[2] ?? "";
      if (parts?.[1] === "!") {
        push(label); // images inside running text are not rendered; the alt text stays
      } else {
        const href = safeHref(parts?.[3] ?? "");
        if (href) out.push({ t: "link", href, label: label || href });
        else push(label || parts?.[3] || "");
      }
    } else if (m[3]) {
      out.push({ t: "strong", c: parseInline(m[3].slice(2, -2)) });
    } else if (m[4]) {
      out.push({ t: "em", c: parseInline(m[4].slice(1, -1)) });
    }
  }
  push(text.slice(last));
  return out;
}

export function parseMarkdown(src: string): Block[] {
  const lines = src.replace(/\r\n?/g, "\n").split("\n");
  const blocks: Block[] = [];
  let i = 0;

  const isBlank = (l: string) => !l.trim();
  const heading = (l: string) => /^(#{1,6})\s+(.+?)\s*#*\s*$/.exec(l);
  const hr = (l: string) => /^\s{0,3}([-*_])(\s*\1){2,}\s*$/.test(l);
  const bullet = (l: string) => /^\s{0,3}[-*+]\s+(.*)$/.exec(l);
  const numbered = (l: string) => /^\s{0,3}\d{1,3}[.)]\s+(.*)$/.exec(l);
  const quote = (l: string) => /^\s{0,3}>\s?(.*)$/.exec(l);

  while (i < lines.length) {
    const line = lines[i];
    if (isBlank(line)) {
      i++;
      continue;
    }
    const h = heading(line);
    if (h) {
      // The page's own title is the h1; a post's "#" is the first level under it.
      const level = Math.min(h[1].length + 1, 4) as 2 | 3 | 4;
      blocks.push({ t: "h", level, c: parseInline(h[2]) });
      i++;
      continue;
    }
    if (hr(line)) {
      blocks.push({ t: "hr" });
      i++;
      continue;
    }
    if (bullet(line) || numbered(line)) {
      const ordered = !bullet(line);
      const items: Inline[][] = [];
      while (i < lines.length) {
        const m = ordered ? numbered(lines[i]) : bullet(lines[i]);
        if (!m) break;
        items.push(parseInline(m[1]));
        i++;
      }
      blocks.push({ t: ordered ? "ol" : "ul", items });
      continue;
    }
    if (quote(line)) {
      const parts: string[] = [];
      while (i < lines.length) {
        const m = quote(lines[i]);
        if (!m) break;
        parts.push(m[1]);
        i++;
      }
      blocks.push({ t: "quote", c: parseInline(parts.join(" ")) });
      continue;
    }
    // A paragraph runs until a blank line or the start of another block.
    const para: string[] = [];
    while (i < lines.length && !isBlank(lines[i]) && !heading(lines[i]) && !hr(lines[i]) && !bullet(lines[i]) && !numbered(lines[i]) && !quote(lines[i])) {
      para.push(lines[i].trim());
      i++;
    }
    const text = para.join(" ");
    const onlyImage = ONLY_IMAGE.exec(text);
    const src2 = onlyImage ? safeImageSrc(onlyImage[2]) : null;
    if (onlyImage && src2) blocks.push({ t: "img", src: src2, alt: onlyImage[1] });
    else blocks.push({ t: "p", c: parseInline(text) });
  }
  return blocks;
}

const HTML_HINT = /<\/?(?:p|h[1-6]|ul|ol|li|div|br|strong|b|em|i|a|blockquote)\b[^>]*>/i;

const ENTITIES: Record<string, string> = { "&nbsp;": " ", "&lt;": "<", "&gt;": ">", "&quot;": '"', "&#39;": "'", "&apos;": "'" };

/**
 * Markdown or plain text stays as it is. A body that looks like HTML becomes
 * Markdown: structural tags are translated, every other tag is dropped, a few
 * entities are decoded. The result is text — it is parsed and rendered by this
 * file's parser like any other post, so nothing from the HTML survives as markup.
 */
export function normalizeBody(raw: string): string {
  const s = raw.replace(/\r\n?/g, "\n").trim();
  if (!HTML_HINT.test(s)) return s;
  let t = s
    .replace(/<(script|style)\b[^>]*>[\s\S]*?<\/\1>/gi, "")
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<h([1-6])\b[^>]*>([\s\S]*?)<\/h\1>/gi, (_m, n: string, inner: string) => `\n\n${"#".repeat(Number(n))} ${inner.trim()}\n\n`)
    .replace(/<li\b[^>]*>([\s\S]*?)<\/li>/gi, (_m, inner: string) => `\n- ${inner.trim()}`)
    .replace(/<\/(?:ul|ol)>/gi, "\n\n")
    .replace(/<blockquote\b[^>]*>([\s\S]*?)<\/blockquote>/gi, (_m, inner: string) => `\n\n> ${inner.trim().replace(/\n+/g, " ")}\n\n`)
    .replace(/<\/(?:p|div)>/gi, "\n\n")
    .replace(/<(?:strong|b)\b[^>]*>([\s\S]*?)<\/(?:strong|b)>/gi, "**$1**")
    .replace(/<(?:em|i)\b[^>]*>([\s\S]*?)<\/(?:em|i)>/gi, "*$1*")
    .replace(/<a\b[^>]*?href\s*=\s*(?:"([^"]*)"|'([^']*)')[^>]*>([\s\S]*?)<\/a>/gi, (_m, dq: string | undefined, sq: string | undefined, label: string) => `[${label}](${dq ?? sq ?? ""})`)
    .replace(/<[^>]*>/g, "");
  t = t.replace(/&(?:nbsp|lt|gt|quot|#39|apos);/g, (e) => ENTITIES[e] ?? e).replace(/&amp;/g, "&");
  return t.replace(/[ \t]+\n/g, "\n").replace(/\n{3,}/g, "\n\n").trim();
}

/** A post as plain text — the parser's own reading of it, so teasers and meta descriptions never show Markdown syntax. */
export function toPlainText(src: string): string {
  const inl = (nodes: Inline[]): string =>
    nodes.map((n) => (n.t === "text" || n.t === "code" ? n.v : n.t === "link" ? n.label : inl(n.c))).join("");
  return parseMarkdown(src)
    .map((b) => (b.t === "h" || b.t === "p" || b.t === "quote" ? inl(b.c) : b.t === "ul" || b.t === "ol" ? b.items.map(inl).join(" ") : b.t === "img" ? b.alt : ""))
    .filter(Boolean)
    .join(" ")
    .replace(/\s+/g, " ")
    .trim();
}
