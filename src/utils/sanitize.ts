import sanitizeHtml from "sanitize-html";

const sanitizeOpts = {
  allowedTags: ["img", "br"],
  allowedAttributes: {
    img: ["src", "alt"],
  },
  allowedSchemes: ["data"],
  exclusiveFilter: (frame: any) => frame.attribs["data-js"] === "mathEditor",
};

export function sanitize(html: string) {
  return sanitizeHtml(convertLinksToRelative(html), { ...sanitizeOpts, allowedTags: ["div", "p", "img", "br"] });
}

function convertLinksToRelative(html: string) {
  return html.replace(new RegExp(document.location.origin, "g"), "");
}

export function escapeHTML(unsafe: string) {
  return unsafe
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
