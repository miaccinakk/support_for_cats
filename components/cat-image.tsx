import Image from "next/image"

/**
 * Central place to configure the mascot images. Swap the `src` paths here (or
 * replace the files in /public/images) to rebrand the whole site's cat.
 */
export const CAT_IMAGES = {
  hero: "/images/cat-hero.png",
  coach: "/images/cat-coach.png",
} as const

type CatImageProps = {
  variant: keyof typeof CAT_IMAGES
  alt: string
  className?: string
  priority?: boolean
  width?: number
  height?: number
}

export function CatImage({ variant, alt, className, priority, width = 640, height = 640 }: CatImageProps) {
  return (
    <Image
      src={CAT_IMAGES[variant] || "/placeholder.svg"}
      alt={alt}
      width={width}
      height={height}
      priority={priority}
      className={className}
    />
  )
}
