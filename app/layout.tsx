import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import AIChat from '@/components/AIChat'
import VoiceAssistant from '@/components/innovations/VoiceAssistant'

const inter = Inter({ subsets: ['latin', 'cyrillic'] })

export const metadata: Metadata = {
  title: 'KZ UniVerse - Единая платформа университетов Казахстана',
  description: 'Найдите идеальный университет в Казахстане с помощью AI-помощника. Сравнивайте вузы, изучайте программы, совершайте 3D-туры по кампусам.',
  keywords: 'университет, Казахстан, образование, поступление, вуз, учеба',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ru">
      <head>
        <script src="https://telegram.org/js/telegram-web-app.js" async></script>
      </head>
      <body className={inter.className}>
        <Header />
        <main className="min-h-screen">
          {children}
        </main>
        <Footer />
        <AIChat />
        <VoiceAssistant />
      </body>
    </html>
  )
}

