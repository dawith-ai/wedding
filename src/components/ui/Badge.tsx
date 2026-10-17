import type { HTMLAttributes } from 'react';
import { cn } from '../../lib/cn';

interface Props extends HTMLAttributes<HTMLSpanElement> {
  tone?: 'neutral' | 'success' | 'coral';
}

export function Badge({ className, tone = 'neutral', ...props }: Props) {
  return <span className={cn('ui-badge', `ui-badge-${tone}`, className)} {...props} />;
}
