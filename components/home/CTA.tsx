import Link from 'next/link'
import { FiArrowRight, FiMessageCircle } from 'react-icons/fi'

export default function CTA() {
  return (
    <section className="py-20 bg-gradient-to-br from-primary-600 via-primary-700 to-secondary-600 text-white relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-white rounded-full filter blur-3xl"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-white rounded-full filter blur-3xl"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-6xl font-bold mb-6">
            Готовы найти свой университет?
          </h2>
          <p className="text-xl md:text-2xl mb-12 text-primary-100">
            Присоединяйтесь к тысячам студентов, которые уже выбрали свой путь с KZ UniVerse
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/universities">
              <button className="px-8 py-4 bg-white text-primary-600 rounded-xl hover:shadow-2xl transition-all text-lg font-semibold flex items-center space-x-2 w-full sm:w-auto">
                <span>Смотреть университеты</span>
                <FiArrowRight />
              </button>
            </Link>

            <button className="px-8 py-4 border-2 border-white text-white rounded-xl hover:bg-white hover:text-primary-600 transition-all text-lg font-semibold flex items-center space-x-2 w-full sm:w-auto">
              <FiMessageCircle />
              <span>Спросить AI-помощника</span>
            </button>
          </div>

          <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="text-4xl font-bold mb-2">100%</div>
              <div className="text-primary-100">Бесплатно для студентов</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold mb-2">24/7</div>
              <div className="text-primary-100">AI-помощник всегда онлайн</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold mb-2">10+</div>
              <div className="text-primary-100">Лучших университетов РК</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

