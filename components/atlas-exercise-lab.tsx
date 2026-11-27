"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { ReactNode } from "react";
import Link from "next/link";
import type { AtlasExercise, ExerciseSet } from "@/lib/atlas-exercise-types";
import { reviewHtmlDocument } from "@/lib/atlas-html-checker";
import styles from "./atlas-exercise-lab.module.css";

type Saved = Record<string, { answer: string; attempts: number; checked?: boolean }>;
const keyFor = (id: string) => `atlas:exercise-lab:v1:${id}`;
const noop = (event: React.ClipboardEvent<HTMLTextAreaElement>) => event.preventDefault();

/** Laboratorio desacoplado: nao modifica progresso, banco existente ou sessao Supabase. */
export default function AtlasExerciseLab({ set }: { set: ExerciseSet }) {
  const [index, setIndex] = useState(0);
  const [saved, setSaved] = useState<Saved>({});
  const [ready, setReady] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [clearDialogOpen, setClearDialogOpen] = useState(false);
  const cancelClearRef = useRef<HTMLButtonElement>(null);
  const clearTriggerRef = useRef<HTMLButtonElement>(null);
  const [notice, setNotice] = useState("");
  const exercise = set.exercises[index];
  const state = saved[exercise.id] ?? { answer: "", attempts: 0 };
  const answer = state.answer;
  const editorRef = useRef<HTMLTextAreaElement>(null);
  useEffect(() => {
    try {
      const raw = localStorage.getItem(keyFor(set.id));
      setSaved(raw ? JSON.parse(raw) as Saved : {});
    } catch { setSaved({}); }
    setReady(true);
    setIndex(0);
  }, [set.id]);
  useEffect(() => { if (ready) { try { localStorage.setItem(keyFor(set.id), JSON.stringify(saved)); } catch { /* armazenamento indisponivel */ } } }, [ready, saved, set.id]);
  useEffect(() => { setShowHint(false); setNotice(""); setClearDialogOpen(false); }, [index, set.id]);
  useEffect(() => {
    if (!clearDialogOpen) return;
    cancelClearRef.current?.focus();
    function handleDialogKeys(event: KeyboardEvent) {
      if (event.key === "Escape") { event.preventDefault(); setClearDialogOpen(false); clearTriggerRef.current?.focus(); }
      if (event.key === "Tab") {
        const buttons = [cancelClearRef.current, document.getElementById("atlas-confirm-clear") as HTMLButtonElement | null].filter((el): el is HTMLButtonElement => Boolean(el));
        if (buttons.length !== 2) return;
        if (event.shiftKey && document.activeElement === buttons[0]) { event.preventDefault(); buttons[1].focus(); }
        else if (!event.shiftKey && document.activeElement === buttons[1]) { event.preventDefault(); buttons[0].focus(); }
      }
    }
    document.addEventListener("keydown", handleDialogKeys);
    return () => document.removeEventListener("keydown", handleDialogKeys);
  }, [clearDialogOpen]);
  const completed = useMemo(() => set.exercises.filter(q => (saved[q.id]?.attempts ?? 0) > 0).length, [saved, set.exercises]);
  function change(value: string) {
    setSaved(old => ({ ...old, [exercise.id]: { answer: value, attempts: old[exercise.id]?.attempts ?? 0, checked: false } }));
    setNotice("");
  }
  function verify() {
    if (!answer.trim()) { setNotice("Digite ou selecione uma resposta antes de continuar."); return; }
    if (exercise.kind === "text" && answer.trim().length < (exercise.minCharacters ?? 1)) {
      setNotice(`Sua resposta precisa ter ao menos ${exercise.minCharacters} caracteres para ser registrada.`); return;
    }
    setSaved(old => ({ ...old, [exercise.id]: { answer, attempts: (old[exercise.id]?.attempts ?? 0) + 1, checked: true } }));
    setNotice(exercise.kind === "choice" ? "Alternativa conferida." : exercise.kind === "code" && exercise.checker === "html-document" ? "Análise didática registrada. Este verificador não substitui um validador HTML completo." : "Tentativa registrada neste dispositivo. Sem correção automática para este formato.");
  }
  function go(next: number) { setIndex(Math.max(0, Math.min(set.exercises.length - 1, next))); }
  const availableKinds = (["choice", "text", "code"] as const).filter(kind => set.exercises.some(q => q.kind === kind));
  const kindLabel = (kind: "choice" | "text" | "code") => kind === "choice" ? "Marcação" : kind === "text" ? "Texto" : "Código";
  function goToKind(kind: "choice" | "text" | "code") {
    const first = set.exercises.findIndex(q => q.kind === kind);
    if (first >= 0) go(first);
  }
  const codeReview = exercise.kind === "code" && exercise.checker === "html-document" && state.checked ? reviewHtmlDocument(answer) : null;
  const correct = exercise.kind === "choice" && state.checked && answer === exercise.correctOptionId;
  return <section className={styles.root} aria-label="Laboratório de exercícios">
    <div className={styles.breadcrumb}><Link className={styles.returnLesson} href="/aula/C00-0-0" aria-label="Voltar à Aula 01 — Pensamento Computacional"><span className={styles.returnLessonIcon} aria-hidden="true">←</span><span>Voltar à Aula 01</span></Link><span>›</span><span>{set.course}</span><span>›</span><strong>Exercícios</strong></div>
    <header className={styles.hero}><div className={styles.heroIcon}>✦</div><div><span className={styles.chip}>LAB • demonstração isolada</span><p className={styles.eyebrow}>{set.lesson}</p><h1>Exercícios</h1><p>Pratique com calma. Os dados desta tela são exemplos e não alteram a avaliação oficial.</p></div></header>
    <nav className={styles.kindTabs} aria-label="Formatos disponíveis neste conjunto">
      <span className={styles.kindTabsTitle}>Formato do exercício</span>
      {availableKinds.map(kind => <button key={kind} type="button" className={exercise.kind === kind ? styles.kindSelected : ""} aria-current={exercise.kind === kind ? "true" : undefined} onClick={() => goToKind(kind)}>{kindLabel(kind)} <span>{set.exercises.filter(q => q.kind === kind).length}</span></button>)}
    </nav>
    <div className={styles.frame}>
      <aside className={styles.side}><div className={styles.sideTitle}>Trilha de exercícios</div><strong>{set.title}</strong><p>Respostas preservadas neste navegador por conjunto de demonstração.</p><div className={styles.progressRail}><span style={{width:`${completed / set.exercises.length * 100}%`}} /></div><small>{completed} de {set.exercises.length} tentativas registradas</small><nav className={styles.nav} aria-label="Selecionar exercício">{set.exercises.map((q,i) => <button type="button" key={q.id} onClick={() => go(i)} aria-current={i===index ? "step" : undefined} className={i===index ? styles.current : ""}><span className={styles.circle}>{i+1}</span><span><strong>Exercício {i+1}</strong><small>{q.kind === "choice" ? "Múltipla escolha" : q.kind === "text" ? "Texto" : `Código • ${q.language.toUpperCase()}`}</small></span>{(saved[q.id]?.attempts??0)>0 && <span aria-label="Tentativa registrada">✓</span>}</button>)}</nav></aside>
      <main className={styles.main}>
      <nav className={styles.questionNav} aria-label="Navegar entre questões">
        <button type="button" onClick={() => go(index-1)} disabled={index===0}>← Questão anterior</button>
        <strong>Questão {index+1} de {set.exercises.length}</strong>
        <button type="button" onClick={() => go(index+1)} disabled={index===set.exercises.length-1}>Próxima questão →</button>
      </nav>
      <div className={styles.bar}><div><span>Exercício {index + 1} de {set.exercises.length}</span><strong>{exercise.kind === "choice" ? "Marcação" : exercise.kind === "text" ? "Texto" : `Código · ${exercise.language.toUpperCase()}`}</strong></div><span className={styles.level}>Nível {exercise.level}/5</span></div>
      <div className={styles.card}><h2>{exercise.prompt}</h2><p className={styles.sub}>{exercise.instruction ?? "Responda antes de conferir sua tentativa."}</p>
      {exercise.kind === "choice" && <fieldset className={styles.options}><legend className={styles.srOnly}>Alternativas</legend>{exercise.options.map((opt,i) => {
        const chosen = answer === opt.id;
        const status = state.checked && opt.id === exercise.correctOptionId ? styles.correct : state.checked && chosen && !correct ? styles.incorrect : "";
        return <label key={opt.id} className={`${styles.option} ${chosen ? styles.selected : ""} ${status}`}><input type="radio" name={`${set.id}-${exercise.id}`} value={opt.id} checked={chosen} onChange={() => change(opt.id)}/><span className={styles.letter}>{String.fromCharCode(65+i)}</span><span>{opt.text}</span></label>;
      })}</fieldset>}
      {exercise.kind === "text" && <><label htmlFor={`written-${exercise.id}`} className={styles.fieldLabel}>Sua resposta</label><textarea id={`written-${exercise.id}`} className={styles.textarea} value={answer} onChange={e => change(e.target.value)} onPaste={noop} onDrop={e => e.preventDefault()} placeholder="Escreva com suas próprias palavras..." rows={7}/><p className={styles.count}>{answer.length} caracteres · Colagem desabilitada somente neste campo de exercício.</p></>}
      {exercise.kind === "code" && <CodeEditor key={exercise.id} exercise={exercise} answer={answer} update={change} editorRef={editorRef}/>}
      {notice && <p className={styles.notice} role="status">{notice}</p>}
      {state.checked && exercise.kind === "choice" && <div className={`${styles.feedback} ${correct ? styles.positive : styles.negative}`} role="status"><strong>{correct ? "Correto!" : "Ainda não. Revise o conceito."}</strong><p>{exercise.explanation}</p></div>}
      {state.checked && exercise.kind === "code" && codeReview && <div className={`${styles.codeReview} ${codeReview.allPassed ? styles.reviewPassed : styles.reviewPending}`} role="status"><strong>{codeReview.allPassed ? "Critérios básicos atendidos" : "Quase lá!"}</strong><p>{codeReview.allPassed ? "Os seis critérios didáticos passaram. Isso não comprova conformidade completa com o padrão HTML." : "Veja o que o verificador encontrou na sua resposta:"}</p><ul>{codeReview.criteria.map((criterion,i)=><li key={i} className={criterion.passed ? styles.criterionPassed : styles.criterionMissing}><span aria-hidden="true">{criterion.passed ? "✓" : "×"}</span><span><strong>{criterion.label}</strong>{!criterion.passed && <small>{criterion.detail}</small>}</span></li>)}</ul></div>}
      {state.checked && exercise.kind !== "choice" && !codeReview && <div className={styles.feedback} role="status"><strong>Tentativa registrada</strong><p>O laboratório não atribui nota automática a esta resposta. Use os critérios abaixo para autoavaliação.</p>{exercise.rubric && <ul>{exercise.rubric.map((c,i) => <li key={i}>{c}</li>)}</ul>}</div>}
      {exercise.kind === "code" && exercise.referenceSolution && <div className={styles.answerKey}>{state.attempts >= 2 ? <><strong>Exemplo de referência</strong><p>Esta é uma solução possível. Compare com os requisitos da questão.</p><pre>{exercise.referenceSolution}</pre></> : <p>🔒 Gabarito bloqueado. Disponível após 2 tentativas registradas ({state.attempts}/2).</p>}</div>}
      {showHint && <div className={styles.hint} role="note"><strong>Dica</strong><p>{exercise.hint ?? "Releia a explicação da aula e identifique o conceito principal antes de responder."}</p></div>}
      <div className={styles.actions}><button type="button" className={styles.secondary} onClick={() => go(index-1)} disabled={index===0}>← Questão anterior</button><div><button type="button" className={styles.secondary} onClick={() => setShowHint(v=>!v)}>{showHint ? "Ocultar dica" : "Dica"}</button>{exercise.kind === "code" && <button type="button" ref={clearTriggerRef} className={styles.secondary} onClick={() => setClearDialogOpen(true)}>Limpar</button>}<button type="button" className={styles.primary} onClick={verify}>Verificar resposta</button><button type="button" className={styles.secondary} onClick={() => go(index+1)} disabled={index===set.exercises.length-1}>Próxima questão →</button></div></div>
      </div></main>
      {clearDialogOpen && <div className={styles.clearBackdrop}>
        <div className={styles.clearModal} role="alertdialog" aria-modal="true" aria-labelledby="atlas-clear-title" aria-describedby="atlas-clear-description">
          <div className={styles.clearModalIcon} aria-hidden="true">↺</div>
          <h2 id="atlas-clear-title">Limpar resposta de código?</h2>
          <p id="atlas-clear-description">O código digitado neste exercício será apagado. Suas tentativas já registradas serão mantidas.</p>
          <p className={styles.clearModalNote}>Esta ação não altera as respostas de outros exercícios.</p>
          <div className={styles.clearModalActions}>
            <button type="button" className={styles.clearCancel} ref={cancelClearRef} onClick={() => { setClearDialogOpen(false); clearTriggerRef.current?.focus(); }}>Cancelar</button>
            <button type="button" className={styles.clearConfirm} id="atlas-confirm-clear" onClick={() => { change(""); setClearDialogOpen(false); clearTriggerRef.current?.focus(); }}>Sim, limpar resposta</button>
          </div>
        </div>
      </div>}
      <aside className={styles.right}><div className={styles.sideTitle}>Seu progresso</div><strong>{completed} de {set.exercises.length} exercícios</strong><div className={styles.progressRail}><span style={{width:`${completed / set.exercises.length * 100}%`}} /></div><p>O progresso desta demonstração é armazenado apenas no navegador, separado dos exercícios reais.</p><div className={styles.rules}><strong>Como funcionam</strong><p>{availableKinds.map(kind => kind === "choice" ? "Marcação: selecione uma alternativa." : kind === "text" ? "Texto: escreva uma justificativa." : "Código: digite no editor (sem execução nesta demonstração).").join(" ")}</p></div></aside>
    </div>
  </section>;
}

/** Tokenizacao apenas visual: o React escapa automaticamente o texto de cada token. */
function CodeColors({code, language}: {code: string;language: string}) {
  const tokens: ReactNode[] = [];
  const add = (text: string, cls?: string) => { if(text) tokens.push(<span key={tokens.length} className={cls ? (styles as Record<string,string>)[cls] : undefined}>{text}</span>); };
  const isHtml = language === "html" || language === "xml";
  if (isHtml) {
    const tags = /(<!--[\s\S]*?(?:-->|$))|(<![A-Za-z][^>]*>?)|(<\/?)([A-Za-z][\w:-]*)([^<>]*?)(\/?>)/g;
    let last = 0, match: RegExpExecArray | null;
    while ((match = tags.exec(code))) {
      add(code.slice(last, match.index));
      if (match[1]) add(match[1], "synComment");
      else if (match[2]) add(match[2], "synComment");
      else {
        add(match[3], "synPunctuation"); add(match[4], "synTag");
        const attrs = match[5] || "";
        const re = /(\s+)([^\s=\/>]+)(?:(\s*=\s*)("[^"]*"|'[^']*'|[^\s>]+))?/g;
        let a = 0, m: RegExpExecArray | null;
        while ((m = re.exec(attrs))) {
          add(attrs.slice(a, m.index));add(m[1]);add(m[2], "synAttribute");
          if (m[3]) add(m[3], "synPunctuation");
          if (m[4]) add(m[4], "synString");
          a = re.lastIndex;
        }
        add(attrs.slice(a));add(match[6], "synPunctuation");
      }
      last = tags.lastIndex;
    }
    add(code.slice(last));
  } else {
    const pattern = /(\/\/[^\n]*|\/\*[\s\S]*?(?:\*\/|$)|#[^\n]*$)|(\"(?:\\.|[^\"\\\n])*\"|'(?:\\.|[^'\\\n])*'|`(?:\\[\s\S]|[^`\\])*`)|(#[0-9a-fA-F]{3,8}\b)|(\b\d+(?:\.\d+)?(?:px|rem|em|vh|vw|%|s|ms)?\b)|([A-Za-z_$][\w$-]*)(\s*\()?|([=+*\/<>!&|?:%{}();,.\[\]-]+)|([\s\S])/gm;
    const keywords = /^(?:function|const|let|var|return|if|else|for|while|class|extends|new|import|from|export|default|async|await|def|print|True|False|None|try|except|catch|finally|throw|interface|type|public|private|static|yield)$/;
    const classes = /^(?:console|document|window|Math|JSON|Array|Object|String|Number|Promise|Date)$/;
    let m: RegExpExecArray | null;
    while ((m = pattern.exec(code))) {
      if (m[1]) add(m[1], "synComment");
      else if (m[2]) add(m[2], "synString");
      else if (m[3] || m[4]) add(m[3] || m[4], "synNumber");
      else if (m[5]) {
        add(m[5], keywords.test(m[5]) ? "synKeyword" : classes.test(m[5]) ? "synClass" : m[6] ? "synFunction" : undefined);
        if(m[6]) add(m[6]);
      } else if (m[7]) add(m[7],"synOperator");
      else add(m[8]);
    }
  }
  return <>{tokens}</>;
}

function CodeEditor({exercise,answer,update,editorRef}: {exercise: Extract<AtlasExercise,{kind:"code"}>;answer:string;update:(value:string)=>void;editorRef:React.RefObject<HTMLTextAreaElement | null>}) {
  const code = answer || "";
  const shown = code || exercise.starterCode || "";
  const lineCount = Math.max(10, shown.split("\n").length);
  const overlayRef = useRef<HTMLPreElement>(null);
  const gutterRef = useRef<HTMLDivElement>(null);
  function syncScroll(el: HTMLTextAreaElement) {
    if (overlayRef.current) overlayRef.current.style.transform = `translate(${-el.scrollLeft}px, ${-el.scrollTop}px)`;
    if (gutterRef.current) gutterRef.current.style.transform = `translateY(${-el.scrollTop}px)`;
  }
  return <div className={styles.editor}>
    <div className={styles.editorTitle}><span>〈/〉 {exercise.filename ?? `resposta.${exercise.language}`}</span><span>{exercise.language.toUpperCase()}</span></div>
    <div className={styles.editorBody}>
      <div className={styles.gutterViewport} aria-hidden="true"><div className={styles.gutter} ref={gutterRef}>{Array.from({length:lineCount},(_,i)=>i+1).join("\n")}</div></div>
      <div className={styles.codeOverlay}>
        <pre className={`${styles.codeHighlight} ${!code ? styles.codeStarter : ""}`} ref={overlayRef} aria-hidden="true"><CodeColors code={shown+"\n"} language={exercise.language}/></pre>
        <textarea aria-label={`Editor de código ${exercise.language}`} ref={editorRef} className={styles.codeArea} value={code} onChange={e=>update(e.target.value)} onScroll={e=>syncScroll(e.currentTarget)} onPaste={noop} onDrop={e=>e.preventDefault()} onBeforeInput={e=>{if(e.nativeEvent.inputType === "insertFromPaste" || e.nativeEvent.inputType === "insertFromDrop") e.preventDefault();}} onKeyDown={e=>{if(e.key === "Tab"){e.preventDefault();const el=e.currentTarget;const start=el.selectionStart;const end=el.selectionEnd;update(code.slice(0,start)+"  "+code.slice(end));requestAnimationFrame(()=>{el.selectionStart=el.selectionEnd=start+2;});}}} spellCheck={false} autoCapitalize="off" autoCorrect="off" wrap="off" rows={10} />
      </div>
    </div>
    <div className={styles.editorFoot}>Editor demonstrativo · Cores One Dark · Sem execução de código · Colagem desabilitada</div>
  </div>;
}
