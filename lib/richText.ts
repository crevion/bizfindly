import DOMPurify from "dompurify";

export const richTextClass =
  "leading-relaxed [&_p]:my-2 [&_h2]:my-3 [&_h2]:text-xl [&_h2]:font-bold [&_h3]:my-2 [&_h3]:text-lg [&_h3]:font-semibold [&_ul]:list-disc [&_ul]:pl-6 [&_ol]:list-decimal [&_ol]:pl-6 [&_blockquote]:border-l-2 [&_blockquote]:pl-4 [&_blockquote]:italic";

export function descriptionHtml(value: string): string {
  const html = /<\/?[a-z][^>]*>/i.test(value)
    ? value
    : `<p>${value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/\n/g, "<br>")}</p>`;
  return DOMPurify.sanitize(html, {
    ALLOWED_TAGS: [
      "p",
      "br",
      "strong",
      "b",
      "em",
      "i",
      "u",
      "s",
      "h2",
      "h3",
      "ul",
      "ol",
      "li",
      "blockquote",
    ],
    ALLOWED_ATTR: [],
  });
}
