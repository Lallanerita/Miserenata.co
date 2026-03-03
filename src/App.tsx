import { useState } from 'react'
import './App.css'
import { Music, Phone, MapPin, Clock, Star, ChevronDown, Menu, X, Calendar, Users, Heart, CheckCircle, ArrowRight, Gift } from 'lucide-react'

const cities = ['Duitama', 'Paipa', 'Sogamoso']

const packages = [
  {
    name: 'Serenata Básica',
    price: '250.000',
    duration: '20 min',
    songs: '6 canciones',
    musicians: '4 músicos',
    description: 'La serenata perfecta para sorprender a esa persona especial con las canciones más románticas.',
    features: ['4 músicos profesionales', '6 canciones a elegir', 'Traje típico de gala', 'Repertorio clásico mexicano'],
    popular: false,
    image: '/images/guitar.jpg',
    fallback: 'https://placehold.co/400x300/1a1a2e/d4af37?text=Serenata+B%C3%A1sica'
  },
  {
    name: 'Serenata Estándar',
    price: '320.000',
    duration: '30 min',
    songs: '8 canciones',
    musicians: '6 músicos',
    description: 'Una experiencia inolvidable con un grupo completo de mariachis de primer nivel.',
    features: ['6 músicos profesionales', '8 canciones a elegir', 'Traje de charro premium', 'Arreglo de rosas incluido', 'Repertorio personalizado'],
    popular: true,
    image: '/images/mariachi-hero.jpg',
    fallback: 'https://placehold.co/400x300/1a1a2e/d4af37?text=Serenata+Est%C3%A1ndar'
  },
  {
    name: 'Gran Serenata de Lujo',
    price: '380.000',
    duration: '40 min',
    songs: '12 canciones',
    musicians: '8 músicos',
    description: 'La experiencia más exclusiva: un espectáculo completo con el grupo de mariachis al completo.',
    features: ['8 músicos profesionales', '12 canciones a elegir', 'Traje de charro de lujo', 'Obsequio incluido', 'Arreglo de rosas premium', 'Video profesional incluido', 'MC dedicado', 'Repertorio 100% personalizado'],
    popular: false,
    image: '/images/trumpet.jpg',
    fallback: 'https://placehold.co/400x300/1a1a2e/d4af37?text=Gran+Serenata'
  }
]

const testimonials = [
  {
    name: 'Carolina Méndez',
    city: 'Duitama',
    text: 'Fue la mejor sorpresa que le pude dar a mi esposo. Los mariachis llegaron puntual y tocaron increíble. ¡100% recomendados!',
    rating: 5
  },
  {
    name: 'Andrés Rodríguez',
    city: 'Paipa',
    text: 'Contraté la serenata estándar para el cumpleaños de mi mamá. Lloró de la emoción. Servicio de primera calidad.',
    rating: 5
  },
  {
    name: 'María Fernanda López',
    city: 'Sogamoso',
    text: 'Excelente servicio, muy profesionales. Las canciones fueron hermosas y el grupo tiene una energía increíble.',
    rating: 5
  }
]

const timeSlots = [
  '6:00 PM', '7:00 PM', '8:00 PM', '9:00 PM', '10:00 PM', '11:00 PM'
]

const extras = [
  { id: 'chocolates', name: 'Caja de Chocolates', price: '35.000', icon: '🍫' },
  { id: 'rosas', name: 'Ramo de Rosas (12)', price: '45.000', icon: '🌹' },
  { id: 'globos', name: 'Globos Decorativos', price: '25.000', icon: '🎈' },
  { id: 'peluche', name: 'Peluche Grande', price: '40.000', icon: '🧸' },
  { id: 'vino', name: 'Botella de Vino', price: '55.000', icon: '🍷' },
  { id: 'tarjeta', name: 'Tarjeta Personalizada', price: '15.000', icon: '💌' },
]

function ImageWithFallback({ src, fallback, alt, className }: { src: string; fallback: string; alt: string; className?: string }) {
  return (
    <img
      src={src}
      alt={alt}
      className={className}
      onError={(e) => {
        const target = e.target as HTMLImageElement
        target.src = fallback
      }}
    />
  )
}

function App() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [selectedPackage, setSelectedPackage] = useState('')
  const [selectedCity, setSelectedCity] = useState('')
  const [selectedDate, setSelectedDate] = useState('')
  const [selectedTime, setSelectedTime] = useState('')
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [address, setAddress] = useState('')
  const [message, setMessage] = useState('')
  const [bookingSubmitted, setBookingSubmitted] = useState(false)
  const [selectedExtras, setSelectedExtras] = useState<string[]>([])

  const toggleExtra = (id: string) => {
    setSelectedExtras(prev =>
      prev.includes(id) ? prev.filter(e => e !== id) : [...prev, id]
    )
  }

  const handleBooking = (e: React.FormEvent) => {
    e.preventDefault()
    const extrasText = selectedExtras.length > 0
      ? selectedExtras.map(id => {
          const extra = extras.find(e => e.id === id)
          return extra ? `${extra.icon} ${extra.name} ($${extra.price})` : ''
        }).join(', ')
      : 'Ninguno'

    const whatsappMessage = `🎺 *Nueva Reserva de Serenata*%0A%0A` +
      `👤 *Nombre:* ${name}%0A` +
      `📱 *Teléfono:* ${phone}%0A` +
      `🎶 *Paquete:* ${selectedPackage}%0A` +
      `🎁 *Adicionales:* ${extrasText}%0A` +
      `📍 *Ciudad:* ${selectedCity}%0A` +
      `📅 *Fecha:* ${selectedDate}%0A` +
      `🕐 *Hora:* ${selectedTime}%0A` +
      `🏠 *Dirección:* ${address}%0A` +
      `💬 *Mensaje:* ${message || 'Sin mensaje adicional'}`

    window.open(`https://wa.me/573001234567?text=${whatsappMessage}`, '_blank')
    setBookingSubmitted(true)
    setTimeout(() => setBookingSubmitted(false), 5000)
  }

  const scrollToSection = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
    setMobileMenuOpen(false)
  }

  const today = new Date().toISOString().split('T')[0]

  return (
    <div className="min-h-screen bg-stone-950 text-white font-sans">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-stone-950/90 backdrop-blur-md border-b border-amber-900/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-20">
            <div className="flex items-center gap-2 cursor-pointer" onClick={() => scrollToSection('hero')}>
              <Music className="w-7 h-7 sm:w-8 sm:h-8 text-amber-400" />
              <span className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-amber-400 to-yellow-200 bg-clip-text text-transparent">
                Miserenata.co
              </span>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-8">
              <button onClick={() => scrollToSection('servicios')} className="text-stone-300 hover:text-amber-400 transition-colors font-medium">Servicios</button>
              <button onClick={() => scrollToSection('reservar')} className="text-stone-300 hover:text-amber-400 transition-colors font-medium">Reservar</button>
              <button onClick={() => scrollToSection('testimonios')} className="text-stone-300 hover:text-amber-400 transition-colors font-medium">Testimonios</button>
              <button onClick={() => scrollToSection('contacto')} className="text-stone-300 hover:text-amber-400 transition-colors font-medium">Contacto</button>
              <button
                onClick={() => scrollToSection('reservar')}
                className="bg-gradient-to-r from-amber-500 to-amber-600 text-stone-950 px-6 py-2.5 rounded-full font-bold hover:from-amber-400 hover:to-amber-500 transition-all shadow-lg shadow-amber-500/20"
              >
                Reservar Ahora
              </button>
            </div>

            {/* Mobile menu button */}
            <button
              className="md:hidden text-amber-400 p-2"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-stone-900/95 backdrop-blur-md border-t border-amber-900/30">
            <div className="flex flex-col items-center gap-4 py-6">
              <button onClick={() => scrollToSection('servicios')} className="text-stone-300 hover:text-amber-400 transition-colors font-medium text-lg">Servicios</button>
              <button onClick={() => scrollToSection('reservar')} className="text-stone-300 hover:text-amber-400 transition-colors font-medium text-lg">Reservar</button>
              <button onClick={() => scrollToSection('testimonios')} className="text-stone-300 hover:text-amber-400 transition-colors font-medium text-lg">Testimonios</button>
              <button onClick={() => scrollToSection('contacto')} className="text-stone-300 hover:text-amber-400 transition-colors font-medium text-lg">Contacto</button>
              <button
                onClick={() => scrollToSection('reservar')}
                className="bg-gradient-to-r from-amber-500 to-amber-600 text-stone-950 px-8 py-3 rounded-full font-bold text-lg"
              >
                Reservar Ahora
              </button>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section id="hero" className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0">
          <ImageWithFallback
            src="/images/serenata.jpg"
            fallback="https://placehold.co/1920x1080/1a1a2e/d4af37?text=Miserenata.co"
            alt="Mariachi en vivo"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-stone-950/80 via-stone-950/60 to-stone-950"></div>
        </div>

        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 text-center">
          <div className="inline-flex items-center gap-2 bg-amber-500/10 border border-amber-500/30 rounded-full px-4 py-2 mb-6 sm:mb-8">
            <Star className="w-4 h-4 text-amber-400" />
            <span className="text-amber-300 text-sm font-medium">N°1 en Serenatas en Boyacá</span>
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold leading-tight mb-4 sm:mb-6">
            <span className="bg-gradient-to-r from-amber-300 via-yellow-200 to-amber-400 bg-clip-text text-transparent">
              Serenatas y Mariachis
            </span>
            <br />
            <span className="text-white">de Clase Premium</span>
          </h1>

          <p className="text-lg sm:text-xl md:text-2xl text-stone-300 max-w-3xl mx-auto mb-8 sm:mb-10 leading-relaxed">
            Sorprende a quien más quieres con la mejor música de mariachi en
            <span className="text-amber-400 font-semibold"> Duitama</span>,
            <span className="text-amber-400 font-semibold"> Paipa</span> y
            <span className="text-amber-400 font-semibold"> Sogamoso</span>
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button
              onClick={() => scrollToSection('reservar')}
              className="bg-gradient-to-r from-amber-500 to-amber-600 text-stone-950 px-8 sm:px-10 py-4 rounded-full font-bold text-lg hover:from-amber-400 hover:to-amber-500 transition-all shadow-2xl shadow-amber-500/30 flex items-center gap-2 w-full sm:w-auto justify-center"
            >
              <Calendar className="w-5 h-5" />
              Reservar Serenata
            </button>
            <a
              href="https://wa.me/573001234567"
              target="_blank"
              rel="noopener noreferrer"
              className="border-2 border-amber-500/50 text-amber-400 px-8 sm:px-10 py-4 rounded-full font-bold text-lg hover:bg-amber-500/10 transition-all flex items-center gap-2 w-full sm:w-auto justify-center"
            >
              <Phone className="w-5 h-5" />
              WhatsApp
            </a>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 sm:gap-8 mt-12 sm:mt-16 max-w-2xl mx-auto">
            <div className="text-center">
              <div className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-amber-400">500+</div>
              <div className="text-stone-400 text-xs sm:text-sm mt-1">Serenatas Realizadas</div>
            </div>
            <div className="text-center">
              <div className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-amber-400">10+</div>
              <div className="text-stone-400 text-xs sm:text-sm mt-1">Años de Experiencia</div>
            </div>
            <div className="text-center">
              <div className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-amber-400">5.0</div>
              <div className="text-stone-400 text-xs sm:text-sm mt-1">Calificación Promedio</div>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <ChevronDown className="w-8 h-8 text-amber-400/60" />
        </div>
      </section>

      {/* Cities Section */}
      <section className="py-16 sm:py-20 bg-stone-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              <span className="bg-gradient-to-r from-amber-400 to-yellow-200 bg-clip-text text-transparent">Donde Estamos</span>
            </h2>
            <p className="text-stone-400 text-lg max-w-2xl mx-auto">Llevamos la mejor música de mariachi a las principales ciudades de Boyacá</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            {cities.map((city) => (
              <div
                key={city}
                className="group relative overflow-hidden rounded-2xl bg-gradient-to-b from-stone-800/80 to-stone-900/80 border border-amber-900/20 hover:border-amber-500/40 transition-all duration-300 cursor-pointer"
                onClick={() => {
                  setSelectedCity(city)
                  scrollToSection('reservar')
                }}
              >
                <div className="p-8 text-center">
                  <MapPin className="w-12 h-12 text-amber-400 mx-auto mb-4 group-hover:scale-110 transition-transform" />
                  <h3 className="text-2xl font-bold text-white mb-2">{city}</h3>
                  <p className="text-stone-400 mb-4">Cobertura completa en {city} y alrededores</p>
                  <span className="inline-flex items-center gap-1 text-amber-400 font-medium group-hover:gap-2 transition-all">
                    Reservar aquí <ArrowRight className="w-4 h-4" />
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services/Packages Section */}
      <section id="servicios" className="py-16 sm:py-24 bg-stone-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 sm:mb-16">
            <div className="inline-flex items-center gap-2 bg-amber-500/10 border border-amber-500/30 rounded-full px-4 py-2 mb-4">
              <Music className="w-4 h-4 text-amber-400" />
              <span className="text-amber-300 text-sm font-medium">Nuestros Paquetes</span>
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">
              <span className="bg-gradient-to-r from-amber-400 to-yellow-200 bg-clip-text text-transparent">Elige Tu Serenata</span>
            </h2>
            <p className="text-stone-400 text-lg max-w-2xl mx-auto">Cada paquete incluye músicos profesionales con traje típico de gala y un repertorio personalizado a tu gusto</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            {packages.map((pkg) => (
              <div
                key={pkg.name}
                className={`relative rounded-2xl overflow-hidden flex flex-col transition-all duration-300 hover:-translate-y-2 ${
                  pkg.popular
                    ? 'bg-gradient-to-b from-amber-900/40 to-stone-900 border-2 border-amber-500/50 shadow-2xl shadow-amber-500/10'
                    : 'bg-stone-900 border border-stone-800 hover:border-amber-900/40'
                }`}
              >
                {pkg.popular && (
                  <div className="absolute top-4 right-4 bg-amber-500 text-stone-950 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider z-10">
                    Más Popular
                  </div>
                )}

                <div className="h-48 overflow-hidden">
                  <ImageWithFallback
                    src={pkg.image}
                    fallback={pkg.fallback}
                    alt={pkg.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                  />
                  <div className="absolute top-0 left-0 right-0 h-48 bg-gradient-to-b from-transparent to-stone-900/80"></div>
                </div>

                <div className="p-6 sm:p-8 flex flex-col flex-1">
                  <h3 className="text-xl sm:text-2xl font-bold text-white mb-2">{pkg.name}</h3>
                  <p className="text-stone-400 text-sm mb-4">{pkg.description}</p>

                  <div className="flex items-baseline gap-1 mb-6">
                    <span className="text-3xl sm:text-4xl font-extrabold text-amber-400">${pkg.price}</span>
                    <span className="text-stone-500 text-sm">COP</span>
                  </div>

                  <div className="flex flex-wrap gap-3 mb-6">
                    <span className="flex items-center gap-1 text-xs text-stone-400 bg-stone-800 rounded-full px-3 py-1.5">
                      <Clock className="w-3 h-3 text-amber-400" /> {pkg.duration}
                    </span>
                    <span className="flex items-center gap-1 text-xs text-stone-400 bg-stone-800 rounded-full px-3 py-1.5">
                      <Music className="w-3 h-3 text-amber-400" /> {pkg.songs}
                    </span>
                    <span className="flex items-center gap-1 text-xs text-stone-400 bg-stone-800 rounded-full px-3 py-1.5">
                      <Users className="w-3 h-3 text-amber-400" /> {pkg.musicians}
                    </span>
                  </div>

                  <ul className="space-y-2.5 mb-8 flex-1">
                    {pkg.features.map((feature) => (
                      <li key={feature} className="flex items-start gap-2 text-sm text-stone-300">
                        <CheckCircle className="w-4 h-4 text-amber-400 mt-0.5 flex-shrink-0" />
                        {feature}
                      </li>
                    ))}
                  </ul>

                  <button
                    onClick={() => {
                      setSelectedPackage(pkg.name)
                      scrollToSection('reservar')
                    }}
                    className={`w-full py-3 rounded-xl font-bold transition-all ${
                      pkg.popular
                        ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-stone-950 hover:from-amber-400 hover:to-amber-500 shadow-lg shadow-amber-500/20'
                        : 'border-2 border-amber-500/40 text-amber-400 hover:bg-amber-500/10'
                    }`}
                  >
                    Seleccionar Paquete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Booking Section */}
      <section id="reservar" className="py-16 sm:py-24 bg-stone-900/50 relative">
        <div className="absolute inset-0 overflow-hidden">
          <ImageWithFallback
            src="/images/night-city.jpg"
            fallback="https://placehold.co/1920x1080/1a1a2e/111?text="
            alt=""
            className="w-full h-full object-cover opacity-10"
          />
        </div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-amber-500/10 border border-amber-500/30 rounded-full px-4 py-2 mb-4">
              <Calendar className="w-4 h-4 text-amber-400" />
              <span className="text-amber-300 text-sm font-medium">Reserva en Minutos</span>
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">
              <span className="bg-gradient-to-r from-amber-400 to-yellow-200 bg-clip-text text-transparent">Reserva Tu Serenata</span>
            </h2>
            <p className="text-stone-400 text-lg max-w-xl mx-auto">Completa el formulario y te confirmaremos por WhatsApp en menos de 5 minutos</p>
          </div>

          {bookingSubmitted ? (
            <div className="bg-gradient-to-b from-amber-900/30 to-stone-900 border border-amber-500/40 rounded-3xl p-10 sm:p-14 text-center">
              <CheckCircle className="w-16 h-16 text-amber-400 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-white mb-2">¡Reserva Enviada!</h3>
              <p className="text-stone-400 text-lg">Te contactaremos por WhatsApp para confirmar todos los detalles.</p>
            </div>
          ) : (
            <form onSubmit={handleBooking} className="bg-gradient-to-b from-stone-800/80 to-stone-900/90 border border-amber-900/30 rounded-3xl p-6 sm:p-10 space-y-6 backdrop-blur-md shadow-2xl">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {/* Name */}
                <div>
                  <label className="block text-sm font-medium text-amber-300 mb-2">Nombre Completo *</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Tu nombre completo"
                    className="w-full bg-stone-800/80 border border-stone-700 rounded-xl px-4 py-3 text-white placeholder-stone-500 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500/50 transition-all"
                  />
                </div>

                {/* Phone */}
                <div>
                  <label className="block text-sm font-medium text-amber-300 mb-2">Teléfono / WhatsApp *</label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="300 123 4567"
                    className="w-full bg-stone-800/80 border border-stone-700 rounded-xl px-4 py-3 text-white placeholder-stone-500 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500/50 transition-all"
                  />
                </div>

                {/* Package */}
                <div>
                  <label className="block text-sm font-medium text-amber-300 mb-2">Paquete *</label>
                  <div className="relative">
                    <select
                      required
                      value={selectedPackage}
                      onChange={(e) => setSelectedPackage(e.target.value)}
                      className="w-full bg-stone-800/80 border border-stone-700 rounded-xl px-4 py-3 text-white appearance-none focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500/50 transition-all cursor-pointer"
                    >
                      <option value="">Selecciona un paquete</option>
                      {packages.map((pkg) => (
                        <option key={pkg.name} value={pkg.name}>{pkg.name} - ${pkg.price} COP</option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-stone-500 pointer-events-none" />
                  </div>
                </div>

                {/* City */}
                <div>
                  <label className="block text-sm font-medium text-amber-300 mb-2">Ciudad *</label>
                  <div className="relative">
                    <select
                      required
                      value={selectedCity}
                      onChange={(e) => setSelectedCity(e.target.value)}
                      className="w-full bg-stone-800/80 border border-stone-700 rounded-xl px-4 py-3 text-white appearance-none focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500/50 transition-all cursor-pointer"
                    >
                      <option value="">Selecciona la ciudad</option>
                      {cities.map((city) => (
                        <option key={city} value={city}>{city}</option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-stone-500 pointer-events-none" />
                  </div>
                </div>

                {/* Date */}
                <div>
                  <label className="block text-sm font-medium text-amber-300 mb-2">Fecha *</label>
                  <input
                    type="date"
                    required
                    min={today}
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="w-full bg-stone-800/80 border border-stone-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500/50 transition-all cursor-pointer"
                  />
                </div>

                {/* Time */}
                <div>
                  <label className="block text-sm font-medium text-amber-300 mb-2">Hora *</label>
                  <div className="relative">
                    <select
                      required
                      value={selectedTime}
                      onChange={(e) => setSelectedTime(e.target.value)}
                      className="w-full bg-stone-800/80 border border-stone-700 rounded-xl px-4 py-3 text-white appearance-none focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500/50 transition-all cursor-pointer"
                    >
                      <option value="">Selecciona la hora</option>
                      {timeSlots.map((time) => (
                        <option key={time} value={time}>{time}</option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-stone-500 pointer-events-none" />
                  </div>
                </div>
              </div>

              {/* Extras / Add-ons */}
              {selectedPackage && (
                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-amber-300 mb-3">
                    <Gift className="w-4 h-4" />
                    Detalles Adicionales (Opcional)
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {extras.map((extra) => {
                      const isSelected = selectedExtras.includes(extra.id)
                      return (
                        <button
                          key={extra.id}
                          type="button"
                          onClick={() => toggleExtra(extra.id)}
                          className={`flex flex-col items-center gap-1.5 p-4 rounded-xl border-2 transition-all duration-200 ${
                            isSelected
                              ? 'border-amber-500 bg-amber-500/10 shadow-lg shadow-amber-500/10'
                              : 'border-stone-700 bg-stone-800/60 hover:border-amber-900/60 hover:bg-stone-800'
                          }`}
                        >
                          <span className="text-2xl">{extra.icon}</span>
                          <span className={`text-xs font-medium text-center leading-tight ${isSelected ? 'text-amber-300' : 'text-stone-300'}`}>
                            {extra.name}
                          </span>
                          <span className={`text-xs font-bold ${isSelected ? 'text-amber-400' : 'text-stone-500'}`}>
                            +${extra.price}
                          </span>
                          {isSelected && (
                            <CheckCircle className="w-4 h-4 text-amber-400" />
                          )}
                        </button>
                      )
                    })}
                  </div>
                </div>
              )}

              {/* Address */}
              <div>
                <label className="block text-sm font-medium text-amber-300 mb-2">Dirección de la Serenata *</label>
                <input
                  type="text"
                  required
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Dirección completa donde será la serenata"
                  className="w-full bg-stone-800/80 border border-stone-700 rounded-xl px-4 py-3 text-white placeholder-stone-500 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500/50 transition-all"
                />
              </div>

              {/* Message */}
              <div>
                <label className="block text-sm font-medium text-amber-300 mb-2">Mensaje Adicional (Opcional)</label>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  rows={3}
                  placeholder="¿Alguna canción especial? ¿Algún detalle que debamos saber?"
                  className="w-full bg-stone-800/80 border border-stone-700 rounded-xl px-4 py-3 text-white placeholder-stone-500 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500/50 transition-all resize-none"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-gradient-to-r from-amber-500 to-amber-600 text-stone-950 py-4 rounded-xl font-bold text-lg hover:from-amber-400 hover:to-amber-500 transition-all shadow-2xl shadow-amber-500/20 flex items-center justify-center gap-2"
              >
                <Heart className="w-5 h-5" />
                Enviar Reserva por WhatsApp
              </button>

              <p className="text-stone-500 text-xs text-center">
                Al enviar, serás redirigido a WhatsApp para confirmar tu reserva directamente con nuestro equipo.
              </p>
            </form>
          )}
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonios" className="py-16 sm:py-24 bg-stone-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 sm:mb-16">
            <div className="inline-flex items-center gap-2 bg-amber-500/10 border border-amber-500/30 rounded-full px-4 py-2 mb-4">
              <Heart className="w-4 h-4 text-amber-400" />
              <span className="text-amber-300 text-sm font-medium">Lo que dicen nuestros clientes</span>
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">
              <span className="bg-gradient-to-r from-amber-400 to-yellow-200 bg-clip-text text-transparent">Testimonios</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            {testimonials.map((testimonial) => (
              <div
                key={testimonial.name}
                className="bg-gradient-to-b from-stone-800/60 to-stone-900/60 border border-stone-800 rounded-2xl p-6 sm:p-8 hover:border-amber-900/40 transition-all"
              >
                <div className="flex gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-amber-400 fill-amber-400" />
                  ))}
                </div>
                <p className="text-stone-300 mb-6 leading-relaxed italic">"{testimonial.text}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-amber-400 to-amber-600 rounded-full flex items-center justify-center text-stone-950 font-bold text-sm">
                    {testimonial.name.charAt(0)}
                  </div>
                  <div>
                    <div className="font-semibold text-white text-sm">{testimonial.name}</div>
                    <div className="text-stone-500 text-xs flex items-center gap-1">
                      <MapPin className="w-3 h-3" /> {testimonial.city}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section className="py-16 sm:py-20 bg-stone-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              <span className="bg-gradient-to-r from-amber-400 to-yellow-200 bg-clip-text text-transparent">¿Cómo Funciona?</span>
            </h2>
            <p className="text-stone-400 text-lg max-w-xl mx-auto">En solo 3 pasos tendrás tu serenata reservada</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { step: '1', title: 'Elige tu Paquete', desc: 'Selecciona el paquete de serenata que más se ajuste a tu ocasión y presupuesto.', icon: Music },
              { step: '2', title: 'Reserva tu Horario', desc: 'Escoge la fecha, hora y ciudad. Nosotros nos encargamos de coordinar todo.', icon: Calendar },
              { step: '3', title: 'Disfruta la Serenata', desc: 'Nuestro grupo llegará puntual y listo para crear un momento inolvidable.', icon: Heart },
            ].map((item) => (
              <div key={item.step} className="text-center group">
                <div className="relative inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-amber-500 to-amber-600 rounded-2xl mb-6 shadow-lg shadow-amber-500/20 group-hover:scale-110 transition-transform">
                  <item.icon className="w-9 h-9 text-stone-950" />
                  <div className="absolute -top-2 -right-2 w-7 h-7 bg-stone-950 border-2 border-amber-500 rounded-full flex items-center justify-center text-amber-400 text-xs font-bold">
                    {item.step}
                  </div>
                </div>
                <h3 className="text-xl font-bold text-white mb-2">{item.title}</h3>
                <p className="text-stone-400">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact / CTA Section */}
      <section id="contacto" className="py-16 sm:py-24 bg-stone-950">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6">
            <span className="bg-gradient-to-r from-amber-400 to-yellow-200 bg-clip-text text-transparent">¿Listo para Sorprender?</span>
          </h2>
          <p className="text-stone-400 text-lg max-w-2xl mx-auto mb-10">
            Contáctanos directamente por WhatsApp o llámanos. Estamos disponibles para ti todos los días de la semana.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
            <div className="bg-stone-900 border border-stone-800 rounded-2xl p-6 hover:border-amber-900/40 transition-all">
              <Phone className="w-8 h-8 text-amber-400 mx-auto mb-3" />
              <h4 className="font-bold text-white mb-1">Teléfono</h4>
              <p className="text-stone-400 text-sm">300 123 4567</p>
            </div>
            <div className="bg-stone-900 border border-stone-800 rounded-2xl p-6 hover:border-amber-900/40 transition-all">
              <Clock className="w-8 h-8 text-amber-400 mx-auto mb-3" />
              <h4 className="font-bold text-white mb-1">Horario</h4>
              <p className="text-stone-400 text-sm">Lunes a Domingo<br />2:00 PM - 12:00 AM</p>
            </div>
            <div className="bg-stone-900 border border-stone-800 rounded-2xl p-6 hover:border-amber-900/40 transition-all">
              <MapPin className="w-8 h-8 text-amber-400 mx-auto mb-3" />
              <h4 className="font-bold text-white mb-1">Cobertura</h4>
              <p className="text-stone-400 text-sm">Duitama, Paipa<br />y Sogamoso</p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="https://wa.me/573001234567"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-green-600 hover:bg-green-500 text-white px-8 py-4 rounded-full font-bold text-lg transition-all shadow-lg shadow-green-500/20 flex items-center justify-center gap-2"
            >
              <Phone className="w-5 h-5" />
              Escríbenos por WhatsApp
            </a>
            <button
              onClick={() => scrollToSection('reservar')}
              className="bg-gradient-to-r from-amber-500 to-amber-600 text-stone-950 px-8 py-4 rounded-full font-bold text-lg hover:from-amber-400 hover:to-amber-500 transition-all shadow-lg shadow-amber-500/20 flex items-center justify-center gap-2"
            >
              <Calendar className="w-5 h-5" />
              Reservar Serenata
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-stone-900/50 border-t border-stone-800 py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-2">
              <Music className="w-6 h-6 text-amber-400" />
              <span className="text-lg font-bold bg-gradient-to-r from-amber-400 to-yellow-200 bg-clip-text text-transparent">
                Miserenata.co
              </span>
            </div>
            <div className="flex items-center gap-6 text-stone-500 text-sm">
              <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> Duitama, Paipa, Sogamoso</span>
              <span className="flex items-center gap-1"><Phone className="w-3 h-3" /> 300 123 4567</span>
            </div>
            <p className="text-stone-600 text-sm">
              © 2026 Miserenata.co. Todos los derechos reservados.
            </p>
          </div>
        </div>
      </footer>

      {/* Floating WhatsApp Button */}
      <a
        href="https://wa.me/573001234567"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-50 bg-green-500 hover:bg-green-400 text-white w-14 h-14 sm:w-16 sm:h-16 rounded-full shadow-2xl shadow-green-500/30 flex items-center justify-center transition-all hover:scale-110"
        title="Chat por WhatsApp"
      >
        <Phone className="w-7 h-7 sm:w-8 sm:h-8" />
      </a>
    </div>
  )
}

export default App
