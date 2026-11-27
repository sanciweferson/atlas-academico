"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { browserSupabase } from "@/lib/supabase";
import type { ExerciseSet } from "@/lib/atlas-exercise-types";
import styles from "./atlas-exercise-lab.module.css";
import { useC00Interface } from "@/lib/atlas-c00-interface";

type Entry = { answer: string; attempts: number; checked: boolean };
type Store = Record<string, Entry>;
type Identity = { status: "loading" | "error" } | { status: "ready"; scope: string };
const storageKey = (scope: string, id: string) => `atlas:module-exercises:v1:${scope}:${id}`;
const emptyEntry = (): Entry => ({ answer: "", attempts: 0, checked: false });
function safeParse(raw: string | null): Store {
  if (!raw) return {};
  const input: unknown = JSON.parse(raw);
  if (!input || Array.isArray(input) || typeof input !== "object") throw new Error("Estrutura inválida");
  const result: Store = {};
  for (const [id, value] of Object.entries(input)) {
    if (!value || typeof value !== "object" || Array.isArray(value)) continue;
    const item = value as Record<string, unknown>;
    if (typeof item.answer !== "string" || item.answer.length > 200_000) continue;
    if (!Number.isSafeInteger(item.attempts) || (item.attempts as number) < 0 || (item.attempts as number) > 100000) continue;
    result[id] = { answer: item.answer, attempts: item.attempts as number, checked: item.checked === true };
  }
  return result;
}
/** Exercícios curriculares, isolados de Practice legado e dos exemplos do LAB. */
export default function AtlasModuleExercises({ set }: { set: ExerciseSet }) {
  const [identity, setIdentity] = useState<Identity>({ status: "loading" });
  useEffect(() => {
    let active = true;
    let version = 0;
    const supabase = browserSupabase();
    if (!supabase) { setIdentity({ status: "ready", scope: "visitante" }); return; }
    async function verify() {
      const current = ++version;
      setIdentity({ status: "loading" });
      try {
        const { data: session, error: sessionError } = await supabase!.auth.getSession();
        if (!active || current !== version) return;
        if (sessionError) { setIdentity({ status: "error" }); return; }
        if (!session.session) { setIdentity({ status: "ready", scope: "visitante" }); return; }
        const { data, error } = await supabase!.auth.getUser();
        if (!active || current !== version) return;
        setIdentity(error || !data.user ? { status: "error" } : { status: "ready", scope: `usuario:${data.user.id}` });
      } catch { if (active && current === version) setIdentity({ status: "error" }); }
    }
    const { data: { subscription } } = supabase.auth.onAuthStateChange(event => {
      if (!active || event === "INITIAL_SESSION" || event === "TOKEN_REFRESHED") return;
      if (event === "SIGNED_OUT") { ++version; setIdentity({ status: "ready", scope: "visitante" }); }
      else if (event === "SIGNED_IN" || event === "USER_UPDATED") { ++version; setIdentity({ status: "loading" }); Promise.resolve().then(() => { if (active) void verify(); }); }
    });
    void verify();
    return () => { active = false; ++version; subscription.unsubscribe(); };
  }, []);
  if (identity.status !== "ready") {
    if (identity.status === "loading") return <div className={styles.card} role="status">Verificando a sessão para recuperar suas respostas…</div>;
    return <div className={styles.card} role="alert">Não foi possível verificar sua conta. Nenhuma resposta será alterada. Atualize a página para tentar novamente.</div>;
  }
  return <ExerciseWorkspace key={`${identity.scope}:${set.id}`} scope={identity.scope} set={set} />;
}

function ExerciseWorkspace({ set, scope }: { set: ExerciseSet; scope: string }) {
  const { t } = useC00Interface();
  const [index, setIndex] = useState(0);
  const questionRef = useRef<HTMLDivElement>(null);
  const [saved, setSaved] = useState<Store>({});
  const [ready, setReady] = useState(false);
  const [readError, setReadError] = useState(false);
  const [notice, setNotice] = useState("");
  const [showHint, setShowHint] = useState(false);
  const exercise = set.exercises[index];
  const entry = saved[exercise.id] ?? emptyEntry();
  const completed = useMemo(() => set.exercises.filter(q => (saved[q.id]?.attempts ?? 0) > 0).length, [saved, set.exercises]);
  const kinds = (["choice", "text"] as const).filter(k => set.exercises.some(q => q.kind === k));
  useEffect(() => {
    try { setSaved(safeParse(localStorage.getItem(storageKey(scope, set.id)))); }
    catch { setReadError(true); }
    setReady(true);
  }, [scope, set.id]);
  useEffect(() => { if (ready && !readError) { try { localStorage.setItem(storageKey(scope, set.id), JSON.stringify(saved)); } catch { /* armazenamento indisponível */ } } }, [saved, ready, readError, scope, set.id]);
  function change(answer: string) { setSaved(old => ({ ...old, [exercise.id]: { ...old[exercise.id], answer, attempts: old[exercise.id]?.attempts ?? 0, checked: false } })); setNotice(""); }
  function go(i: number, revealOnMobile = false) {
    setIndex(Math.max(0, Math.min(set.exercises.length - 1, i)));
    setShowHint(false);
    setNotice("");
    // No mobile a trilha vem DEPOIS da questao: selecionar deve revelar o enunciado.
    if (revealOnMobile && window.matchMedia("(max-width: 950px)").matches) {
      requestAnimationFrame(() => {
        const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        questionRef.current?.scrollIntoView({ behavior: reducedMotion ? "auto" : "smooth", block: "start" });
      });
    }
  }
  function verify() {
    if (!entry.answer.trim()) { setNotice("Responda antes de verificar sua tentativa."); return; }
    if (exercise.kind === "text" && entry.answer.trim().length < (exercise.minCharacters ?? 1)) { setNotice(`Escreva pelo menos ${exercise.minCharacters} caracteres para registrar sua justificativa.`); return; }
    setSaved(old => ({ ...old, [exercise.id]: { ...entry, checked: true, attempts: (old[exercise.id]?.attempts ?? 0) + 1 } }));
    setNotice(exercise.kind === "choice" ? "Alternativa conferida. Leia a explicação abaixo." : "Tentativa registrada. Sua justificativa não é corrigida automaticamente; confira os critérios de autoavaliação.");
  }
  if (readError) return <div className={styles.card} role="alert">As respostas já salvas não puderam ser lidas. Para não sobrescrevê-las, esta sessão de exercícios foi bloqueada. Faça uma cópia dos dados ou resolva o problema de armazenamento antes de continuar.</div>;
  if (!ready) return <div className={styles.card} role="status">Recuperando suas respostas…</div>;
  const correct = exercise.kind === "choice" && entry.checked && entry.answer === exercise.correctOptionId;
  return <section className={styles.root} aria-label="Exercícios curriculares da aula">
    <header className={styles.hero}><div className={styles.heroIcon} aria-hidden="true">✦</div><div><span className={styles.chip}>EXERCÍCIOS • MÓDULO {String(Number(set.id.match(/curricular-C00-(\d+)-/)?.[1] ?? 0) + 1).padStart(2, "0")}</span><h2>{set.title}</h2><p>Pratique do nível 1 ao 5. Marcação recebe correção objetiva; texto exige autoavaliação pelos critérios.</p></div></header>
    <nav className={styles.kindTabs} aria-label="Tipos de exercício"><span className={styles.kindTabsTitle}>{t("Formato do exercício")}</span>{kinds.map(kind => <button key={kind} type="button" className={exercise.kind === kind ? styles.kindSelected : ""} aria-current={exercise.kind === kind ? "true" : undefined} onClick={() => go(set.exercises.findIndex(q=>q.kind===kind), true)}>{kind === "choice" ? t("Marcação") : t("Texto")} <span>{set.exercises.filter(q=>q.kind===kind).length}</span></button>)}</nav>
    <div className={styles.frame}>
      <aside className={styles.side}><div className={styles.sideTitle}>{t("Trilha de exercícios")}</div><strong>{set.lesson}</strong><p>Respostas locais separadas por aula e conta verificada. O progresso oficial não é modificado.</p><div className={styles.progressRail}><span style={{width:`${completed/set.exercises.length*100}%`}}/></div><small>{completed} de {set.exercises.length} questões tentadas</small><nav className={styles.nav} aria-label="Escolher questão" tabIndex={0}>{set.exercises.map((q,i)=><button type="button" key={q.id} className={i===index?styles.current:""} aria-current={i===index?"step":undefined} onClick={()=>go(i, true)}><span className={styles.circle}>{i+1}</span><span><strong>Exercício {i+1}</strong><small>{q.kind==="choice"?"Marcação":"Texto"} · nível {q.level}</small></span>{(saved[q.id]?.attempts??0)>0?<span aria-label="Tentativa registrada">✓</span>:null}</button>)}</nav></aside>
      <div className={styles.main} ref={questionRef}>
        <nav className={styles.questionNav} aria-label="Navegar entre questões"><button type="button" disabled={index===0} onClick={()=>go(index-1)}>← Questão anterior</button><strong>Questão {index+1} de {set.exercises.length}</strong><button type="button" disabled={index===set.exercises.length-1} onClick={()=>go(index+1)}>Próxima questão →</button></nav>
        <div className={styles.bar}><div><span>Exercício {index+1} de {set.exercises.length}</span><strong>{exercise.kind==="choice"?"Marcação":"Texto"}</strong></div><span className={styles.level}>Nível {exercise.level}/5</span></div>
        <div className={styles.card}><h2>{exercise.prompt}</h2><p className={styles.sub}>{exercise.instruction??"Responda e verifique sua tentativa."}</p>
          {exercise.kind==="choice"?<fieldset className={styles.options}><legend className={styles.srOnly}>Escolha uma alternativa</legend>{exercise.options.map((option,i)=><label key={option.id} className={`${styles.option} ${entry.answer===option.id?styles.selected:""} ${entry.checked&&option.id===exercise.correctOptionId?styles.correct:""} ${entry.checked&&entry.answer===option.id&&!correct?styles.incorrect:""}`}><input type="radio" name={`${set.id}-${exercise.id}`} value={option.id} checked={entry.answer===option.id} onChange={()=>change(option.id)}/><span className={styles.letter}>{String.fromCharCode(65+i)}</span><span>{option.text}</span></label>)}</fieldset>:exercise.kind==="text"?<><label className={styles.fieldLabel} htmlFor={`text-${exercise.id}`}>{t("Sua justificativa")}</label><textarea id={`text-${exercise.id}`} className={styles.textarea} rows={8} value={entry.answer} onChange={e=>change(e.target.value)} onPaste={e=>e.preventDefault()} onDrop={e=>e.preventDefault()} onBeforeInput={e=>{if(["insertFromPaste","insertFromDrop"].includes(e.nativeEvent.inputType))e.preventDefault();}} placeholder="Escreva com suas próprias palavras…"/><p className={styles.count}>{entry.answer.length} caracteres · Colagem bloqueada neste campo de exercício.</p></>:null}
          {notice&&<p className={styles.notice} role="status">{notice}</p>}
          {entry.checked&&exercise.kind==="choice"&&<div className={`${styles.feedback} ${correct?styles.positive:styles.negative}`} role="status"><strong>{correct?t("Resposta correta!"):t("Revise esta alternativa.")}</strong><p>{exercise.explanation}</p></div>}
          {entry.attempts>0&&exercise.kind==="text"&&<div className={styles.feedback}><strong>{t("Critérios de autoavaliação")}</strong><p>Compare sua resposta com os critérios. O sistema não atribui nota automática a textos.</p><ul>{exercise.rubric?.map(r=><li key={r}>{r}</li>)}</ul></div>}
          {showHint&&exercise.hint&&<div className={styles.hint}><strong>Dica:</strong> {exercise.hint}</div>}
          <div className={styles.actions}><button type="button" className={styles.secondary} disabled={!exercise.hint} onClick={()=>setShowHint(!showHint)}>{showHint?t("Ocultar dica"):t("Mostrar dica")}</button><button type="button" className={styles.primary} onClick={verify}>{t("Verificar resposta")}</button></div>
        </div>
        <nav className={styles.questionNav} aria-label="Navegação após resposta"><button type="button" disabled={index===0} onClick={()=>go(index-1)}>← Anterior</button><strong>{index+1} / {set.exercises.length}</strong><button type="button" disabled={index===set.exercises.length-1} onClick={()=>go(index+1)}>Próxima questão →</button></nav>
      </div>
      <aside className={styles.right}><div className={styles.sideTitle}>{t("Como estudar")}</div><strong>{t("Uma questão por vez")}</strong><p>Leia, tente sem consultar respostas e explique por que sua solução atende aos critérios. Em questões discursivas, a avaliação exige análise humana ou autoavaliação cuidadosa.</p><div className={styles.rules}><strong>{t("Importante")}</strong><p>A conclusão desta lista não representa aprovação em prova nem atualiza o progresso oficial. As avaliações terão interface própria.</p></div></aside>
    </div>
  </section>;
}
