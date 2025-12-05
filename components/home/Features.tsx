import { FiSearch, FiGlobe, FiCompass, FiMessageCircle, FiBarChart2, FiCheck } from 'react-icons/fi'

const features = [
  {
    icon: FiSearch,
    title: 'Единый каталог',
    description: 'Все университеты Казахстана в одном месте с полной информацией о программах, стоимости и условиях поступления',
    color: 'from-primary-400 to-primary-600'
  },
  {
    icon: FiGlobe,
    title: '3D-туры кампусов',
    description: 'Виртуальные экскурсии по университетским кампусам. Исследуйте территорию, корпуса и инфраструктуру не выходя из дома',
    color: 'from-secondary-400 to-secondary-600'
  },
  {
    icon: FiCompass,
    title: 'Умное сравнение',
    description: 'Сравнивайте университеты по любым параметрам: стоимость, рейтинг, программы, локация. С подробными таблицами и графиками',
    color: 'from-accent-400 to-accent-600'
  },
  {
    icon: FiMessageCircle,
    title: 'AI-помощник',
    description: 'Искусственный интеллект поможет выбрать программу, ответит на вопросы о поступлении и подберёт университет под ваши цели',
    color: 'from-purple-400 to-purple-600'
  },
  {
    icon: FiBarChart2,
    title: 'Аналитика и статистика',
    description: 'Актуальная статистика по популярности программ, трудоустройству выпускников и спросу на специальности',
    color: 'from-green-400 to-green-600'
  },
  {
    icon: FiCheck,
    title: 'Персональные рекомендации',
    description: 'Система умной навигации даёт персональные рекомендации на основе ваших интересов, бюджета и целей',
    color: 'from-blue-400 to-blue-600'
  }
]

export default function Features() {
  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Почему <span className="gradient-text">KZ UniVerse</span>?
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Мы объединили все необходимые инструменты для выбора университета в одной удобной платформе
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div 
              key={index}
              className="group relative p-8 rounded-2xl bg-gradient-to-br from-gray-50 to-white border border-gray-100 hover:border-transparent hover:shadow-2xl transition-all duration-300"
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-5 rounded-2xl transition-opacity`}></div>
              
              <div className={`inline-flex p-4 rounded-2xl bg-gradient-to-br ${feature.color} text-white mb-6`}>
                <feature.icon size={32} />
              </div>

              <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

