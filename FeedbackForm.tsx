"use client";

import { useRef, useState } from "react";
import { SECTIONS, type Question } from "./questions";
import s from "./feedback.module.css";

// Google Apps Script web app URL (see apps-script/Code.gs). Set in Vercel env vars.
const ENDPOINT = process.env.NEXT_PUBLIC_FEEDBACK_ENDPOINT ?? "";
const OTHER = "__other";

type Answers = Record<string, string | string[]>;

export default function FeedbackForm() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Answers>({});
  const [other, setOther] = useState<Record<string, string>>({});
  const [invalid, setInvalid] = useState<string[]>([]);
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [honeypot, setHoneypot] = useState("");
  const topRef = useRef<HTMLDivElement>(null);

  const section = SECTIONS[step];
  const last = step === SECTIONS.length - 1;

  const isAnswered = (q: Question) => {
    const v = answers[q.id];
    if (!v || (Array.isArray(v) && v.length === 0)) return false;
    if (v === OTHER) return (other[q.id] ?? "").trim().length > 0;
    return true;
  };

  const set = (id: string, value: string | string[]) => {
    setAnswers((a) => ({ ...a, [id]: value }));
    setInvalid((list) => list.filter((x) => x !== id));
  };

  const toggle = (id: string, opt: string) => {
    const cur = (answers[id] as string[] | undefined) ?? [];
    set(id, cur.includes(opt) ? cur.filter((o) => o !== opt) : [...cur, opt]);
  };

  const validate = () => {
    const missing = section.questions.filter((q) => q.required && !isAnswered(q)).map((q) => q.id);
    setInvalid(missing);
    if (missing.length) {
      const el = document.getElementById(`q-${missing[0]}`);
      el?.scrollIntoView({ behavior: "smooth", block: "center" });
      el?.querySelector<HTMLInputElement>("input")?.focus({ preventScroll: true });
    }
    return missing.length === 0;
  };

  const go = (next: number) => {
    setStep(next);
    setInvalid([]);
    requestAnimationFrame(() => {
      topRef.current?.scrollIntoView({ behavior: "smooth" });
      document.getElementById(`section-${next}`)?.focus({ preventScroll: true });
    });
  };

  const payload = () => {
    const out: Record<string, string> = { website: honeypot };
    SECTIONS.flatMap((sec) => sec.questions).forEach((q) => {
      const v = answers[q.id];
      const vals = Array.isArray(v) ? v : v ? [v] : [];
      out[q.id] = vals.map((x) => (x === OTHER ? `Other: ${(other[q.id] ?? "").trim()}` : x)).join("; ");
    });
    return out;
  };

  const submit = async () => {
    if (!ENDPOINT) {
      setStatus("error");
      return;
    }
    setStatus("sending");
    try {
      const res = await fetch(ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "text/plain;charset=utf-8" }, // simple request, no CORS preflight
        body: JSON.stringify(payload()),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || data.ok === false) throw new Error();
      setStatus("sent");
      requestAnimationFrame(() => topRef.current?.scrollIntoView({ behavior: "smooth" }));
    } catch {
      setStatus("error");
    }
  };

  const onNext = () => {
    if (!validate()) return;
    if (last) submit();
    else go(step + 1);
  };

  if (status === "sent") {
    return (
      <section className={s.page} ref={topRef}>
        <div className={s.inner}>
          <p className="eyebrow">Open Spaces</p>
          <h1 className={`font-display ${s.title}`}>Thank You</h1>
          <p className={s.thanks}>
            Thank you for taking the time to share. Your voice is shaping what Open Spaces offers next, and I’m so
            grateful you were part of this group.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className={s.page}>
      <div className={s.inner} ref={topRef}>
        {step === 0 && (
          <header className={s.head}>
            <p className="eyebrow">Open Spaces Small Group</p>
            <h1 className={`font-display ${s.title}`}>Share Your Feedback</h1>
            <p className={s.intro}>
              Thank you for being part of the Open Spaces small group. Your honest feedback will help shape what Open
              Spaces offers women in the future. Answers are confidential, and you can skip any question you’d rather
              not answer.
            </p>
          </header>
        )}

        <div className={s.progress} aria-hidden="true">
          {SECTIONS.map((_, i) => (
            <span key={i} className={i <= step ? s.done : undefined} />
          ))}
        </div>
        <p className={s.meta}>
          Part {step + 1} of {SECTIONS.length}
        </p>

        <form className={s.card} onSubmit={(e) => e.preventDefault()} noValidate>
          <h2 id={`section-${step}`} tabIndex={-1} className={`font-display ${s.sectionTitle}`}>
            {section.title}
          </h2>

          {/* Honeypot: hidden from people, bots fill it in */}
          <div className={s.hp} aria-hidden="true">
            <label>
              Website
              <input tabIndex={-1} autoComplete="off" value={honeypot} onChange={(e) => setHoneypot(e.target.value)} />
            </label>
          </div>

          {section.questions.map((q) => {
            const bad = invalid.includes(q.id);
            const errId = `err-${q.id}`;

            if (q.type === "paragraph") {
              return (
                <div key={q.id} id={`q-${q.id}`} className={s.q}>
                  <label htmlFor={q.id} className={s.qText}>
                    {q.text} <span className={s.optional}>(optional)</span>
                  </label>
                  <textarea
                    id={q.id}
                    className={s.input}
                    maxLength={5000}
                    rows={4}
                    value={(answers[q.id] as string) ?? ""}
                    onChange={(e) => set(q.id, e.target.value)}
                  />
                </div>
              );
            }

            return (
              <fieldset key={q.id} id={`q-${q.id}`} className={s.q} aria-describedby={bad ? errId : undefined}>
                <legend className={s.qText}>{q.text}</legend>

                {q.type === "scale" && (
                  <>
                    <div className={s.scale}>
                      {[1, 2, 3, 4, 5].map((n) => (
                        <label key={n} className={s.scaleItem}>
                          <input
                            type="radio"
                            name={q.id}
                            value={n}
                            checked={answers[q.id] === String(n)}
                            onChange={() => set(q.id, String(n))}
                            aria-label={n === 1 ? `1, ${q.low}` : n === 5 ? `5, ${q.high}` : String(n)}
                          />
                          <span>{n}</span>
                        </label>
                      ))}
                    </div>
                    <div className={s.scaleEnds} aria-hidden="true">
                      <span>1 = {q.low}</span>
                      <span>5 = {q.high}</span>
                    </div>
                  </>
                )}

                {q.type === "checkbox" && (
                  <>
                    {q.hint && <p className={s.hint}>{q.hint}</p>}
                    {q.options.map((o) => (
                      <label key={o} className={s.opt}>
                        <input
                          type="checkbox"
                          checked={((answers[q.id] as string[]) ?? []).includes(o)}
                          onChange={() => toggle(q.id, o)}
                        />
                        <span>{o}</span>
                      </label>
                    ))}
                  </>
                )}

                {q.type === "radio" && (
                  <>
                    {q.options.map((o) => (
                      <label key={o} className={s.opt}>
                        <input type="radio" name={q.id} checked={answers[q.id] === o} onChange={() => set(q.id, o)} />
                        <span>{o}</span>
                      </label>
                    ))}
                    {q.other && (
                      <>
                        <label className={s.opt}>
                          <input
                            type="radio"
                            name={q.id}
                            checked={answers[q.id] === OTHER}
                            onChange={() => set(q.id, OTHER)}
                          />
                          <span>Other</span>
                        </label>
                        {answers[q.id] === OTHER && (
                          <input
                            className={`${s.input} ${s.otherInput}`}
                            aria-label="Other, please describe"
                            placeholder="Please describe"
                            maxLength={1000}
                            autoFocus
                            value={other[q.id] ?? ""}
                            onChange={(e) => {
                              setOther((x) => ({ ...x, [q.id]: e.target.value }));
                              setInvalid((list) => list.filter((id) => id !== q.id));
                            }}
                          />
                        )}
                      </>
                    )}
                  </>
                )}

                {bad && (
                  <p id={errId} className={s.error}>
                    {answers[q.id] === OTHER
                      ? "Describe your “Other” answer to continue."
                      : q.type === "checkbox"
                        ? "Choose at least one option to continue."
                        : q.type === "scale"
                          ? "Choose a number from 1 to 5 to continue."
                          : "Choose an option to continue."}
                  </p>
                )}
              </fieldset>
            );
          })}

          {status === "error" && (
            <p className={s.error} role="alert">
              {ENDPOINT
                ? "Your feedback didn’t send. Check your connection and select Send Feedback again. Your answers are still here."
                : "This form isn’t connected to its spreadsheet yet. Set NEXT_PUBLIC_FEEDBACK_ENDPOINT in Vercel."}
            </p>
          )}

          <div className={s.nav}>
            {step > 0 && (
              <button type="button" className={`${s.btn} ${s.btnOutline}`} onClick={() => go(step - 1)}>
                Back
              </button>
            )}
            <button
              type="button"
              className={`${s.btn} ${s.btnPrimary}`}
              onClick={onNext}
              disabled={status === "sending"}
            >
              {status === "sending" ? "Sending…" : last ? "Send Feedback" : "Continue"}
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}
