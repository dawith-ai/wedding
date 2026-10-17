import { Children, cloneElement, forwardRef, isValidElement, type ButtonHTMLAttributes, type ReactElement, type ReactNode } from 'react';
import { cn } from '../../lib/cn';

type ButtonVariant = 'default' | 'soft' | 'outline' | 'ghost';
type ButtonSize = 'sm' | 'md' | 'lg';

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  asChild?: boolean;
  children: ReactNode;
}

export const Button = forwardRef<HTMLButtonElement, Props>(function Button(
  { className, variant = 'default', size = 'md', asChild = false, children, ...props },
  ref,
) {
  const classes = cn('ui-button', `ui-button-${variant}`, `ui-button-${size}`, className);
  if (asChild) {
    const child = Children.only(children);
    if (isValidElement(child)) {
      const element = child as ReactElement<{ className?: string }>;
      return cloneElement(element, {
        className: cn(classes, element.props.className),
      });
    }
  }
  return <button ref={ref} className={classes} {...props}>{children}</button>;
});
