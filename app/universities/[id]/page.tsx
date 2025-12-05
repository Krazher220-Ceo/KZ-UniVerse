import { notFound } from 'next/navigation'
import UniversityDetail from '@/components/universities/UniversityDetail'
import universitiesData from '@/data/universities.json'
import programsData from '@/data/programs.json'

export async function generateStaticParams() {
  return universitiesData.map((uni) => ({
    id: uni.id,
  }))
}

export async function generateMetadata({ params }: { params: { id: string } }) {
  const university = universitiesData.find(u => u.id === params.id)
  
  if (!university) {
    return {
      title: 'Университет не найден'
    }
  }

  return {
    title: `${university.name} | KZ UniVerse`,
    description: university.description,
  }
}

export default function UniversityPage({ params }: { params: { id: string } }) {
  const university = universitiesData.find(u => u.id === params.id)
  
  if (!university) {
    notFound()
  }

  const programs = programsData.filter(p => p.universityId === params.id)

  return <UniversityDetail university={university as any} programs={programs as any} />
}

