import type { ReactNode } from "react";
import { parseMarkdown } from "./markdown.ts";
import type { Block, Inline } from "./markdown.ts";

// Renders a post body as React elements. There is no dangerouslySetInnerHTML
// and no HTML string anywhere: React escapes every text node, and the only
// attributes that come from a post are an href and an image src, which
// markdown.ts has already restricted (http/https/mailto/tel links, https images).
// Styling is the site's own: wrap in className="post-body" and style its children.

function inline(nodes: Inline[]): ReactNode[] {
  return nodes.map((n, i) => {
    switch (n.t) {
      case "text":
        return n.v;
      case "strong":
        return <strong key={i}>{inline(n.c)}</strong>;
      case "em":
        return <em key={i}>{inline(n.c)}</em>;
      case "code":
        return <code key={i}>{n.v}</code>;
      case "link": {
        const external = /^https?:/i.test(n.href);
        return (
          <a key={i} href={n.href} {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}>
            {n.label}
          </a>
        );
      }
    }
  });
}

function block(b: Block, i: number): ReactNode {
  switch (b.t) {
    case "h":
      return b.level === 2 ? <h2 key={i}>{inline(b.c)}</h2> : b.level === 3 ? <h3 key={i}>{inline(b.c)}</h3> : <h4 key={i}>{inline(b.c)}</h4>;
    case "p":
      return <p key={i}>{inline(b.c)}</p>;
    case "ul":
      return <ul key={i}>{b.items.map((it, j) => <li key={j}>{inline(it)}</li>)}</ul>;
    case "ol":
      return <ol key={i}>{b.items.map((it, j) => <li key={j}>{inline(it)}</li>)}</ol>;
    case "quote":
      return <blockquote key={i}>{inline(b.c)}</blockquote>;
    case "hr":
      return <hr key={i} />;
    case "img":
      // eslint-disable-next-line @next/next/no-img-element -- remote host is unknown, so next/image's allow-list cannot be set
      return <img key={i} src={b.src} alt={b.alt} loading="lazy" />;
  }
}

export function Markdown({ source, className }: { source: string; className?: string }) {
  return <div className={className}>{parseMarkdown(source).map(block)}</div>;
}
