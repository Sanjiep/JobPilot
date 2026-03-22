import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'JobPilot — AI Job Application Automation',
  description: 'Upload your CV once, let AI apply to jobs for you.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body className="antialiased">
        {children}
      </body>
    </html>
  )
}