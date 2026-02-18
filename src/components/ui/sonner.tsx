'use client'

import {
  CircleCheckIcon,
  InfoIcon,
  Loader2Icon,
  OctagonXIcon,
  TriangleAlertIcon,
} from 'lucide-react'
import { useTheme } from 'next-themes'
import { Toaster as Sonner, type ToasterProps } from 'sonner'

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = 'system' } = useTheme()

  return (
    <Sonner
      theme={theme as ToasterProps['theme']}
      className='toaster group'
      icons={{
        success: <CircleCheckIcon className='size-5 text-white' />,
        info: <InfoIcon className='size-5 text-blue-500' />,
        warning: <TriangleAlertIcon className='size-5 text-black' />,
        error: <OctagonXIcon className='size-5 text-white' />,
        loading: <Loader2Icon className='size-5 animate-spin text-slate-500' />,
      }}
      toastOptions={{
        classNames: {
          toast:
            'group toast group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg font-sans',
          description:
            'group-[.toast]:text-muted-foreground group-data-[type=success]:text-zinc-100 group-data-[type=error]:text-zinc-100 group-data-[type=info]:text-zinc-100 group-data-[type=warning]:text-zinc-800',
          actionButton: 'group-[.toast]:bg-primary group-[.toast]:text-primary-foreground',
          cancelButton: 'group-[.toast]:bg-muted group-[.toast]:text-muted-foreground',
          success:
            'group-[.toaster]:!bg-gradient-to-r group-[.toaster]:!from-emerald-500 group-[.toaster]:!to-green-600 group-[.toaster]:!text-white group-[.toaster]:!border-emerald-600 shadow-emerald-500/20',
          error:
            'group-[.toaster]:!bg-gradient-to-r group-[.toaster]:!from-red-500 group-[.toaster]:!to-rose-600 group-[.toaster]:!text-white group-[.toaster]:!border-red-600 shadow-red-500/20',
          warning:
            'group-[.toaster]:!bg-amber-400 group-[.toaster]:!text-black group-[.toaster]:!border-amber-500 shadow-amber-500/20',
          info: 'group-[.toaster]:!bg-blue-500 group-[.toaster]:!text-white group-[.toaster]:!border-blue-600 shadow-blue-500/20',
        },
      }}
      style={
        {
          '--normal-bg': 'var(--popover)',
          '--normal-text': 'var(--popover-foreground)',
          '--normal-border': 'var(--border)',
          '--border-radius': 'var(--radius)',
        } as React.CSSProperties
      }
      {...props}
    />
  )
}

export { Toaster }
