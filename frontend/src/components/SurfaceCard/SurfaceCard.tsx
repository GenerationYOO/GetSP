import type { PropsWithChildren } from "react";
import "./SurfaceCard.css"

type SurfaceCardProps = PropsWithChildren<{
  className?: string;
}>

export function SurfaceCard({ className, children = '' }: SurfaceCardProps) {
  return (
    <div className={`surfaceCard ${className ?? ''}`}>
      {children}
    </div>
  )
}