'use client';

import type { ReactNode } from 'react';
import Link from 'next/link';

type ButtonProps = {
  type?: 'button' | 'submit' | 'reset';
  children: ReactNode;
  href?: string;
  variant?: 'primary' | 'secondary' | 'accent' | 'ghost' | 'outlined';
  className?: string;
  onClick?: () => void;
  disabled?: boolean;
  icon?: ReactNode;
};

export default function Button({
  type,
  children,
  href,
  variant = 'primary',
  className = '',
  onClick,
  icon,
}: ButtonProps) {
  const baseStyles =
    'px-3 py-1 rounded-md font-medium text-sm transition-colors flex items-center';

  const variantStyles = {
    primary: 'bg-white text-[#050a47] hover:bg-gray-100',
    secondary: 'bg-[#050a47] text-white hover:bg-[#0a1070]',
    accent:
      'bg-[#86E64C] text-[#050a47] font-figtree font-bold hover:bg-green-600',
    ghost: 'text-white hover:bg-white/10',
    outlined: `border border-[#050a47] text-[#050a47] hover:bg-[#050a47]/10`,
  };

  const buttonClasses = `${baseStyles} ${variantStyles[variant]} ${className}`;

  const content = (
    <>
      {icon && <span className="[&>svg]:h-4 [&>svg]:w-4">{icon}</span>}
      {children}
    </>
  );

  if (href) {
    return (
      <Link type={type} href={href} className={buttonClasses}>
        {content}
      </Link>
    );
  }

  return (
    <button className={buttonClasses} onClick={onClick}>
      {content}
    </button>
  );
}
