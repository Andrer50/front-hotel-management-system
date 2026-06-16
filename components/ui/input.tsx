import * as React from "react"

import { cn } from "@/lib/utils"

export interface InputProps extends React.ComponentProps<"input"> {
  startContent?: React.ReactNode;
  endContent?: React.ReactNode;
}

function Input({ className, type, startContent, endContent, ...props }: InputProps) {
  return (
    <div 
      className={cn(
        "flex h-9 w-full items-center rounded-3xl border border-transparent bg-input/50 px-4 transition-all focus-within:border-ring focus-within:ring-3 focus-within:ring-ring/30",
        className
      )}
    >
      {startContent && (
        <div className="mr-3 text-muted-foreground transition-colors group-focus-within:text-brand-blue">
          {startContent}
        </div>
      )}
      <input
        type={type}
        className="flex-1 bg-transparent py-1 text-base outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
        {...props}
      />
      {endContent && (
        <div className="ml-3 text-muted-foreground transition-colors group-focus-within:text-brand-blue">
          {endContent}
        </div>
      )}
    </div>
  )
}

export { Input }
