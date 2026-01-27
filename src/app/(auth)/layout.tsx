import { GuestGuard } from '@/components/auth/guest-guard'

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <GuestGuard>
      <div className='min-h-screen'>{children}</div>
    </GuestGuard>
  )
}
