import ComparisonTool from '@/components/compare/ComparisonTool'

export const metadata = {
  title: 'Сравнение университетов | KZ UniVerse',
  description: 'Сравните университеты Казахстана по рейтингу, стоимости, программам и другим параметрам',
}

export default function ComparePage() {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Сравнение <span className="gradient-text">университетов</span>
          </h1>
          <p className="text-xl text-gray-600">
            Выберите до 3 университетов для детального сравнения
          </p>
        </div>

        <ComparisonTool />
      </div>
    </div>
  )
}

