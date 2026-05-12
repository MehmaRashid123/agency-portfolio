"use client";

import { useState } from "react";

interface FAQ { question: string; answer: string }

export default function FAQAccordion({ faqs }: { faqs: FAQ[] }) {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <div className="flex flex-col divide-y divide-[var(--border)]" role="list" aria-label="Frequently asked questions">
      {faqs.map((faq, i) => (
        <div key={i} role="listitem">
          <button className="w-full flex items-center justify-between gap-6 py-6 text-left hover:opacity-70 transition-opacity duration-300"
            onClick={() => setOpen(open === i ? null : i)} aria-expanded={open === i} aria-controls={`faq-answer-${i}`}>
            <span className="text-base md:text-lg font-medium">{faq.question}</span>
            <span className="text-2xl text-[var(--accent)] transition-transform duration-300 flex-shrink-0" style={{ transform: open === i ? "rotate(45deg)" : "rotate(0deg)" }} aria-hidden="true">+</span>
          </button>
          <div id={`faq-answer-${i}`} className={`accordion-content ${open === i ? "open" : ""}`} role="region">
            <p className="pb-6 opacity-60 leading-relaxed text-sm md:text-base max-w-2xl">{faq.answer}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
