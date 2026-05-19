import * as React from "react"

import { cn } from "@/lib/utils"

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "w-full min-w-0 h-12 rounded-lg border border-transparent bg-grayWhite-100/60 px-3 text-base text-[color:var(--c-ink)] placeholder:text-grayWhite-500 transition-[background-color,border-color] duration-220 ease-kimi outline-none disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-40 md:text-sm",
        "focus-visible:bg-grayWhite-white focus-visible:border-grayWhite-200 focus-visible:ring-2 focus-visible:ring-grayWhite-200/60",
        "aria-invalid:border-destructive aria-invalid:ring-2 aria-invalid:ring-destructive/20",
        className
      )}
      {...props}
    />
  )
}

export { Input }
