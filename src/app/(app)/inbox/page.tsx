import WebmailApp from '@/components/WebmailApp'

export default function InboxPage() {
  // Token is validated by the (app)/layout, so we can safely render WebmailApp
  return <WebmailApp />
}
