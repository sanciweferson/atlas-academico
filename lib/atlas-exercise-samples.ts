import type { ExerciseSet } from "./atlas-exercise-types";
/** EXEMPLOS DE INTERFACE; NAO SAO CONTEUDO CURRICULAR PUBLICADO. */
export const foundationDemo: ExerciseSet = {
  id: "lab-demo-c00-0-0", title: "Pensamento computacional", course: "Fundamentos da Computação", lesson: "Aula 01 — Definições e terminologia",
  exercises: [
    { id: "c00-demo-1", kind: "choice", level: 1, prompt: "Qual alternativa melhor descreve um algoritmo?", instruction: "Selecione uma alternativa antes de verificar.", options: [
      { id: "a", text: "Uma sequência organizada de instruções para resolver um problema ou realizar uma tarefa." },
      { id: "b", text: "Somente um programa escrito em JavaScript." },
      { id: "c", text: "Uma peça física localizada dentro do computador." },
      { id: "d", text: "Um tipo de conexão com a Internet." },
    ], correctOptionId: "a", explanation: "Um algoritmo descreve passos e pode existir sem estar escrito em uma linguagem de programação." },
    { id: "c00-demo-2", kind: "text", level: 2, prompt: "Explique a diferença entre um problema e um algoritmo.", instruction: "Responda com suas palavras e use um exemplo do cotidiano.", minCharacters: 35, hint: "Pense no objetivo a alcançar e no procedimento para alcançá-lo.", rubric: ["Distingue o objetivo das etapas", "Apresenta sequência lógica", "Fornece exemplo coerente"] },
    { id: "c00-demo-3", kind: "choice", level: 3, prompt: "Um roteiro contém instruções ambíguas. Qual é o problema principal?", options: [
      { id: "a", text: "Todas as pessoas o executarão exatamente da mesma maneira." },
      { id: "b", text: "Pode levar a interpretações e resultados diferentes." },
      { id: "c", text: "Passa automaticamente a ser um programa de computador." },
      { id: "d", text: "Não pode mais ser representado por um fluxograma." },
    ], correctOptionId: "b", explanation: "Instruções ambíguas comprometem a reprodutibilidade e a clareza da solução." },
  ],
};
export const htmlDemo: ExerciseSet = {
  id: "lab-demo-html", title: "HTML — estruturas e semântica", course: "Desenvolvimento Web", lesson: "Demonstração de editor de código",
  exercises: [
    { id: "html-demo-1", kind: "code", level: 2, language: "html", filename: "index.html", prompt: "Escreva uma estrutura mínima de documento HTML.", instruction: "Inclua doctype, html, head, title e body. O código não será executado nesta demonstração.", starterCode: "<!DOCTYPE html>\n<html lang=\"pt-BR\">\n  <head>\n    <title></title>\n  </head>\n  <body>\n  </body>\n</html>", checker: "html-document", referenceSolution: "<!DOCTYPE html>\n<html lang=\"pt-BR\">\n  <head>\n    <title>Minha página</title>\n  </head>\n  <body>\n    <h1>Olá, Atlas!</h1>\n  </body>\n</html>", rubric: ["Documento bem estruturado", "Título significativo", "Elementos fechados apropriadamente"] },
    { id: "html-demo-2", kind: "text", level: 3, prompt: "Explique por que usar elementos semânticos em HTML.", minCharacters: 30, rubric: ["Explica a função semântica", "Relaciona com acessibilidade"] },
    { id: "html-demo-3", kind: "choice", level: 1, prompt: "Qual elemento representa o conteúdo principal da página?", options: [ {id:"a",text:"<main>"},{id:"b",text:"<span>"},{id:"c",text:"<br>"},{id:"d",text:"<b>"} ], correctOptionId:"a", explanation:"O elemento main representa o conteúdo principal do documento." },
  ],
};
