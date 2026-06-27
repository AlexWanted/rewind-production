'use client';

export function Typography({ children, className = '', ...props }: any) {
  return (
    <div className={`font-display ${className}`} {...props}>
      {children}
    </div>
  );
}