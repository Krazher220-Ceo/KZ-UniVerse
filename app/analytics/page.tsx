import AnalyticsDashboard from '@/components/analytics/AnalyticsDashboard'

export const metadata = {
  title: 'Аналитика | KZ UniVerse',
  description: 'Статистика и аналитика по университетам Казахстана',
}

export default function AnalyticsPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Аналитика и <span className="gradient-text">статистика</span>
          </h1>
          <p className="text-xl text-gray-600">
            Данные о популярности университетов и программ в режиме реального времени
          </p>
        </div>

        <AnalyticsDashboard />
      </div>
    </div>
  )
}

