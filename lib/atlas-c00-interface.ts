"use client";
import { useAtlasLanguage } from "@/lib/atlas-i18n";

const messages = {
  en: {
    "Aula": "Lesson", "Exercícios": "Exercises", "Avaliação": "Assessment", "Anotações": "Notes", "Referências": "References",
    "Objetivos da aula": "Lesson objectives", "Estudo de caso": "Case study", "Exemplo de algoritmo": "Algorithm example", "Exercício orientador": "Guided exercise",
    "Nesta aula você verá": "In this lesson", "Importante": "Important", "Trilha de fundamentos": "Fundamentals path", "Navegue livremente pelas aulas. Nenhuma está bloqueada.": "Browse lessons freely. None is locked.",
    "Cursos": "Courses", "Módulo": "Module", "Voltar": "Back", "Aula anterior": "Previous lesson", "Próxima aula": "Next lesson", "Anterior": "Previous", "Visão geral": "Overview", "Visão geral do curso": "Course overview", "Fim do curso": "End of course", "Primeira aula": "First lesson", "Você está na primeira aula": "You are on the first lesson",
    "Conteúdo didático em preparação e validação.": "Lesson content is being prepared and reviewed.",
    "Ainda não há exercícios cadastrados para esta aula.": "There are no exercises registered for this lesson yet.",
    "Avaliação de domínio": "Mastery assessment", "Referências existentes": "Available references",
    "Ainda não há referências verificadas cadastradas para esta aula.": "There are no verified references for this lesson yet.",
    "Exercícios curriculares da aula": "Curricular lesson exercises", "Trilha de exercícios": "Exercise path", "Formato do exercício": "Exercise format", "Marcação": "Multiple choice", "Texto": "Written response", "Nível": "Level", "Exercício": "Exercise", "Questão": "Question", "Questão anterior": "Previous question", "Próxima questão": "Next question", "Próxima questão →": "Next question →", "← Questão anterior": "← Previous question", "← Anterior": "← Previous", "Como estudar": "How to study", "Uma questão por vez": "One question at a time", "Sua justificativa": "Your reasoning", "Mostrar dica": "Show hint", "Ocultar dica": "Hide hint", "Verificar resposta": "Check answer", "Dica:": "Hint:", "Resposta correta!": "Correct answer!", "Revise esta alternativa.": "Review this choice.", "Critérios de autoavaliação": "Self-assessment criteria",
    "Português não traduzido": "This lesson's teaching material and questions are currently available in Portuguese. Interface labels are translated; full reviewed translations are being prepared."
  },
  es: {
    "Aula": "Clase", "Exercícios": "Ejercicios", "Avaliação": "Evaluación", "Anotações": "Notas", "Referências": "Referencias",
    "Objetivos da aula": "Objetivos de la clase", "Estudo de caso": "Caso práctico", "Exemplo de algoritmo": "Ejemplo de algoritmo", "Exercício orientador": "Ejercicio guiado",
    "Nesta aula você verá": "En esta clase verás", "Importante": "Importante", "Trilha de fundamentos": "Ruta de fundamentos", "Navegue livremente pelas aulas. Nenhuma está bloqueada.": "Explora las clases libremente. Ninguna está bloqueada.",
    "Cursos": "Cursos", "Módulo": "Módulo", "Voltar": "Volver", "Aula anterior": "Clase anterior", "Próxima aula": "Siguiente clase", "Anterior": "Anterior", "Visão geral": "Resumen", "Visão geral do curso": "Resumen del curso", "Fim do curso": "Fin del curso", "Primeira aula": "Primera clase", "Você está na primeira aula": "Estás en la primera clase",
    "Conteúdo didático em preparação e validação.": "El contenido didáctico está en preparación y revisión.",
    "Ainda não há exercícios cadastrados para esta aula.": "Todavía no hay ejercicios registrados para esta clase.",
    "Avaliação de domínio": "Evaluación de dominio", "Referências existentes": "Referencias disponibles",
    "Ainda não há referências verificadas cadastradas para esta aula.": "Todavía no hay referencias verificadas para esta clase.",
    "Exercícios curriculares da aula": "Ejercicios de la clase", "Trilha de exercícios": "Ruta de ejercicios", "Formato do exercício": "Formato del ejercicio", "Marcação": "Selección múltiple", "Texto": "Respuesta escrita", "Nível": "Nivel", "Exercício": "Ejercicio", "Questão": "Pregunta", "Questão anterior": "Pregunta anterior", "Próxima questão": "Siguiente pregunta", "Próxima questão →": "Siguiente pregunta →", "← Questão anterior": "← Pregunta anterior", "← Anterior": "← Anterior", "Como estudar": "Cómo estudiar", "Uma questão por vez": "Una pregunta a la vez", "Sua justificativa": "Tu justificación", "Mostrar dica": "Mostrar pista", "Ocultar dica": "Ocultar pista", "Verificar resposta": "Comprobar respuesta", "Dica:": "Pista:", "Resposta correta!": "¡Respuesta correcta!", "Revise esta alternativa.": "Revisa esta alternativa.", "Critérios de autoavaliação": "Criterios de autoevaluación",
    "Português não traduzido": "El material didáctico y las preguntas de esta clase todavía están en portugués. Las etiquetas de la interfaz están traducidas; las traducciones revisadas están en preparación."
  },
} as const;

export function useC00Interface() {
  const { language } = useAtlasLanguage();
  const t = (text: string): string => language === "pt-BR" ? text : (messages[language] as Record<string, string>)[text] ?? text;
  return { language, t };
}
