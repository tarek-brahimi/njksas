interface LoaderRingProps {
  size?: number
  className?: string
}

export default function LoaderRing({ size = 24, className = '' }: LoaderRingProps) {
  return (
    <div
      className={`inline-block rounded-full border-2 border-white/20 border-t-white animate-spin ${className}`}
      style={{ width: size, height: size }}
    />
  )
}
