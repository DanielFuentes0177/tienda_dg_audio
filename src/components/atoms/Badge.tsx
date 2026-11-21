import React from "react";
import styles from "./Badge.module.css";

export interface BadgeProps {
  children: React.ReactNode;
  tone?: "gold" | "dark" | "light";
  className?: string;
}

/** Átomo dumb: etiqueta/chip (kicker, categoría, estado). */
export const Badge = ({ children, tone = "gold", className = "" }: BadgeProps) => (
  <span className={`${styles.badge} ${styles[tone]} ${className}`.trim()}>{children}</span>
);
