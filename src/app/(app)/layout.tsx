import { WebmailLayout } from '@/components/WebmailLayout'

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return <WebmailLayout>{children}</WebmailLayout>
}
