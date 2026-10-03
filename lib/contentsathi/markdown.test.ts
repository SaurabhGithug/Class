import { test } from "node:test";
import assert from "node:assert/strict";
import { normalizeBody, parseInline, parseMarkdown, safeHref, safeImageSrc, toPlainText } from "./markdown.ts";

test("safeHref allows only http, https, mailto, tel and on-site links", () => {
  for (const ok of ["https://a.example/x", "http://a.example", "mailto:a@b.co", "tel:+12242583880", "/blog/x", "#top"]) {
    assert.equal(safeHref(ok), ok, ok);
  }
  for (const bad of [
    "javascript:alert(1)",
    "JaVaScRiPt:alert(1)",
    " javascript:alert(1)",
    "java\tscript:alert(1)",
    "data:text/html,<script>alert(1)</script>",
    "vbscript:msgbox(1)",
    "file:///etc/passwd",
    "//evil.example/x",
    "",
    "not a url",
  ]) {
    assert.equal(safeHref(bad), null, JSON.stringify(bad));
  }
});

test("safeImageSrc allows https only, without credentials", () => {
  assert.equal(safeImageSrc("https://cdn.example/a.jpg"), "https://cdn.example/a.jpg");
  for (const bad of ["http://cdn.example/a.jpg", "data:image/png;base64,AAAA", "javascript:alert(1)", "https://u:p@cdn.example/a.jpg", "/local.png"]) {
    assert.equal(safeImageSrc(bad), null, bad);
  }
});

test("a dangerous link becomes its label as plain text, not a link", () => {
  const out = parseInline("see [click me](javascript:alert(1)) now");
  assert.deepEqual(out, [
    { t: "text", v: "see " },
    { t: "text", v: "click me" },
    { t: "text", v: " now" },
  ]);
  assert.ok(!out.some((n) => n.t === "link"));
});

test("a safe link keeps its href", () => {
  assert.deepEqual(parseInline("[Book](https://a.example/b)"), [{ t: "link", href: "https://a.example/b", label: "Book" }]);
});

test("raw HTML is plain text — never interpreted", () => {
  const blocks = parseMarkdown('<script>alert(1)</script>\n\n<img src=x onerror="alert(1)">\n\n<a href="javascript:alert(1)">x</a>');
  assert.equal(blocks.length, 3);
  for (const b of blocks) {
    assert.equal(b.t, "p");
    // Only text nodes: nothing here can become an element, an attribute or a link.
    assert.ok((b as { c: { t: string }[] }).c.every((n) => n.t === "text"));
  }
  assert.equal(((blocks[0] as { c: { v: string }[] }).c[0]).v, "<script>alert(1)</script>");
});

test("bold, italic, code and snake_case", () => {
  assert.deepEqual(parseInline("a **b** and *c* and `d`"), [
    { t: "text", v: "a " },
    { t: "strong", c: [{ t: "text", v: "b" }] },
    { t: "text", v: " and " },
    { t: "em", c: [{ t: "text", v: "c" }] },
    { t: "text", v: " and " },
    { t: "code", v: "d" },
  ]);
  // Underscores inside a word are not italics.
  assert.deepEqual(parseInline("use my_var_name here"), [{ t: "text", v: "use my_var_name here" }]);
});

test("blocks: headings step down one level, lists, quotes, rules, paragraphs", () => {
  const blocks = parseMarkdown(["# Top", "", "Para one", "wraps here.", "", "## Sub", "- a", "- b", "", "1. x", "2. y", "", "> quoted", "", "---", "", "Last"].join("\n"));
  assert.deepEqual(
    blocks.map((b) => b.t === "h" ? `h${b.level}` : b.t),
    ["h2", "p", "h3", "ul", "ol", "quote", "hr", "p"],
  );
  const p = blocks[1] as { c: { v: string }[] };
  assert.equal(p.c[0].v, "Para one wraps here.");
  assert.equal((blocks[3] as { items: unknown[] }).items.length, 2);
});

test("a paragraph that is only a safe https image becomes an image block; an unsafe one does not", () => {
  assert.deepEqual(parseMarkdown("![Her stage](https://cdn.example/a.jpg)"), [{ t: "img", src: "https://cdn.example/a.jpg", alt: "Her stage" }]);
  const bad = parseMarkdown("![x](javascript:alert(1))");
  assert.equal(bad[0].t, "p");
});

test("plain text with blank lines is paragraphs", () => {
  assert.equal(parseMarkdown("One.\n\nTwo.\n\nThree.").length, 3);
});

test("normalizeBody leaves Markdown and plain text alone", () => {
  const md = "## Hello\n\nA **bold** line.\n\n- one\n- two";
  assert.equal(normalizeBody(md), md);
  assert.equal(normalizeBody("Just words, 1 < 2 and 3 > 2."), "Just words, 1 < 2 and 3 > 2.");
});

test("normalizeBody turns HTML into Markdown text and drops everything else, scripts included", () => {
  const html = '<h2>Title</h2><p>Hello <strong>there</strong> &amp; <em>you</em>. <a href="https://a.example/x">link</a></p><ul><li>one</li><li>two</li></ul><script>alert(1)</script><img src=x onerror=alert(1)><div onclick="x()">tail</div>';
  const md = normalizeBody(html);
  assert.ok(md.includes("## Title"));
  assert.ok(md.includes("Hello **there** & *you*. [link](https://a.example/x)"));
  assert.ok(md.includes("- one") && md.includes("- two"));
  assert.ok(md.includes("tail"));
  for (const bad of ["<script", "alert(1)", "onerror", "onclick", "<img", "<div"]) assert.ok(!md.includes(bad), bad);
});

test("HTML with a javascript: link ends up as plain text once parsed", () => {
  const md = normalizeBody('<p><a href="javascript:alert(1)">x</a></p>');
  const [p] = parseMarkdown(md) as { c: { t: string }[] }[];
  assert.ok(p.c.every((n) => n.t === "text"));
});

test("a link whose URL contains parentheses is kept whole — and a dangerous one leaves no stray text", () => {
  assert.deepEqual(parseInline("[Foo](https://en.wikipedia.org/wiki/Foo_(bar)) next"), [
    { t: "link", href: "https://en.wikipedia.org/wiki/Foo_(bar)", label: "Foo" },
    { t: "text", v: " next" },
  ]);
  assert.deepEqual(parseInline("see [x](javascript:alert(1)) now"), [
    { t: "text", v: "see " },
    { t: "text", v: "x" },
    { t: "text", v: " now" },
  ]);
});

test("an HTML href is read to the quote that opened it, so an inner quote or a javascript: URL cannot truncate or smuggle", () => {
  assert.equal(normalizeBody(`<p><a href="https://a.example/it's">x</a></p>`), "[x](https://a.example/it's)");
  assert.equal(normalizeBody(`<p><a href='https://a.example/say "hi"'>x</a></p>`), `[x](https://a.example/say "hi")`);
  const md = normalizeBody(`<p><a href="javascript:alert('xss')">click</a> and [md](javascript:alert('xss2'))</p>`);
  const [p] = parseMarkdown(md) as { c: { t: string; v?: string }[] }[];
  assert.ok(p.c.every((n) => n.t === "text"));
  assert.equal(toPlainText(md), "click and md");
});

test("toPlainText is what the parser reads: no Markdown syntax, link labels kept, images as alt text", () => {
  assert.equal(toPlainText("## Start early\n\nSee [the process](/weddings) and **bold** and `code`.\n\n- one\n- two\n\n> quote"), "Start early See the process and bold and code. one two quote");
  assert.equal(toPlainText("![Her stage](https://cdn.example/a.jpg)"), "Her stage");
  assert.equal(toPlainText("[Wiki](https://en.wikipedia.org/wiki/Foo_(bar)) next"), "Wiki next");
  assert.equal(toPlainText(""), "");
});
