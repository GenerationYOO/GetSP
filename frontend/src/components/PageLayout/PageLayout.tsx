import type { PropsWithChildren } from 'react';
import './PageLayout.css';

type PageLayoutProps = PropsWithChildren<{
  className?: string;
}>;

export function PageLayout({ className, children = '' }: PageLayoutProps) {
  return (
    <main className={`pageLayout ${className ?? ''}`}>
      {children}
    </main>
  )
}