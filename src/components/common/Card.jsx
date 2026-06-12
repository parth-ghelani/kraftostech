import React from 'react';
import clsx from 'clsx';

export default function Card({
  children,
  className,
  glass = false,
  hover = true,
  ...props
}) {
  return (
    <div
      className={clsx(
        'rounded-xl border border-primary/10 overflow-hidden transition-all duration-300',
        {
          'bg-charcoal shadow-[0_12px_24px_rgba(0,0,0,0.28)]': !glass,
          'backdrop-blur-glass border-white/20': glass,
          'hover:-translate-y-2 hover:shadow-[0_20px_40px_rgba(0,0,0,0.4)] hover:border-accent/50':
            hover,
        },
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
