import type React from 'react';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

interface CardContentProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export function Card({ children, className = '', ...props }: CardProps) {
  return (
    <div
      className={`bg-white rounded-lg border border-gray-200 shadow-sm ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardContent({
  children,
  className = '',
  ...props
}: CardContentProps) {
  return (
    <div className={`p-6 ${className}`} {...props}>
      {children}
    </div>
  );
}
