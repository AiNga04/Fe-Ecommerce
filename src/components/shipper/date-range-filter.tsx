'use client'

import { format, subDays } from 'date-fns'
import { Calendar as CalendarIcon, Filter } from 'lucide-react'
import { DateRange } from 'react-day-picker'
import { vi } from 'date-fns/locale'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'

interface DateRangeFilterProps {
  date: DateRange | undefined
  setDate: (date: DateRange | undefined) => void
  className?: string
}

export function DateRangeFilter({ date, setDate, className }: DateRangeFilterProps) {
  const presets = [
    {
      label: 'Hôm nay',
      getValue: () => ({ from: new Date(), to: new Date() }),
    },
    {
      label: 'Hôm qua',
      getValue: () => ({ from: subDays(new Date(), 1), to: subDays(new Date(), 1) }),
    },
    {
      label: '7 ngày qua',
      getValue: () => ({ from: subDays(new Date(), 6), to: new Date() }),
    },
    {
      label: '30 ngày qua',
      getValue: () => ({ from: subDays(new Date(), 29), to: new Date() }),
    },
  ]

  return (
    <div className={cn('grid gap-2', className)}>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            id='date'
            variant={'outline'}
            className={cn(
              'w-full sm:w-[300px] justify-start text-left font-normal border-orange-200 hover:bg-orange-50 hover:text-orange-900 shadow-sm transition-all',
              !date && 'text-muted-foreground',
            )}
          >
            <CalendarIcon className='mr-2 h-4 w-4 text-orange-600' />
            <span className='truncate'>
              {date?.from ? (
                date.to ? (
                  <>
                    {format(date.from, 'dd/MM/yyyy', { locale: vi })} -{' '}
                    {format(date.to, 'dd/MM/yyyy', { locale: vi })}
                  </>
                ) : (
                  format(date.from, 'dd/MM/yyyy', { locale: vi })
                )
              ) : (
                <span>Chọn khoảng ngày</span>
              )}
            </span>
          </Button>
        </PopoverTrigger>
        <PopoverContent
          className='w-auto p-0 flex flex-col sm:flex-row shadow-xl border-orange-100'
          align='start'
        >
          <div className='flex flex-col border-b sm:border-b-0 sm:border-r border-orange-100 p-2 min-w-[140px] bg-orange-50/30'>
            <p className='text-[10px] font-bold text-orange-400 uppercase tracking-widest px-3 py-2'>
              Phím tắt
            </p>
            {presets.map((preset) => (
              <Button
                key={preset.label}
                variant='ghost'
                size='sm'
                className='justify-start font-medium text-xs hover:bg-orange-100 hover:text-orange-900 py-2 px-3 rounded-lg h-9'
                onClick={() => setDate(preset.getValue())}
              >
                {preset.label}
              </Button>
            ))}
          </div>
          <Calendar
            initialFocus
            mode='range'
            defaultMonth={date?.from}
            selected={date}
            onSelect={setDate}
            numberOfMonths={1}
            locale={vi}
            disabled={(date) => date > new Date() || date < subDays(new Date(), 365)}
            className='p-3'
          />
        </PopoverContent>
      </Popover>
    </div>
  )
}
