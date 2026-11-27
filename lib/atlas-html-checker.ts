/** Verificador didatico, NAO e parser/validador HTML completo. Nao executa codigo. */
export type HtmlCriterion = { label: string; passed: boolean; detail: string };
export type HtmlReview = { criteria: HtmlCriterion[]; allPassed: boolean };

/** Remove comentarios para nao aceitar tags ficticias dentro deles. */
export function reviewHtmlDocument(source: string): HtmlReview {
  const html = source.replace(/<!--[\s\S]*?-->/g, "");
  const clean = html.replace(/<script\b[^>]*>[\s\S]*?<\/script\s*>/gi, "<script></script>")
    .replace(/<style\b[^>]*>[\s\S]*?<\/style\s*>/gi, "<style></style>");
  const hasDoctype = /^\s*<!doctype\s+html\s*>/i.test(clean);
  const hasHtml = /<html\b[^>]*>/i.test(clean) && /<\/html\s*>/i.test(clean);
  const hasHead = /<head\b[^>]*>/i.test(clean) && /<\/head\s*>/i.test(clean);
  const hasTitle = /<title\b[^>]*>\s*[^<\s][^<]*<\/title\s*>/i.test(clean);
  const hasBody = /<body\b[^>]*>/i.test(clean) && /<\/body\s*>/i.test(clean);
  const voidTags = new Set(["area","base","br","col","embed","hr","img","input","link","meta","param","source","track","wbr"]);
  const stack: string[] = [];
  let balanced = true;
  const tagRe = /<\s*(\/?)\s*([a-z][a-z0-9:-]*)\b([^<>]*?)>/gi;
  let match: RegExpExecArray | null;
  while ((match = tagRe.exec(clean))) {
    const name = match[2].toLowerCase();
    if (match[1]) { if (stack.pop() !== name) { balanced = false; break; } }
    else if (!voidTags.has(name) && !match[3].trimEnd().endsWith("/")) stack.push(name);
  }
  balanced = balanced && stack.length === 0 && !/<\s*\/?[a-z][^>]*$/i.test(clean);
  const criteria: HtmlCriterion[] = [
    {label:"Declaração <!DOCTYPE html> no início",passed:hasDoctype,detail:"Informe o tipo de documento antes da tag html."},
    {label:"Elemento <html> com fechamento",passed:hasHtml,detail:"Abra e feche o elemento raiz html."},
    {label:"Seção <head> com fechamento",passed:hasHead,detail:"Inclua a seção de metadados head."},
    {label:"<title> com texto não vazio",passed:hasTitle,detail:"Escreva um título descritivo dentro de title."},
    {label:"Elemento <body> com fechamento",passed:hasBody,detail:"Inclua o corpo visível do documento."},
    {label:"Tags reconhecidas pelo verificador bem aninhadas",passed:balanced,detail:"Confira a ordem de abertura e fechamento das tags."},
  ];
  return {criteria,allPassed:criteria.every(c=>c.passed)};
}
