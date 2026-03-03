'use client'

import { motion, useInView } from 'framer-motion'
import { useRef, useEffect, useState } from 'react'

const stats = [
  { label: 'Khách hàng hài lòng', value: 10000, suffix: '+' },
  { label: 'Sản phẩm thiết kế', value: 500, suffix: '+' },
  { label: 'Tỉ lệ hài lòng', value: 98, suffix: '%' },
  { label: 'Năm phát triển', value: 3, suffix: '' },
]

function Counter({ value, suffix }: { value: number; suffix: string }) {
  const [count, setCount] = useState(0)
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.5 })

  useEffect(() => {
    if (isInView) {
      let start = 0
      const end = value
      const duration = 2000
      const increment = end / (duration / 16)

      const timer = setInterval(() => {
        start += increment
        if (start >= end) {
          setCount(end)
          clearInterval(timer)
        } else {
          setCount(Math.floor(start))
        }
      }, 16)

      return () => clearInterval(timer)
    }
  }, [isInView, value])

  return (
    <span ref={ref}>
      {count.toLocaleString()}
      {suffix}
    </span>
  )
}

export function AboutStats() {
  return (
    <section className='py-20 bg-slate-900 text-white overflow-hidden'>
      <div className='container mx-auto max-w-10xl px-4 md:px-6'>
        <div className='grid grid-cols-2 lg:grid-cols-4 gap-12 text-center'>
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className='space-y-2'
            >
              <h3 className='text-4xl md:text-5xl lg:text-6xl font-black tracking-tighter text-orange-400'>
                <Counter value={stat.value} suffix={stat.suffix} />
              </h3>
              <p className='text-sm md:text-base text-slate-400 font-medium uppercase tracking-widest'>
                {stat.label}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
