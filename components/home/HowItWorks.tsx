import { FiSearch, FiCompass, FiEye, FiCheckCircle } from 'react-icons/fi'

const steps = [
  {
    icon: FiSearch,
    number: 1,
    title: 'Найдите университет',
    description: 'Используйте поиск или AI-помощника для подбора университетов по вашим критериям',
    color: 'bg-primary-500'
  },
  {
    icon: FiCompass,
    number: 2,
    title: 'Сравните варианты',
    description: 'Изучите детальную информацию, сравните программы, стоимость и условия поступления',
    color: 'bg-secondary-500'
  },
  {
    icon: FiEye,
    number: 3,
    title: 'Исследуйте кампус',
    description: 'Совершите виртуальный 3D-тур по территории и помещениям университета',
    color: 'bg-accent-500'
  },
  {
    icon: FiCheckCircle,
    number: 4,
    title: 'Поступайте',
    description: 'Получите всю информацию о процессе поступления и подайте заявку напрямую',
    color: 'bg-green-500'
  }
]

export default function HowItWorks() {
  return (
    <section className="py-20 bg-gradient-to-br from-primary-50 via-white to-secondary-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Как это <span className="gradient-text">работает</span>?
          </h2>
          <p className="text-xl text-gray-600">
            Простой процесс выбора идеального университета за 4 шага
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative">
          {/* Connection lines */}
          <div className="hidden lg:block absolute top-24 left-0 right-0 h-1">
            <div className="absolute inset-0 bg-gradient-to-r from-primary-200 via-secondary-200 to-green-200" style={{ width: '85%', marginLeft: '7.5%' }}></div>
          </div>

          {steps.map((step, index) => (
            <div key={index} className="relative">
              <div className="glass-effect rounded-2xl p-8 text-center hover:shadow-xl transition-all">
                <div className={`inline-flex items-center justify-center w-20 h-20 ${step.color} text-white rounded-full mb-6 relative z-10`}>
                  <step.icon size={32} />
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-white rounded-full flex items-center justify-center text-gray-900 font-bold text-sm border-4 border-gray-50">
                    {step.number}
                  </div>
                </div>

                <h3 className="text-xl font-bold mb-3">{step.title}</h3>
                <p className="text-gray-600">{step.description}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-16">
          <div className="inline-flex items-center space-x-2 bg-white/80 backdrop-blur-sm px-6 py-3 rounded-full shadow-md">
            <span className="text-2xl">⚡</span>
            <span className="text-gray-700 font-medium">Весь процесс занимает менее 10 минут</span>
          </div>
        </div>
      </div>
    </section>
  )
}

