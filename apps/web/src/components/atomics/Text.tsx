import type { ReactNode } from 'react';

type TextProps = {
  children: ReactNode;
  size?: 'xs' | 'sm' | 'base' | 'lg' | 'xl' | 'xxl';
  color?: 'default' | 'primary' | 'secondary' | 'muted' | 'white';
  fontFamily?: 'sans' | 'light';
  weight?:
    | 'light'
    | 'normal'
    | 'medium'
    | 'semibold'
    | 'bold'
    | 'extrabold'
    | 'black';
  className?: string;
};

export default function Text({
  children,
  size = 'base',
  color = 'default',
  weight = 'normal',
  className = '',
  fontFamily = 'light',
}: TextProps) {
  const sizeStyles = {
    xs: 'text-xs',
    sm: 'text-sm',
    base: 'text-base',
    lg: 'text-lg',
    xl: 'text-xl',
    xxl: 'text-2xl',
  };
  const fontFamilyStyles = {
    sans: 'font-sans',
    light: 'font-figtree',
  };

  const weightStyles = {
    light: 'font-light',
    normal: 'font-normal',
    medium: 'font-medium',
    semibold: 'font-semibold',
    bold: 'font-bold',
    extrabold: 'font-extrabold',
    black: 'font-black',
  };

  const colorStyles = {
    default: 'text-[#212529]',
    primary: 'text-[#86E64C]',
    secondary: 'text-[#050557]',
    muted: 'text-gray-600',
    white: 'text-white',
  };

  const textClasses = `${fontFamilyStyles[fontFamily]} ${weightStyles[weight]} ${sizeStyles[size]} ${colorStyles[color]} ${className}`;

  return <p className={textClasses}>{children}</p>;
}
