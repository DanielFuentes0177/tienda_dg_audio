"use client";

import React, { useRef } from "react";

export interface AccordionItemProps {
  question: string;
  answer: string;
  open: boolean;
  onToggle: () => void;
}

/** Molécula presentacional del acordeón de la home (clases .accordion-*). */
export const AccordionItem = ({ question, answer, open, onToggle }: AccordionItemProps) => {
  const contentRef = useRef<HTMLDivElement>(null);
  return (
    <div className="accordion-item">
      <button type="button" className={`accordion-header${open ? " active" : ""}`} aria-expanded={open} onClick={onToggle}>
        {question}
        <i className="fa-solid fa-plus icon" />
      </button>
      <div ref={contentRef} className="accordion-content" style={open ? { maxHeight: `${contentRef.current?.scrollHeight ?? 600}px` } : undefined}>
        <p>{answer}</p>
      </div>
    </div>
  );
};
