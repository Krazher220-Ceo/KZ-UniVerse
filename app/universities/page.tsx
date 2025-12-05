import UniversityCatalog from '@/components/universities/UniversityCatalog'
import { Suspense } from 'react'

export const metadata = {
  title: 'Каталог университетов Казахстана | KZ UniVerse',
  description: 'Полный каталог всех университетов Казахстана с фильтрами, сравнением и детальной информацией',
}

export default function UniversitiesPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Каталог <span className="gradient-text">университетов</span>
          </h1>
          <p className="text-xl text-gray-600">
            Найдите идеальный университет среди лучших вузов Казахстана
          </p>
        </div>

        <Suspense fallback={<div className="flex justify-center py-20"><div className="spinner"></div></div>}>
          <UniversityCatalog />
        </Suspense>
      </div>
    </div>
  )
}

