import {
  a as c
} from "./V7X2J7BI.js";

// lib/contentMappers.ts
function m(t) {
  if (!t) return "";
  let n = "", s = t.split(`
`), r = !1, a = "", l = "", h = !1, g = [];
  for (let o = 0; o < s.length; o++) {
    let e = s[o];
    if (e.startsWith("```")) {
      r ? (n += `<!-- wp:code -->
<pre class="wp-block-code"><code${l ? ` class="language-${l}"` : ""}>${f(a.trim())}</code></pre>
<!-- /wp:code -->

`, r = !1, a = "", l = "") : (r = !0, l = e.slice(3).trim());
      continue;
    }
    if (r) {
      a += e + `
`;
      continue;
    }
    h && !e.match(/^[-*]\s/) && (n += `<!-- wp:list -->
<ul>
${g.map((i) => `<li>${i}</li>`).join(`
`)}
</ul>
<!-- /wp:list -->

`, h = !1, g = []);
    let u = e.match(/^#\s+(.+)$/), $ = e.match(/^##\s+(.+)$/), w = e.match(/^###\s+(.+)$/), d = e.match(/^####\s+(.+)$/);
    if (u)
      n += `<!-- wp:heading {"level":1} -->
<h1>${p(u[1])}</h1>
<!-- /wp:heading -->

`;
    else if ($)
      n += `<!-- wp:heading -->
<h2>${p($[1])}</h2>
<!-- /wp:heading -->

`;
    else if (w)
      n += `<!-- wp:heading {"level":3} -->
<h3>${p(w[1])}</h3>
<!-- /wp:heading -->

`;
    else if (d)
      n += `<!-- wp:heading {"level":4} -->
<h4>${p(d[1])}</h4>
<!-- /wp:heading -->

`;
    else if (e.match(/^[-*]\s+(.+)$/)) {
      h = !0;
      let i = e.match(/^[-*]\s+(.+)$/);
      i && g.push(p(i[1]));
    } else if (e.startsWith(">")) {
      let i = e.replace(/^>\s?/, "");
      n += `<!-- wp:quote -->
<blockquote class="wp-block-quote"><p>${p(i)}</p></blockquote>
<!-- /wp:quote -->

`;
    } else e.match(/^---+$/) ? n += `<!-- wp:separator -->
<hr class="wp-block-separator"/>
<!-- /wp:separator -->

` : e.trim() && (n += `<!-- wp:paragraph -->
<p>${p(e)}</p>
<!-- /wp:paragraph -->

`);
  }
  return h && g.length > 0 && (n += `<!-- wp:list -->
<ul>
${g.map((o) => `<li>${o}</li>`).join(`
`)}
</ul>
<!-- /wp:list -->

`), n.trim();
}
c(m, "markdownToGutenberg");
function p(t) {
  return t.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>").replace(/__(.+?)__/g, "<strong>$1</strong>").replace(/\*(.+?)\*/g, "<em>$1</em>").replace(/_(.+?)_/g, "<em>$1</em>").replace(/`([^`]+)`/g, "<code>$1</code>").replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>');
}
c(p, "processInlineFormatting");
function f(t) {
  return t.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;");
}
c(f, "escapeHtml");
function b(t) {
  return t.toLowerCase().trim().replace(/[^\w\s-]/g, "").replace(/\s+/g, "-").replace(/-+/g, "-").replace(/^-|-$/g, "");
}
c(b, "generateSlug");
function k(t, n = 160) {
  if (!t) return "";
  let s = t.replace(/#+\s+/g, "").replace(/\*\*(.+?)\*\*/g, "$1").replace(/\*(.+?)\*/g, "$1").replace(/\[([^\]]+)\]\([^)]+\)/g, "$1").replace(/`([^`]+)`/g, "$1").replace(/```[\s\S]*?```/g, "").replace(/>\s+/g, "").replace(/[-*]\s+/g, "").trim(), r = s.split(`

`)[0] || s;
  if (r.length <= n)
    return r;
  let a = r.substring(0, n), l = a.lastIndexOf(" ");
  return (l > 0 ? a.substring(0, l) : a) + "...";
}
c(k, "extractExcerpt");

export {
  m as a,
  b,
  k as c
};
//# sourceMappingURL=QT5QKEG6.js.map
