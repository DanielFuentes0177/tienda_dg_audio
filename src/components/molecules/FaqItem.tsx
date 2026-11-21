"use client";

import React, { useRef } from "react";

export interface FaqItemProps {
  question: string;
  answer: string;
  open: boolean;
  onToggle: () => void;
}

/** Molécula presentacional del acordeón (la lógica de "uno abierto" vive en FaqSection). */
export const FaqItem = ({ question, answer, open, onToggle }: FaqItemProps) => {
  const answerRef = useRef<HTMLDivElement>(null);
  return (
    <div className={`faq-lux-item${open ? " active" : ""}`}>
      <button type="button" className="faq-lux-btn" aria-expanded={open} onClick={onToggle}>
        <span>{question}</span>
        <span>+</span>
      </button>
      <div
        ref={answerRef}
        className="faq-lux-answer"
        style={{ maxHeight: open ? `${answerRef.current?.scrollHeight ?? 600}px` : "0px" }}
      >
        <p>{answer}</p>
      </div>
    </div>
  );
};
