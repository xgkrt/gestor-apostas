import { type ButtonHTMLAttributes, forwardRef } from "react"
import { cva, type VariantProps } from "class-variance-authority"

const buttonVariants = cva(
  "cursor-pointer inline-flex items-center justify-center rounded-lg border text-sm font-medium whitespace-nowrap transition-all duration-200 outline-none hover:scale-[1.02] focus-visible:ring-3 focus-visible:ring-ring/50 active:translate-y-px active:scale-[0.98] disabled:cursor-not-allowed disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground border-transparent hover:bg-primary/90",
        outline: "border-border bg-background hover:bg-muted hover:text-foreground",
        secondary: "bg-secondary text-secondary-foreground border-transparent hover:bg-secondary/80",
        ghost: "border-transparent hover:bg-muted hover:text-foreground",
        destructive: "bg-destructive/10 text-destructive border-transparent hover:bg-destructive/20",
        link: "border-transparent text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-8 px-3 text-xs",
        lg: "h-12 px-6",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

// React 19: ref is now a prop, no need for forwardRef in new code
// However, keeping forwardRef for broader compatibility
const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => {
    const classes = buttonVariants({ variant, size, className })
    return <button ref={ref} className={classes} {...props} />
  }
)

Button.displayName = "Button"

export { Button, buttonVariants }
