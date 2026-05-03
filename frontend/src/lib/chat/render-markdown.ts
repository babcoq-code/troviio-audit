function renderInlineMarkdown(input: string): string {
  // Échapper le HTML d'abord pour éviter les injections XSS
  const escaped = input
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
  // Puis appliquer les patterns markdown sur le texte échappé
  return escaped
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    .replace(/(^|[\s.,;:!?])_(.+?)_($|[\s.,;:!?])/g, "$1<em>$2</em>$3")
    .replace(/`(.+?)`/g, "<code>$1</code>");
}

function renderParagraph(paragraph: string): string {
  const lines = paragraph.split("\n").map((l) => l.trim()).filter(Boolean);
  if (lines.length === 0) return "";

  const isBulletList = lines.every((l) => /^[-•]\s+/.test(l));
  if (isBulletList) {
    const items = lines
      .map((l) => l.replace(/^[-•]\s+/, "").trim())
      .filter(Boolean)
      .map((item) => `<li>${renderInlineMarkdown(item)}</li>`)
      .join("");
    return `<ul>${items}</ul>`;
  }

  const content = lines.map(renderInlineMarkdown).join("<br />");
  return `<p>${content}</p>`;
}

export function renderMarkdown(text: string): string {
  const normalizedText = text.replace(/\r\n/g, "\n").trim();
  if (!normalizedText) return "";
  // D'abord render les patterns markdown (gras, italique, code)
  const rendered = normalizedText
    .split(/\n{2,}/)
    .map(renderParagraph)
    .filter(Boolean)
    .join("");
  // Ensuite escape uniquement le HTML non-markdown résiduel
  return rendered;
}
