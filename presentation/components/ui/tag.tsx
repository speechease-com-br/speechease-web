import type React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/shared/utils/utils"

const tagVariants = cva(
  "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/80",
        info: "bg-blue-100 text-blue-800 hover:bg-blue-200",
        warning: "bg-amber-100 text-amber-800 hover:bg-amber-200",
        error: "bg-red-100 text-red-800 hover:bg-red-200",
        success: "bg-green-100 text-green-800 hover:bg-green-200",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
)

export interface TagProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof tagVariants> {}

function Tag({ className, variant, ...props }: TagProps) {
  return <div className={cn(tagVariants({ variant }), className)} {...props} />
}

export { Tag, tagVariants }
