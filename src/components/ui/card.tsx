import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const cardVariants = cva(
  "bg-card text-card-foreground flex flex-col rounded-xl border shadow-sm",
  {
    variants: {
      variant: {
        default: "bg-card",
        elevated: "bg-card shadow-lg",
        outlined: "bg-transparent border-2",
      },
      size: {
        sm: "gap-3 py-3",
        default: "gap-6 py-6",
        lg: "gap-8 py-8",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

type CardProps = React.ComponentProps<"div"> & VariantProps<typeof cardVariants>

const Card = React.forwardRef<HTMLDivElement, CardProps>(({ className, variant, size, ...props }, ref) => {
  return (
    <div
      data-slot="card"
      className={cn(cardVariants({ variant, size }), className)}
      ref={ref}
      {...props}
    />
  )
})
Card.displayName = "Card"

const CardHeader = React.forwardRef<HTMLDivElement, React.ComponentProps<"div">>(({ className, ...props }, ref) => {
  return (
    <div
      data-slot="card-header"
      className={cn(
        "@container/card-header grid auto-rows-min grid-rows-[auto_auto] items-start gap-1.5 px-3 sm:px-6 has-data-[slot=card-action]:grid-cols-[1fr_auto] [.border-b]:pb-6",
        className
      )}
      ref={ref}
      {...props}
    />
  )
})
CardHeader.displayName = "CardHeader"

const CardTitle = React.forwardRef<HTMLDivElement, React.ComponentProps<"div">>(({ className, ...props }, ref) => {
  return (
    <div
      data-slot="card-title"
      className={cn("leading-none font-semibold", className)}
      ref={ref}
      {...props}
    />
  )
})
CardTitle.displayName = "CardTitle"

const CardDescription = React.forwardRef<HTMLDivElement, React.ComponentProps<"div">>(({ className, ...props }, ref) => {
  return (
    <div
      data-slot="card-description"
      className={cn("text-muted-foreground text-sm", className)}
      ref={ref}
      {...props}
    />
  )
})
CardDescription.displayName = "CardDescription"

const CardAction = React.forwardRef<HTMLDivElement, React.ComponentProps<"div">>(({ className, ...props }, ref) => {
  return (
    <div
      data-slot="card-action"
      className={cn(
        "col-start-2 row-span-2 row-start-1 self-start justify-self-end",
        className
      )}
      ref={ref}
      {...props}
    />
  )
})
CardAction.displayName = "CardAction"

const CardContent = React.forwardRef<HTMLDivElement, React.ComponentProps<"div">>(({ className, ...props }, ref) => {
  return (
    <div
      data-slot="card-content"
      className={cn("px-3 sm:px-6", className)}
      ref={ref}
      {...props}
    />
  )
})
CardContent.displayName = "CardContent"

const CardFooter = React.forwardRef<HTMLDivElement, React.ComponentProps<"div">>(({ className, ...props }, ref) => {
  return (
    <div
      data-slot="card-footer"
      className={cn("flex items-center px-3 sm:px-6 [.border-t]:pt-6", className)}
      ref={ref}
      {...props}
    />
  )
})
CardFooter.displayName = "CardFooter"

export {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardAction,
  CardDescription,
  CardContent,
  cardVariants,
}
