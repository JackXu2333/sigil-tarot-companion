import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const inputVariants = cva(
  "file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input flex w-full min-w-0 rounded-md border bg-transparent text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:border-0 file:bg-transparent file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
  {
    variants: {
      size: {
        sm: "h-8 px-2 py-1 text-sm file:h-6 file:text-xs md:text-xs",
        default: "h-9 px-3 py-1 file:h-7 file:text-sm md:text-sm",
        lg: "h-10 px-4 py-2 text-lg file:h-8 file:text-base md:text-base",
      },
      variant: {
        default: "bg-transparent",
        filled: "bg-muted/50",
      },
      state: {
        default: "",
        error: "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
        success: "border-green-500 ring-green-500/20",
      },
    },
    defaultVariants: {
      size: "default",
      variant: "default", 
      state: "default",
    },
  }
)

type InputProps = React.ComponentProps<"input"> & VariantProps<typeof inputVariants>

const Input = React.forwardRef<HTMLInputElement, InputProps>(({ className, type, size, variant, state, ...props }, ref) => {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(inputVariants({ size, variant, state }), className)}
      ref={ref}
      {...props}
    />
  )
})
Input.displayName = "Input"

export { Input, inputVariants }
