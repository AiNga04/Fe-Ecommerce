'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { toast } from 'sonner'
import { Loader2, Send } from 'lucide-react'
import { supportService } from '@/services/support'
import { SupportSubject } from '@/types/support'

export function ContactFormMap() {
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const form = e.currentTarget
    if (isSubmitting) return

    setIsSubmitting(true)

    const formData = new FormData(form)
    const payload = {
      name: formData.get('name') as string,
      phone: formData.get('phone') as string,
      email: formData.get('email') as string,
      subject: formData.get('subject') as SupportSubject,
      message: formData.get('message') as string,
    }

    try {
      const res = await supportService.submitTicket(payload)
      const data = res.data

      if (data.success) {
        toast.success('Gửi tin nhắn thành công! Chúng tôi sẽ liên hệ lại với bạn sớm nhất.')
        form.reset()
      } else {
        toast.error(data.message || 'Gửi tin nhắn thất bại. Vui lòng thử lại.')
      }
    } catch (error: any) {
      console.error('Submit ticket error:', error)
      toast.error('Đã có lỗi xảy ra. Vui lòng thử lại sau.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <section className='py-24 bg-white'>
      <div className='container mx-auto max-w-10xl px-4 md:px-6'>
        <div className='grid lg:grid-cols-12 gap-12 items-start'>
          {/* Form Column - col-span-5 */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className='lg:col-span-12 xl:col-span-5 space-y-8'
          >
            <div className='space-y-4'>
              <h2 className='text-3xl font-bold tracking-tight text-slate-900'>Gửi Tin Nhắn</h2>
              <p className='text-slate-500 font-light leading-relaxed'>
                Đừng ngần ngại liên hệ với chúng tôi nếu bạn có bất kỳ thắc mắc nào. Đội ngũ Zyna
                luôn sẵn sàng hỗ trợ bạn.
              </p>
            </div>

            <form onSubmit={handleSubmit} className='space-y-6'>
              <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
                <div className='space-y-2'>
                  <Label htmlFor='name' className='text-sm font-bold text-slate-700'>
                    Họ và Tên
                  </Label>
                  <Input
                    id='name'
                    name='name'
                    placeholder='Nguyễn Văn A'
                    required
                    className='h-12 bg-slate-50 border-transparent rounded-xl focus:border-slate-300 focus:bg-white transition-all px-4'
                  />
                </div>
                <div className='space-y-2'>
                  <Label htmlFor='phone' className='text-sm font-bold text-slate-700'>
                    Số điện thoại
                  </Label>
                  <Input
                    id='phone'
                    name='phone'
                    type='tel'
                    placeholder='09xx xxx xxx'
                    required
                    className='h-12 bg-slate-50 border-transparent rounded-xl focus:border-slate-300 focus:bg-white transition-all px-4'
                  />
                </div>
              </div>

              <div className='space-y-2'>
                <Label htmlFor='email' className='text-sm font-bold text-slate-700'>
                  Email
                </Label>
                <Input
                  id='email'
                  name='email'
                  type='email'
                  placeholder='example@mail.com'
                  required
                  className='h-12 bg-slate-50 border-transparent rounded-xl focus:border-slate-300 focus:bg-white transition-all px-4'
                />
              </div>

              <div className='space-y-2'>
                <Label htmlFor='subject' className='text-sm font-bold text-slate-700'>
                  Chủ Đề
                </Label>
                <Select name='subject' required>
                  <SelectTrigger
                    id='subject'
                    className='w-full h-12 bg-slate-50 border-transparent rounded-xl focus:border-slate-300 focus:bg-white transition-all px-4'
                  >
                    <SelectValue placeholder='Chọn nội dung bạn cần hỗ trợ' />
                  </SelectTrigger>
                  <SelectContent className='rounded-xl border-slate-100 shadow-xl'>
                    <SelectItem value='TUVAN'>Tư vấn sản phẩm</SelectItem>
                    <SelectItem value='DONHANG'>Hỗ trợ đơn hàng</SelectItem>
                    <SelectItem value='DOITRA'>Đổi trả</SelectItem>
                    <SelectItem value='HOPTAC'>Hợp tác</SelectItem>
                    <SelectItem value='KHAC'>Khác</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className='space-y-2'>
                <Label htmlFor='message' className='text-sm font-bold text-slate-700'>
                  Tin Nhắn
                </Label>
                <Textarea
                  id='message'
                  name='message'
                  placeholder='Nhập nội dung tin nhắn của bạn...'
                  required
                  className='min-h-[150px] bg-slate-50 border-transparent rounded-xl focus:border-slate-300 focus:bg-white transition-all p-4 resize-none'
                />
              </div>

              <Button
                type='submit'
                disabled={isSubmitting}
                className='w-full h-14 bg-slate-900 hover:bg-black text-white rounded-xl font-bold transition-all shadow-lg shadow-slate-900/10 group active:scale-[0.98]'
              >
                {isSubmitting ? (
                  <Loader2 className='w-5 h-5 animate-spin mr-2' />
                ) : (
                  <Send className='w-5 h-5 mr-2 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform' />
                )}
                Gửi Tin Nhắn
              </Button>
            </form>
          </motion.div>

          {/* Map Column - col-span-7 */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className='lg:col-span-12 xl:col-span-7 h-[400px] lg:h-[600px] w-full rounded-2xl overflow-hidden shadow-xl border border-slate-100 relative group'
          >
            <iframe
              src='https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3919.458231061994!2d106.70114711100366!3d10.776615059146!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31752f4946328399%3A0xc069d25a6665790c!2sVincom%20Center!5e0!3m2!1svi!2s!4v1709450000000!5m2!1svi!2s'
              width='100%'
              height='100%'
              style={{ border: 0 }}
              allowFullScreen
              loading='lazy'
              referrerPolicy='no-referrer-when-downgrade'
              className='grayscale hover:grayscale-0 transition-all duration-700'
            />
          </motion.div>
        </div>
      </div>
    </section>
  )
}
