import { useEffect, useId, useRef, useState } from "react";
import { MessageCircle, Send, X } from "lucide-react";
import { askOfficer, type OfficerReply } from "@/lib/gelato/officer";

type Turn = OfficerReply & { role: "guest" | "officer" };

const STARTERS = ["Opening hours", "What's in the case?", "Order 2 Sicilian Pistachio", "What is pistachio"];

export function OfficerWidget() {
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const [draft, setDraft] = useState("");
  const [turns, setTurns] = useState<Turn[]>([
    {
      role: "officer",
      text: "I'm the counter. Hours, the case, an ingredient, or a scoop count — I'll write the WhatsApp note.",
    },
  ]);
  const logRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const fieldId = useId();

  useEffect(() => {
    if (!open) return;
    inputRef.current?.focus();
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  useEffect(() => {
    const node = logRef.current;
    if (node) node.scrollTop = node.scrollHeight;
  }, [turns, open]);

  async function send(text: string) {
    const message = text.trim();
    if (!message || busy) return;
    setDraft("");
    setTurns((current) => [...current, { role: "guest", text: message }]);
    setBusy(true);
    try {
      const reply = await askOfficer(message);
      setTurns((current) => [...current, { role: "officer", ...reply }]);
    } catch {
      setTurns((current) => [
        ...current,
        { role: "officer", text: "The counter missed that. Try the hours, a flavor, or an order." },
      ]);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="fixed right-4 bottom-4 z-40 flex flex-col items-end gap-3 sm:right-6 sm:bottom-6">
      {open ? (
        <section
          className="glass flex h-[min(34rem,calc(100svh-7rem))] w-[min(24rem,calc(100vw-2rem))] flex-col overflow-hidden rounded-card"
          aria-label="Gelato counter"
        >
          <header className="flex items-start justify-between gap-3 border-b border-cocoa/10 px-4 py-3">
            <div>
              <p className="font-display text-lg leading-none text-cocoa">The counter</p>
              <p className="mt-1 text-sm text-cocoa/70">Maison Luce · no wait, just a note</p>
            </div>
            <button
              type="button"
              className="grid size-11 place-items-center rounded-full text-cocoa"
              onClick={() => setOpen(false)}
              aria-label="Close the counter"
            >
              <X className="size-5" />
            </button>
          </header>
          <div
            ref={logRef}
            data-lenis-prevent
            className="flex flex-1 flex-col gap-3 overflow-y-auto px-4 py-4"
            aria-live="polite"
          >
            {turns.map((turn, index) => (
              <div key={`${turn.role}-${index}`} className={turn.role === "guest" ? "flex justify-end" : ""}>
                <div
                  className={
                    turn.role === "guest"
                      ? "max-w-[85%] rounded-card bg-cocoa px-3 py-2 text-sm text-cream"
                      : "max-w-[90%] rounded-card bg-foam/80 px-3 py-2 text-sm text-cocoa"
                  }
                >
                  <p className="whitespace-pre-wrap leading-relaxed">{turn.text}</p>
                  {turn.href ? (
                    <a
                      href={turn.href}
                      target="_blank"
                      rel="noreferrer"
                      className="mt-3 inline-flex min-h-11 items-center rounded-full bg-berry px-4 text-sm font-medium text-foam"
                    >
                      {turn.label ?? "Open WhatsApp"}
                    </a>
                  ) : null}
                </div>
              </div>
            ))}
            {busy ? <p className="text-sm text-cocoa/60">Checking the case…</p> : null}
          </div>
          {turns.length < 3 ? (
            <div className="flex flex-wrap gap-2 px-4 pb-2">
              {STARTERS.map((prompt) => (
                <button
                  key={prompt}
                  type="button"
                  className="min-h-11 rounded-full bg-mint/70 px-3 text-sm text-cocoa"
                  onClick={() => void send(prompt)}
                >
                  {prompt}
                </button>
              ))}
            </div>
          ) : null}
          <form
            className="flex items-center gap-2 border-t border-cocoa/10 p-3"
            onSubmit={(event) => {
              event.preventDefault();
              void send(draft);
            }}
          >
            <label className="sr-only" htmlFor={fieldId}>
              Message the counter
            </label>
            <input
              id={fieldId}
              ref={inputRef}
              value={draft}
              onChange={(event) => setDraft(event.target.value)}
              placeholder="Order 2 wild strawberry"
              className="h-11 min-w-0 flex-1 rounded-full border border-cocoa/15 bg-foam px-4 text-base text-cocoa outline-none"
            />
            <button
              type="submit"
              className="grid size-11 place-items-center rounded-full bg-berry text-foam disabled:opacity-50"
              disabled={busy || !draft.trim()}
              aria-label="Send"
            >
              <Send className="size-4" />
            </button>
          </form>
        </section>
      ) : null}
      <button
        type="button"
        className="inline-flex min-h-11 items-center gap-2 rounded-full bg-cocoa px-4 text-sm font-medium text-cream shadow-soft"
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
      >
        <MessageCircle className="size-4" />
        {open ? "Hide counter" : "Ask the counter"}
      </button>
    </div>
  );
}
