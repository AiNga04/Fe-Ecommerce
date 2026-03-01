import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { cn } from '@/lib/utils'

interface StatsCardProps {
  title: string
  value: string | number
  icon: any
  description?: string
  className?: string
  iconClassName?: string
}

export function StatsCard({
  title,
  value,
  icon: Icon,
  description,
  className,
  iconClassName,
}: StatsCardProps) {
  return (
    <Card className={cn('overflow-hidden border-none shadow-sm bg-white', className)}>
      <CardHeader className='flex flex-row items-center justify-between pb-2 space-y-0'>
        <CardTitle className='text-xs font-semibold uppercase tracking-wider text-muted-foreground'>
          {title}
        </CardTitle>
        <div className={cn('p-2 rounded-lg bg-gray-50', iconClassName)}>
          <Icon className='w-4 h-4' />
        </div>
      </CardHeader>
      <CardContent>
        <div className='text-2xl font-bold'>{value}</div>
        {description && <p className='text-xs text-muted-foreground mt-1'>{description}</p>}
      </CardContent>
    </Card>
  )
}
