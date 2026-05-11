"use client"

import { useTheme } from "next-themes"
import { Toaster as Sonner, type ToasterProps } from "sonner"
import { CircleCheckIcon, InfoIcon, TriangleAlertIcon, OctagonXIcon, Loader2Icon } from "lucide-react"

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme()

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      icons={{
        success: (
          <CircleCheckIcon className="size-4" />
        ),
        info: (
          <InfoIcon className="size-4" />
        ),
        warning: (
          <TriangleAlertIcon className="size-4" />
        ),
        error: (
          <OctagonXIcon className="size-4" />
        ),
        loading: (
          <Loader2Icon className="size-4 animate-spin" />
        ),
      }}
      style={
        {
          "--normal-bg": "#ffffff",
          "--normal-text": "#121b2d",
          "--normal-border": "#f1f5f9",
          "--border-radius": "1rem",
          "--description-color": "#475569",
        } as React.CSSProperties
      }
      toastOptions={{
        classNames: {
          toast:
            "group toast group-[.toaster]:bg-white group-[.toaster]:text-dark-primary group-[.toaster]:border-zinc-100 group-[.toaster]:shadow-xl group-[.toaster]:rounded-2xl group-[.toaster]:p-4 group-[.toaster]:font-sans",
          description: "group-[.toast]:!text-[#475569] group-[.toast]:font-semibold group-[.toast]:text-[11px] group-[.toast]:leading-relaxed mt-1",
          title: "group-[.toast]:!text-dark-primary group-[.toast]:font-extrabold group-[.toast]:text-xs",
          actionButton:
            "group-[.toast]:bg-brand-blue group-[.toast]:text-white group-[.toast]:hover:bg-blue-600 group-[.toast]:font-bold group-[.toast]:text-[11px] group-[.toast]:px-4 group-[.toast]:py-2 group-[.toast]:rounded-xl group-[.toast]:cursor-pointer group-[.toast]:transition-all duration-200",
          cancelButton:
            "group-[.toast]:bg-zinc-100 group-[.toast]:text-dark-secondary group-[.toast]:hover:bg-zinc-200 group-[.toast]:font-bold group-[.toast]:text-[11px] group-[.toast]:px-4 group-[.toast]:py-2 group-[.toast]:rounded-xl group-[.toast]:cursor-pointer group-[.toast]:transition-all duration-200",
        },
      }}
      {...props}
    />
  )
}

export { Toaster }
