import { NextRequest, NextResponse } from 'next/server'
import universitiesData from '@/data/universities.json'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const query = searchParams.get('q')

    let universities = [...universitiesData]

    // Фильтрация по запросу
    if (query) {
      const lowerQuery = query.toLowerCase()
      universities = universities.filter(uni =>
        uni.name.toLowerCase().includes(lowerQuery) ||
        uni.nameKz.toLowerCase().includes(lowerQuery) ||
        uni.shortName.toLowerCase().includes(lowerQuery) ||
        uni.city.toLowerCase().includes(lowerQuery)
      )
    }

    // Сортировка по рейтингу
    universities.sort((a, b) => b.rating - a.rating)

    return NextResponse.json(universities)
  } catch (error) {
    console.error('Universities API error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch universities' },
      { status: 500 }
    )
  }
}

