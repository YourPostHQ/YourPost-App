import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { LayoutWrapper } from '@/components/LayoutWrapper'

export default function AppLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <div className="flex-1 pt-16">
        <LayoutWrapper>
          {children}
        </LayoutWrapper>
      </div>
      <Footer />
    </div>
  )
}
