import Link from 'next/link'
import { FiFacebook, FiInstagram, FiTwitter, FiYoutube, FiMail, FiPhone, FiMapPin } from 'react-icons/fi'

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* About */}
          <div>
            <h3 className="text-white font-bold text-lg mb-4">KZ UniVerse</h3>
            <p className="text-sm mb-4">
              Единая платформа университетов Казахстана с AI-помощником для выбора идеального образования.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="hover:text-primary-400 transition-colors">
                <FiFacebook size={20} />
              </a>
              <a href="#" className="hover:text-primary-400 transition-colors">
                <FiInstagram size={20} />
              </a>
              <a href="#" className="hover:text-primary-400 transition-colors">
                <FiTwitter size={20} />
              </a>
              <a href="#" className="hover:text-primary-400 transition-colors">
                <FiYoutube size={20} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-bold text-lg mb-4">Быстрые ссылки</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/universities" className="hover:text-primary-400 transition-colors">
                  Все университеты
                </Link>
              </li>
              <li>
                <Link href="/compare" className="hover:text-primary-400 transition-colors">
                  Сравнить ВУЗы
                </Link>
              </li>
              <li>
                <Link href="/analytics" className="hover:text-primary-400 transition-colors">
                  Аналитика
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-primary-400 transition-colors">
                  О проекте
                </Link>
              </li>
            </ul>
          </div>

          {/* For Universities */}
          <div>
            <h3 className="text-white font-bold text-lg mb-4">Для ВУЗов</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="#" className="hover:text-primary-400 transition-colors">
                  Разместить университет
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-primary-400 transition-colors">
                  Аналитика и статистика
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-primary-400 transition-colors">
                  Premium профиль
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-primary-400 transition-colors">
                  API интеграция
                </a>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-white font-bold text-lg mb-4">Контакты</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start space-x-2">
                <FiMapPin className="mt-1 flex-shrink-0" />
                <span>Алматы, Казахстан</span>
              </li>
              <li className="flex items-center space-x-2">
                <FiMail />
                <a href="mailto:info@kzuniverse.kz" className="hover:text-primary-400">
                  info@kzuniverse.kz
                </a>
              </li>
              <li className="flex items-center space-x-2">
                <FiPhone />
                <a href="tel:+77001234567" className="hover:text-primary-400">
                  +7 (700) 123-45-67
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm">
          <p>&copy; 2025 KZ UniVerse. Все права защищены.</p>
          <p className="mt-2 text-xs text-gray-500">
            Создано для хакатона Hackaton TS1
          </p>
        </div>
      </div>
    </footer>
  )
}

