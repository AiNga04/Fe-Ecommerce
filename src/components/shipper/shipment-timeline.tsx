import { format } from 'date-fns'
import { vi } from 'date-fns/locale'
import { Check, Clock, Circle } from 'lucide-react'
import { cn } from '@/lib/utils'

interface TimelineStep {
  label: string
  date: string | null
  isCompleted: boolean
  isCurrent?: boolean
}

interface ShipmentTimelineProps {
  steps: TimelineStep[]
}

export function ShipmentTimeline({ steps }: ShipmentTimelineProps) {
  return (
    <div className='relative space-y-8 before:absolute before:inset-0 before:ml-5 before:-translate-x-px before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-300 before:to-transparent'>
      {steps.map((step, index) => (
        <div key={index} className='relative flex items-start group'>
          <div className='flex items-center justify-center w-10 h-10'>
            <div
              className={cn(
                'flex items-center justify-center w-8 h-8 rounded-full border-2 transition-colors duration-300 z-10 bg-white',
                step.isCompleted
                  ? 'border-green-500 bg-green-50 text-green-500'
                  : step.isCurrent
                    ? 'border-orange-500 text-orange-500'
                    : 'border-slate-300 text-slate-300',
              )}
            >
              {step.isCompleted ? (
                <Check className='w-4 h-4' />
              ) : step.isCurrent ? (
                <Clock className='w-4 h-4 animate-pulse' />
              ) : (
                <Circle className='w-2 h-2 fill-current' />
              )}
            </div>
          </div>
          <div className='flex flex-col ml-4 pb-2'>
            <div
              className={cn(
                'text-sm font-bold uppercase tracking-wide transition-colors duration-300',
                step.isCompleted
                  ? 'text-slate-900'
                  : step.isCurrent
                    ? 'text-orange-600'
                    : 'text-slate-400',
              )}
            >
              {step.label}
            </div>
            {step.date && (
              <time className='text-xs text-slate-500 mt-1'>
                {format(new Date(step.date), 'HH:mm - dd/MM/yyyy', { locale: vi })}
              </time>
            )}
            {!step.isCompleted && !step.isCurrent && (
              <span className='text-xs text-slate-300 italic mt-1'>Chưa đạt tới</span>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}
