'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { MapPin, Phone, Mail, Clock, Send, Loader2, CheckCircle2 } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { supportService } from '@/services/support'
import { SupportSubject } from '@/types/support'

const contactFormSchema = z.object({
  customerName: z.string().min(2, 'Vui lòng nhập tên của bạn'),
  customerEmail: z.string().email('Email không hợp lệ'),
  customerPhone: z.string().min(10, 'SĐT không hợp lệ'),
  subject: z.enum(['TUVAN', 'KIEU_NAI', 'DOITRA', 'KHAC'] as const),
  message: z.string().min(10, 'Nội dung quá ngắn'),
})

type ContactFormData = z.infer<typeof contactFormSchema>

export default function ContactPage() {
  const [isSubmitting, setIsSubmitting] = useState(false)

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      subject: 'TUVAN',
    },
  })

  const onSubmit = async (data: ContactFormData) => {
    setIsSubmitting(true)
    try {
      await supportService.submitTicket(data)
      toast.success('Gửi tin nhắn thành công!', {
        description: 'Chúng tôi sẽ phản hồi bạn qua email sớm nhất có thể.',
        icon: <CheckCircle2 className='h-5 w-5 text-emerald-500' />,
      })
      reset()
    } catch (error: any) {
      toast.error('Gửi tin nhắn thất bại', {
        description: error.response?.data?.message || 'Đã có lỗi xảy ra, vui lòng thử lại.',
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const contactInfo = [
    {
      icon: MapPin,
      title: 'Địa chỉ',
      content: 'Vincom Center, Quận 1, TP. Hồ Chí Minh',
      sub: 'Trụ sở chính Zyna Fashion',
    },
    {
      icon: Phone,
      title: 'Hotline',
      content: '1900 1234',
      sub: 'Thứ 2 - Thứ 7 (09:00 - 21:00)',
    },
    {
      icon: Mail,
      title: 'Email',
      content: 'support@zynafashion.com',
      sub: 'Phản hồi trong 24h làm việc',
    },
  ]

  const faqs = [
    {
      q: 'Sản phẩm có được đổi trả không?',
      a: 'Zyna Fashion hỗ trợ đổi trả trong vòng 7 ngày kể từ khi nhận hàng với các sản phẩm còn nguyên tem mác.',
    },
    {
      q: 'Thời gian giao hàng là bao lâu?',
      a: 'Nội thành TP.HCM: 24h. Các tỉnh thành khác: 2-3 ngày làm việc.',
    },
    {
      q: 'Tôi có thể mua trực tiếp tại cửa hàng không?',
      a: 'Chúng tôi khuyến khích khách hàng đến hệ thống cửa hàng tại Vincom để trải nghiệm sản phẩm tốt nhất.',
    },
  ]

  return (
    <div className='bg-white min-h-screen'>
      {/* 1. Hero Banner */}
      <section className='bg-slate-900 py-32 text-white relative overflow-hidden'>
        <div className='absolute inset-0 bg-[url("https://images.unsplash.com/photo-1557683316-973673baf926?q=80&w=2029")] opacity-20 bg-cover bg-center' />
        <div className='container max-w-7xl mx-auto px-4 relative z-10 text-center'>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className='text-4xl md:text-6xl font-bold mb-6 tracking-tight'
          >
            Liên Hệ Cùng Zyna
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className='text-slate-400 text-lg md:text-xl font-light max-w-2xl mx-auto'
          >
            Chúng tôi luôn sẵn sàng lắng nghe và đồng hành cùng phong cách của bạn.
          </motion.p>
        </div>
      </section>

      {/* 2. Contact Info Cards */}
      <section className='container max-w-7xl mx-auto px-4 -mt-20 relative z-20 pb-20'>
        <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
          {contactInfo.map((info, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className='bg-white p-8 rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 flex flex-col items-center text-center group hover:border-slate-300 transition-all'
            >
              <div className='w-14 h-14 bg-slate-900 text-white rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform'>
                <info.icon className='w-6 h-6' />
              </div>
              <h3 className='text-sm font-bold uppercase tracking-widest text-slate-400 mb-2'>
                {info.title}
              </h3>
              <p className='text-xl font-bold text-slate-900 mb-2'>{info.content}</p>
              <p className='text-slate-500 text-sm'>{info.sub}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* 3. Contact Form & Google Map */}
      <section className='py-20 bg-white'>
        <div className='container max-w-7xl mx-auto px-4'>
          <div className='grid grid-cols-1 lg:grid-cols-12 gap-16 items-start'>
            {/* Form Column */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              className='lg:col-span-5'
            >
              <h2 className='text-3xl font-bold text-slate-900 mb-8'>Gửi tin nhắn</h2>
              <form onSubmit={handleSubmit(onSubmit)} className='space-y-6'>
                <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                  <div className='space-y-2'>
                    <Input
                      placeholder='Họ và Tên'
                      {...register('customerName')}
                      className='bg-slate-50 border-transparent focus:bg-white focus:border-slate-200 h-14 rounded-xl'
                    />
                    {errors.customerName && (
                      <p className='text-red-500 text-xs mt-1'>{errors.customerName.message}</p>
                    )}
                  </div>
                  <div className='space-y-2'>
                    <Input
                      placeholder='Điện thoại'
                      {...register('customerPhone')}
                      className='bg-slate-50 border-transparent focus:bg-white focus:border-slate-200 h-14 rounded-xl'
                    />
                    {errors.customerPhone && (
                      <p className='text-red-500 text-xs mt-1'>{errors.customerPhone.message}</p>
                    )}
                  </div>
                </div>

                <div className='space-y-2'>
                  <Input
                    placeholder='Email'
                    {...register('customerEmail')}
                    className='bg-slate-50 border-transparent focus:bg-white focus:border-slate-200 h-14 rounded-xl'
                  />
                  {errors.customerEmail && (
                    <p className='text-red-500 text-xs mt-1'>{errors.customerEmail.message}</p>
                  )}
                </div>

                <div className='space-y-2'>
                  <Select
                    defaultValue='TUVAN'
                    onValueChange={(val) => setValue('subject', val as SupportSubject)}
                  >
                    <SelectTrigger className='bg-slate-50 border-transparent focus:bg-white focus:border-slate-200 h-14 rounded-xl'>
                      <SelectValue placeholder='Chủ đề' />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value='TUVAN'>Tư vấn sản phẩm</SelectItem>
                      <SelectItem value='KIEU_NAI'>Khiếu nại dịch vụ</SelectItem>
                      <SelectItem value='DOITRA'>Đổi trả hàng</SelectItem>
                      <SelectItem value='KHAC'>Vấn đề khác</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className='space-y-2'>
                  <Textarea
                    placeholder='Nội dung tin nhắn...'
                    {...register('message')}
                    className='bg-slate-50 border-transparent focus:bg-white focus:border-slate-200 min-h-[160px] rounded-2xl p-4'
                  />
                  {errors.message && (
                    <p className='text-red-500 text-xs mt-1'>{errors.message.message}</p>
                  )}
                </div>

                <Button
                  disabled={isSubmitting}
                  className='w-full h-14 bg-slate-900 hover:bg-black text-white rounded-2xl text-lg font-bold group'
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className='mr-2 h-5 w-5 animate-spin' />
                      Đang xử lý...
                    </>
                  ) : (
                    <>
                      Gửi tin nhắn ngay
                      <Send className='ml-2 h-5 w-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform' />
                    </>
                  )}
                </Button>
              </form>
            </motion.div>

            {/* Map Column */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              className='lg:col-span-7 h-full min-h-[500px]'
            >
              <div className='relative h-full w-full rounded-3xl overflow-hidden shadow-2xl border border-slate-100 group'>
                <iframe
                  src='https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1565.4542233633!2d106.7013!3d10.778!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31752f36f6d0a75f%3A0x647bf0c2bd5f4035!2sVincom%20Center%20Dong%20Khoi!5e0!3m2!1sen!2s!4v1700000000000!5m2!1sen!2s'
                  width='100%'
                  height='100%'
                  style={{ border: 0, filter: 'grayscale(10%)' }}
                  allowFullScreen
                  loading='lazy'
                  referrerPolicy='no-referrer-when-downgrade'
                  className='absolute inset-0 grayscale hover:grayscale-0 transition-all duration-700'
                ></iframe>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 4. FAQ Quick Access */}
      <section className='py-20 bg-slate-50'>
        <div className='container max-w-4xl mx-auto px-4 text-center'>
          <h2 className='text-3xl font-bold mb-12'>Câu hỏi thường gặp</h2>
          <Accordion type='single' collapsible className='text-left space-y-4'>
            {faqs.map((f, i) => (
              <AccordionItem
                key={i}
                value={`item-${i}`}
                className='bg-white border-none rounded-2xl px-6 py-2 shadow-sm'
              >
                <AccordionTrigger className='hover:no-underline font-bold text-slate-800 text-lg'>
                  {f.q}
                </AccordionTrigger>
                <AccordionContent className='text-slate-500 text-base leading-relaxed'>
                  {f.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      {/* 5. Follow Us */}
      <section className='py-20 bg-white border-t border-slate-100'>
        <div className='container max-w-7xl mx-auto px-4 text-center'>
          <h2 className='text-2xl font-bold text-slate-400 uppercase tracking-widest mb-10'>
            Kết nối cùng Zyna Fashion
          </h2>
          <div className='flex flex-wrap justify-center gap-12'>
            {['Instagram', 'Facebook', 'TikTok', 'LinkedIn'].map((app) => (
              <Button
                key={app}
                variant='link'
                className='text-2xl font-black text-slate-900 hover:text-blue-600 transition-colors uppercase italic'
              >
                {app}
              </Button>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
