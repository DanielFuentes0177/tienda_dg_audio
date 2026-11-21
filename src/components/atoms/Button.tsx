import React from "react";
import { AppLink } from "@/components/atoms/AppLink";

type CommonProps = {
  variant?: "primary" | "secondary" | "outline";
  children: React.ReactNode;
  className?: string;
};

type ButtonAsButton = CommonProps &
  Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, keyof CommonProps> & { href?: undefined };

type ButtonAsLink = CommonProps &
  Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, keyof CommonProps | "href"> & { href: string };

export type ButtonProps = ButtonAsButton | ButtonAsLink;

/**
 * Átomo dumb: botón o enlace con el estilo de marca (clases globales .btn).
 * Con `href` renderiza un enlace (interno con next/link, externo con <a>).
 */
export const Button = (props: ButtonProps) => {
  const { variant = "primary", children, className = "" } = props;
  const variantClass = variant === "primary" ? "btn-primary" : "";
  const classes = `btn ${variantClass} ${className}`.trim();

  if (props.href !== undefined) {
    const { href, variant: _v, className: _c, children: _ch, ...anchorProps } = props;
    void _v; void _c; void _ch;
    return (
      <AppLink href={href} className={classes} {...anchorProps}>
        {children}
      </AppLink>
    );
  }

  const { variant: _v, className: _c, children: _ch, href: _h, ...buttonProps } = props;
  void _v; void _c; void _ch; void _h;
  return (
    <button className={classes} {...buttonProps}>
      {children}
    </button>
  );
};
