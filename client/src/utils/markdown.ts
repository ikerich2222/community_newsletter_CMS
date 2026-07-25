export function renderMarkdown(content: string) {
  const escaped = content
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");

  const blocks = escaped
    .split(/\n{2,}/)
    .map((block) => block.trim())
    .filter(Boolean);

  return blocks
    .map((block) => {
      if (/^#{1,6}\s/.test(block)) {
        const level = block.match(/^#+/)?.[0].length ?? 1;
        const text = block.replace(/^#{1,6}\s/, "");
        return `<h${level}>${text}</h${level}>`;
      }

      if (/^[-*]\s/.test(block)) {
        const items = block
          .split(/\n/)
          .filter((line) => /^[-*]\s/.test(line))
          .map((line) => `<li>${line.replace(/^[-*]\s/, "")}</li>`)
          .join("");
        return `<ul>${items}</ul>`;
      }

      return `<p>${block.replace(/\n/g, "<br />")}</p>`;
    })
    .join("");
}
