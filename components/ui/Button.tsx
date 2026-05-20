import React from 'react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

type Variant = 'primary' | 'secondary' | 'ghost';
type Size = 'sm' | 'md' | 'lg';

const base =
  'inline-flex items-center justify-center gap-2 font-medium rounded-full transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ember focus-visible:ring-offset-2 focus-visible:ring-offset-ink disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap';

const variants: Record<Variant, string> = {
  primary:
    'bg-ember text-cream hover:bg-ember-500 shadow-[0_8px_30px_-12px_rgba(195,86,34,0.6)] hover:shadow-[0_12px_40px_-10px_rgba(195,86,34,0.8)]',
  secondary:
    'bg-cream/10 text-cream backdrop-blur-sm hover:bg-cream/15 border border-cream/10 hover:border-cream/20',
  ghost: 'text-cream/80 hover:text-cream hover:bg-cream/5',
};

const sizes: Record<Size, string> = {
  sm: 'px-4 py-2 text-sm',
  md: 'px-5 py-2.5 text-sm',
  lg: 'px-7 py-3.5 text-base',
};

interface CommonProps {
  variant?: Variant;
  size?: Size;
  className?: string;
  children: React.ReactNode;
}

type ButtonAsButton = CommonProps &
  React.ButtonHTMLAttributes<HTMLButtonElement> & { href?: undefined };

type ButtonAsLink = CommonProps &
  Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, 'href'> & {
    href: string;
    external?: boolean;
  };

export function Button(props: ButtonAsButton | ButtonAsLink) {
  const { variant = 'primary', size = 'md', className, children } = props;
  const classes = cn(base, variants[variant], sizes[size], className);

  if ('href' in props && props.href !== undefined) {
    const { href, external, ...rest } = props;
    const isExternal = external || /^https?:\/\//.test(href) || href.startsWith('mailto:');
    if (isExternal) {
      return (
        <a
          {...(rest as React.AnchorHTMLAttributes<HTMLAnchorElement>)}
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className={classes}
        >
          {children}
        </a>
      );
    }
    return (
      <Link
        {...(rest as React.AnchorHTMLAttributes<HTMLAnchorElement>)}
        href={href}
        className={classes}
      >
        {children}
      </Link>
    );
  }

  const { variant: _v, size: _s, className: _c, children: _ch, ...rest } =
    props as ButtonAsButton;
  return (
    <button className={classes} {...rest}>
      {children}
    </button>
  );
}
