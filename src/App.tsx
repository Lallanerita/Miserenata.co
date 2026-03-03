import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import './App.css'
import { createClient, type Session } from '@supabase/supabase-js'
import { Music, Phone, MapPin, Clock, Star, ChevronDown, Menu, X, Calendar, Users, Heart, CheckCircle, Gift, MessageCircle } from 'lucide-react'

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL ?? 'https://wbdxjonzpnbfawvreulz.supabase.co'
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY ?? 'sb_publishable_g1_PDGwiBH9rQ3whWroeJg_WUTXWzBP'
const ADMIN_EMAIL = 'miseranataco@gmail.com'
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)

const cities = ['Duitama', 'Paipa', 'Sogamoso']

type PackageConfig = {
  id?: string
  name: string
  priceCop: number
  durationMinutes: number
  songsCount: number
  musiciansCount: number
  description: string
  features: string[]
  popular: boolean
  sortOrder: number
  imagePath?: string | null
  imageUrl?: string | null
  fallbackUrl?: string | null
  localImage?: string
}

type PackageRow = {
  id: string
  name: string
  price_cop: number
  duration_minutes: number
  songs_count: number
  musicians_count: number
  description: string
  features: string[]
  popular: boolean
  sort_order: number
  image_path: string | null
  image_url: string | null
  fallback_url: string | null
}

const defaultPackages: PackageConfig[] = [
  {
    name: 'Serenata Básica',
    priceCop: 250000,
    durationMinutes: 20,
    songsCount: 6,
    musiciansCount: 4,
    description: 'La serenata perfecta para sorprender a esa persona especial con las canciones más románticas.',
    features: ['4 músicos profesionales', '6 canciones a elegir', 'Traje típico de gala', 'Repertorio clásico mexicano'],
    popular: false,
    sortOrder: 1,
    localImage: '/images/guitar.jpg',
    fallbackUrl: 'https://placehold.co/400x300/1a1a2e/d4af37?text=Serenata+B%C3%A1sica',
  },
  {
    name: 'Serenata Estándar',
    priceCop: 320000,
    durationMinutes: 30,
    songsCount: 8,
    musiciansCount: 6,
    description: 'Una experiencia inolvidable con un grupo completo de mariachis de primer nivel.',
    features: ['6 músicos profesionales', '8 canciones a elegir', 'Traje de charro premium', 'Arreglo de rosas incluido', 'Repertorio personalizado'],
    popular: true,
    sortOrder: 2,
    localImage: '/images/mariachi-hero.jpg',
    fallbackUrl: 'https://placehold.co/400x300/1a1a2e/d4af37?text=Serenata+Est%C3%A1ndar',
  },
  {
    name: 'Gran Serenata de Lujo',
    priceCop: 380000,
    durationMinutes: 40,
    songsCount: 12,
    musiciansCount: 8,
    description: 'La experiencia más exclusiva: un espectáculo completo con el grupo de mariachis al completo.',
    features: ['8 músicos profesionales', '12 canciones a elegir', 'Traje de charro de lujo', 'Obsequio incluido', 'Arreglo de rosas premium', 'Video profesional incluido', 'MC dedicado', 'Repertorio 100% personalizado'],
    popular: false,
    sortOrder: 3,
    localImage: '/images/trumpet.jpg',
    fallbackUrl: 'https://placehold.co/400x300/1a1a2e/d4af37?text=Gran+Serenata',
  },
]

const formatCop = (value: number) => value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.')

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

function useCountUp(end: number, durationMs = 900, decimals = 0) {
  const [value, setValue] = useState(0)
  const ref = useRef<HTMLDivElement>(null)
  const started = useRef(false)

  const start = useCallback(() => {
    if (started.current) return
    started.current = true

    const startTime = performance.now()
    const step = (now: number) => {
      const progress = Math.min((now - startTime) / durationMs, 1)
      const eased = 1 - Math.pow(1 - progress, 3) // ease-out cubic
      setValue(Number((eased * end).toFixed(decimals)))
      if (progress < 1) requestAnimationFrame(step)
    }

    requestAnimationFrame(step)
  }, [decimals, durationMs, end])

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          start()
          observer.disconnect()
        }
      },
      { threshold: 0.3 },
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [start])

  return { ref, value }
}

function StatCounters() {
  const serenatas = useCountUp(500, 900, 0)
  const years = useCountUp(10, 900, 0)
  const rating = useCountUp(5, 900, 1)

  return (
    <div className="grid grid-cols-3 gap-4 sm:gap-8 mt-12 sm:mt-16 max-w-2xl mx-auto">
      <div className="text-center">
        <div ref={serenatas.ref} className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-amber-400">
          {Math.round(serenatas.value)}+
        </div>
        <div className="text-stone-400 text-xs sm:text-sm mt-1">Serenatas Realizadas</div>
      </div>
      <div className="text-center">
        <div ref={years.ref} className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-amber-400">
          {Math.round(years.value)}+
        </div>
        <div className="text-stone-400 text-xs sm:text-sm mt-1">Años de Experiencia</div>
      </div>
      <div className="text-center">
        <div ref={rating.ref} className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-amber-400">
          {rating.value.toFixed(1)}
        </div>
        <div className="text-stone-400 text-xs sm:text-sm mt-1">Calificación Promedio</div>
      </div>
    </div>
  )
}

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
  /* ---------- Supabase helpers ---------- */
  const defaultPackageByName = useMemo(() => {
    return Object.fromEntries(defaultPackages.map((p) => [p.name, p])) as Record<string, PackageConfig>
  }, [])

  const getPackageImageSrc = (pkg: PackageConfig) => {
    if (pkg.imagePath) return supabase.storage.from('package-images').getPublicUrl(pkg.imagePath).data.publicUrl
    if (pkg.imageUrl) return pkg.imageUrl
    return defaultPackageByName[pkg.name]?.localImage || '/images/mariachi-hero.jpg'
  }

  const getPackageFallback = (pkg: PackageConfig) =>
    pkg.fallbackUrl || defaultPackageByName[pkg.name]?.fallbackUrl || 'https://placehold.co/400x300/1a1a2e/d4af37?text=Miserenata'

  /* ---------- Admin mode state ---------- */
  const [adminMode, setAdminMode] = useState(false)
  const [packagesData, setPackagesData] = useState<PackageConfig[]>(defaultPackages)
  const [_packagesLoading, setPackagesLoading] = useState(true)

  const [adminEmail, setAdminEmailState] = useState(ADMIN_EMAIL)
  const [adminPassword, setAdminPassword] = useState('')
  const [adminSession, setAdminSession] = useState<Session | null>(null)
  const [adminError, setAdminError] = useState<string | null>(null)
  const [adminBusy, setAdminBusy] = useState(false)
  const [adminSaveSuccess, setAdminSaveSuccess] = useState<string | null>(null)
  const [adminPackages, setAdminPackages] = useState<PackageConfig[]>([])
  const [adminPackagesLoading, setAdminPackagesLoading] = useState(false)

  const isAdmin = adminSession?.user?.email === ADMIN_EMAIL

  const mapRowToConfig = (row: PackageRow): PackageConfig => {
    const defaults = defaultPackageByName[row.name]
    return {
      id: row.id, name: row.name, priceCop: row.price_cop,
      durationMinutes: row.duration_minutes, songsCount: row.songs_count,
      musiciansCount: row.musicians_count, description: row.description,
      features: row.features || [], popular: row.popular, sortOrder: row.sort_order,
      imagePath: row.image_path, imageUrl: row.image_url,
      fallbackUrl: row.fallback_url || defaults?.fallbackUrl || null,
      localImage: defaults?.localImage,
    }
  }

  const loadPackages = async () => {
    setPackagesLoading(true)
    try {
      const { data, error } = await supabase.from('packages').select('*').order('sort_order', { ascending: true })
      if (!error && Array.isArray(data) && data.length > 0) {
        setPackagesData((data as PackageRow[]).map(mapRowToConfig))
      } else { setPackagesData(defaultPackages) }
    } catch { setPackagesData(defaultPackages) }
    setPackagesLoading(false)
  }

  const loadAdminPackages = async () => {
    setAdminPackagesLoading(true)
    const { data, error } = await supabase.from('packages').select('*').order('sort_order', { ascending: true })
    if (!error && Array.isArray(data)) { setAdminPackages((data as PackageRow[]).map(mapRowToConfig)) }
    else { setAdminError(error?.message || 'No se pudieron cargar los paquetes') }
    setAdminPackagesLoading(false)
  }

  useEffect(() => {
    const update = () => setAdminMode(window.location.hash === '#admin')
    update()
    window.addEventListener('hashchange', update)
    return () => window.removeEventListener('hashchange', update)
  }, [])

  useEffect(() => { loadPackages() }, []) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (!adminMode) return
    let live = true
    supabase.auth.getSession().then(({ data }) => { if (live) setAdminSession(data.session) })
    const { data: sub } = supabase.auth.onAuthStateChange((_ev, s) => setAdminSession(s))
    return () => { live = false; sub.subscription.unsubscribe() }
  }, [adminMode])

  useEffect(() => {
    if (adminMode && adminSession) loadAdminPackages()
  }, [adminMode, adminSession]) // eslint-disable-line react-hooks/exhaustive-deps

  /* ---------- Admin CRUD ---------- */
  const seedPackages = async () => {
    setAdminError(null); setAdminBusy(true)
    try {
      const payload = defaultPackages.map((p) => ({
        name: p.name, price_cop: p.priceCop, duration_minutes: p.durationMinutes,
        songs_count: p.songsCount, musicians_count: p.musiciansCount,
        description: p.description, features: p.features, popular: p.popular,
        sort_order: p.sortOrder, image_path: null, image_url: null, fallback_url: p.fallbackUrl ?? null,
      }))
      const { error } = await supabase.from('packages').insert(payload)
      if (error) throw error
      await loadAdminPackages(); await loadPackages()
      setAdminSaveSuccess('Paquetes iniciales creados'); setTimeout(() => setAdminSaveSuccess(null), 3000)
    } catch (err: unknown) { setAdminError(err instanceof Error ? err.message : 'Error creando paquetes') }
    finally { setAdminBusy(false) }
  }

  const updateAdminPkg = (id: string | undefined, partial: Partial<PackageConfig>) => {
    if (!id) return
    setAdminPackages((prev) => prev.map((p) => (p.id !== id ? p : { ...p, ...partial })))
  }

  const saveAdminPkg = async (pkg: PackageConfig) => {
    if (!pkg.id) return
    setAdminError(null); setAdminBusy(true)
    try {
      const { error } = await supabase.from('packages').update({
        name: pkg.name, price_cop: pkg.priceCop, duration_minutes: pkg.durationMinutes,
        songs_count: pkg.songsCount, musicians_count: pkg.musiciansCount,
        description: pkg.description, features: pkg.features, popular: pkg.popular,
        sort_order: pkg.sortOrder, image_path: pkg.imagePath ?? null,
        image_url: pkg.imageUrl ?? null, fallback_url: pkg.fallbackUrl ?? null,
      }).eq('id', pkg.id)
      if (error) throw error
      await loadAdminPackages(); await loadPackages()
      setAdminSaveSuccess(`"${pkg.name}" guardado`); setTimeout(() => setAdminSaveSuccess(null), 3000)
    } catch (err: unknown) { setAdminError(err instanceof Error ? err.message : 'Error guardando') }
    finally { setAdminBusy(false) }
  }

  const uploadPackageImage = async (pkg: PackageConfig, file: File) => {
    if (!pkg.id) return
    setAdminError(null); setAdminBusy(true)
    try {
      const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_')
      const path = `packages/${pkg.id}/${Date.now()}-${safeName}`
      const { error: ue } = await supabase.storage.from('package-images').upload(path, file, { upsert: true })
      if (ue) throw ue
      const { error: de } = await supabase.from('packages').update({ image_path: path }).eq('id', pkg.id)
      if (de) throw de
      await loadAdminPackages(); await loadPackages()
      setAdminSaveSuccess('Imagen subida'); setTimeout(() => setAdminSaveSuccess(null), 3000)
    } catch (err: unknown) { setAdminError(err instanceof Error ? err.message : 'Error subiendo imagen') }
    finally { setAdminBusy(false) }
  }

  const adminLogin = async (e: React.FormEvent) => {
    e.preventDefault(); setAdminError(null); setAdminBusy(true)
    try {
      const { error } = await supabase.auth.signInWithPassword({ email: adminEmail.trim(), password: adminPassword })
      if (error) throw error
      setAdminPassword('')
    } catch (err: unknown) { setAdminError(err instanceof Error ? err.message : 'Error de login') }
    finally { setAdminBusy(false) }
  }

  const adminLogout = async () => { setAdminBusy(true); await supabase.auth.signOut(); setAdminBusy(false) }
  const exitAdmin = () => { window.location.hash = ''; setAdminMode(false) }

  /* ---------- Public booking state ---------- */
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [checkoutPackage, setCheckoutPackage] = useState<PackageConfig | null>(null)
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
    setSelectedExtras(prev => prev.includes(id) ? prev.filter(e => e !== id) : [...prev, id])
  }

  const openCheckout = (pkg: PackageConfig) => {
    setCheckoutPackage(pkg)
    setSelectedExtras([])
    setBookingSubmitted(false)
    document.body.style.overflow = 'hidden'
  }

  const closeCheckout = () => {
    setCheckoutPackage(null)
    document.body.style.overflow = ''
  }

  const handleBooking = (e: React.FormEvent) => {
    e.preventDefault()
    if (!checkoutPackage) return
    const extrasText = selectedExtras.length > 0
      ? selectedExtras.map(id => {
          const extra = extras.find(e => e.id === id)
          return extra ? `${extra.icon} ${extra.name} ($${extra.price})` : ''
        }).join(', ')
      : 'Ninguno'

    const whatsappMessage = `🎺 *Nueva Reserva de Serenata*%0A%0A` +
      `👤 *Nombre:* ${name}%0A` +
      `📱 *Teléfono:* ${phone}%0A` +
      `🎶 *Paquete:* ${checkoutPackage.name}%0A` +
      `🎁 *Adicionales:* ${extrasText}%0A` +
      `📍 *Ciudad:* ${selectedCity}%0A` +
      `📅 *Fecha:* ${selectedDate}%0A` +
      `🕐 *Hora:* ${selectedTime}%0A` +
      `🏠 *Dirección:* ${address}%0A` +
      `💬 *Mensaje:* ${message || 'Sin mensaje adicional'}`

    window.open(`https://wa.link/wrc5mf?text=${whatsappMessage}`, '_blank')
    setBookingSubmitted(true)
    setTimeout(() => { setBookingSubmitted(false); closeCheckout() }, 4000)
  }

  const scrollToSection = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
    setMobileMenuOpen(false)
  }

  const today = new Date().toISOString().split('T')[0]

  /* ===================== ADMIN PANEL ===================== */
  if (adminMode) {
    return (
      <div className="min-h-screen bg-stone-950 text-white font-sans">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="flex items-center justify-between gap-4 mb-8">
            <div>
              <div className="text-sm text-stone-400">Panel de Administrador</div>
              <div className="text-2xl font-extrabold bg-gradient-to-r from-amber-400 to-yellow-200 bg-clip-text text-transparent">Miserenata.co</div>
            </div>
            <div className="flex items-center gap-3">
              <button onClick={exitAdmin} className="border border-stone-700 text-stone-300 hover:text-white hover:border-stone-500 px-4 py-2 rounded-xl text-sm font-semibold transition-all">Volver al sitio</button>
              {adminSession && <button onClick={adminLogout} className="bg-stone-800 hover:bg-stone-700 border border-stone-700 px-4 py-2 rounded-xl text-sm font-semibold transition-all" disabled={adminBusy}>Cerrar sesión</button>}
            </div>
          </div>

          {adminSaveSuccess && <div className="mb-6 bg-green-500/10 border border-green-500/30 text-green-200 rounded-2xl p-4 flex items-center gap-2"><CheckCircle className="w-5 h-5 text-green-400" />{adminSaveSuccess}</div>}
          {adminError && <div className="mb-6 bg-red-500/10 border border-red-500/30 text-red-200 rounded-2xl p-4">{adminError}</div>}

          {!adminSession ? (
            <form onSubmit={adminLogin} className="bg-gradient-to-b from-stone-800/70 to-stone-900/90 border border-amber-900/30 rounded-3xl p-6 sm:p-10 space-y-5 max-w-md mx-auto">
              <h3 className="text-xl font-bold text-center mb-2">Iniciar Sesión</h3>
              <div>
                <label className="block text-sm font-medium text-amber-300 mb-2">Email</label>
                <input type="email" required value={adminEmail} onChange={(e) => setAdminEmailState(e.target.value)} className="w-full bg-stone-800/80 border border-stone-700 rounded-xl px-4 py-3 text-white placeholder-stone-500 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500/50 transition-all" />
              </div>
              <div>
                <label className="block text-sm font-medium text-amber-300 mb-2">Contraseña</label>
                <input type="password" required value={adminPassword} onChange={(e) => setAdminPassword(e.target.value)} className="w-full bg-stone-800/80 border border-stone-700 rounded-xl px-4 py-3 text-white placeholder-stone-500 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500/50 transition-all" />
              </div>
              <button type="submit" disabled={adminBusy} className="w-full bg-gradient-to-r from-amber-500 to-amber-600 text-stone-950 py-3 rounded-xl font-bold hover:from-amber-400 hover:to-amber-500 transition-all disabled:opacity-50">{adminBusy ? 'Entrando...' : 'Entrar'}</button>
            </form>
          ) : !isAdmin ? (
            <div className="bg-stone-900 border border-stone-800 rounded-3xl p-8 text-center max-w-md mx-auto">
              <p className="text-stone-300">Sesión iniciada como:</p>
              <p className="font-bold text-white mt-1">{adminSession.user.email}</p>
              <p className="text-stone-500 mt-4">Este usuario no tiene permisos de admin.</p>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="bg-stone-900/60 border border-stone-800 rounded-2xl p-5">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div className="text-sm text-stone-400">Conectado como: {adminSession.user.email}</div>
                  <div className="flex items-center gap-3">
                    <button onClick={loadAdminPackages} disabled={adminBusy || adminPackagesLoading} className="bg-stone-800 hover:bg-stone-700 border border-stone-700 px-4 py-2 rounded-xl text-sm font-semibold transition-all">Recargar</button>
                    {adminPackages.length === 0 && !adminPackagesLoading && <button onClick={seedPackages} disabled={adminBusy} className="bg-gradient-to-r from-amber-500 to-amber-600 text-stone-950 px-4 py-2 rounded-xl text-sm font-bold hover:from-amber-400 hover:to-amber-500 transition-all">Crear paquetes iniciales</button>}
                  </div>
                </div>
              </div>

              {adminPackagesLoading ? (
                <div className="text-center text-stone-400 py-10">Cargando paquetes...</div>
              ) : adminPackages.length === 0 ? (
                <div className="bg-stone-900 border border-stone-800 rounded-2xl p-8 text-center text-stone-300">No hay paquetes en la base de datos. Usa &quot;Crear paquetes iniciales&quot; para empezar.</div>
              ) : (
                <div className="space-y-6">
                  {adminPackages.map((pkg) => (
                    <div key={pkg.id} className="bg-gradient-to-b from-stone-800/70 to-stone-900/90 border border-stone-800 rounded-3xl p-6">
                      <div className="flex flex-col lg:flex-row gap-6">
                        <div className="w-full lg:w-56 flex-shrink-0">
                          <div className="rounded-2xl overflow-hidden border border-stone-700 bg-stone-900">
                            <ImageWithFallback src={getPackageImageSrc(pkg)} fallback={getPackageFallback(pkg)} alt={pkg.name} className="w-full h-40 object-cover" />
                          </div>
                          <div className="mt-3">
                            <label className="block text-xs font-medium text-stone-400 mb-1">Subir imagen</label>
                            <input type="file" accept="image/*" className="block w-full text-sm text-stone-300 file:bg-stone-800 file:border file:border-stone-700 file:text-stone-200 file:px-3 file:py-2 file:rounded-lg file:mr-3 file:cursor-pointer" onChange={(e) => { const f = e.target.files?.[0]; if (f) void uploadPackageImage(pkg, f) }} />
                          </div>
                        </div>
                        <div className="flex-1 space-y-4">
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div><label className="block text-xs font-medium text-stone-400 mb-1">Nombre</label><input value={pkg.name} onChange={(e) => updateAdminPkg(pkg.id, { name: e.target.value })} className="w-full bg-stone-800/80 border border-stone-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-500 transition-all" /></div>
                            <div><label className="block text-xs font-medium text-stone-400 mb-1">Precio (COP)</label><input type="number" value={pkg.priceCop} onChange={(e) => updateAdminPkg(pkg.id, { priceCop: Number(e.target.value) })} className="w-full bg-stone-800/80 border border-stone-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-500 transition-all" /></div>
                            <div><label className="block text-xs font-medium text-stone-400 mb-1">Duración (min)</label><input type="number" value={pkg.durationMinutes} onChange={(e) => updateAdminPkg(pkg.id, { durationMinutes: Number(e.target.value) })} className="w-full bg-stone-800/80 border border-stone-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-500 transition-all" /></div>
                            <div><label className="block text-xs font-medium text-stone-400 mb-1">Canciones</label><input type="number" value={pkg.songsCount} onChange={(e) => updateAdminPkg(pkg.id, { songsCount: Number(e.target.value) })} className="w-full bg-stone-800/80 border border-stone-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-500 transition-all" /></div>
                            <div><label className="block text-xs font-medium text-stone-400 mb-1">Músicos</label><input type="number" value={pkg.musiciansCount} onChange={(e) => updateAdminPkg(pkg.id, { musiciansCount: Number(e.target.value) })} className="w-full bg-stone-800/80 border border-stone-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-500 transition-all" /></div>
                            <div><label className="block text-xs font-medium text-stone-400 mb-1">Orden</label><input type="number" value={pkg.sortOrder} onChange={(e) => updateAdminPkg(pkg.id, { sortOrder: Number(e.target.value) })} className="w-full bg-stone-800/80 border border-stone-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-500 transition-all" /></div>
                          </div>
                          <div><label className="block text-xs font-medium text-stone-400 mb-1">Descripción</label><textarea rows={2} value={pkg.description} onChange={(e) => updateAdminPkg(pkg.id, { description: e.target.value })} className="w-full bg-stone-800/80 border border-stone-700 rounded-xl px-3 py-2 text-white resize-none focus:outline-none focus:border-amber-500 transition-all" /></div>
                          <div><label className="block text-xs font-medium text-stone-400 mb-1">Features (una por línea)</label><textarea rows={5} value={pkg.features.join('\n')} onChange={(e) => updateAdminPkg(pkg.id, { features: e.target.value.split('\n').map(s => s.trim()).filter(Boolean) })} className="w-full bg-stone-800/80 border border-stone-700 rounded-xl px-3 py-2 text-white resize-none focus:outline-none focus:border-amber-500 transition-all" /></div>
                          <label className="inline-flex items-center gap-2 text-sm text-stone-300 cursor-pointer"><input type="checkbox" checked={pkg.popular} onChange={(e) => updateAdminPkg(pkg.id, { popular: e.target.checked })} className="accent-amber-500 w-4 h-4" />Marcar como &quot;Más Popular&quot;</label>
                          <div className="flex gap-3 pt-2"><button onClick={() => void saveAdminPkg(pkg)} disabled={adminBusy} className="bg-gradient-to-r from-amber-500 to-amber-600 text-stone-950 px-6 py-2.5 rounded-xl font-bold hover:from-amber-400 hover:to-amber-500 transition-all disabled:opacity-50">{adminBusy ? 'Guardando...' : 'Guardar'}</button></div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    )
  }

  /* ===================== PUBLIC SITE ===================== */
  return (
    <div className="min-h-screen bg-stone-950 text-white font-sans">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-stone-950/90 backdrop-blur-md border-b border-amber-900/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-20">
            <div className="cursor-pointer" onClick={() => scrollToSection('hero')}>
              <img src="/images/logo.png" alt="Miserenata.co" className="h-12 sm:h-16 w-auto" />
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-8">
              <button onClick={() => scrollToSection('servicios')} className="text-stone-300 hover:text-amber-400 transition-colors font-medium">Servicios</button>
              <button onClick={() => scrollToSection('testimonios')} className="text-stone-300 hover:text-amber-400 transition-colors font-medium">Testimonios</button>
              <button onClick={() => scrollToSection('contacto')} className="text-stone-300 hover:text-amber-400 transition-colors font-medium">Contacto</button>
              <button
                onClick={() => scrollToSection('servicios')}
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
              <button onClick={() => scrollToSection('testimonios')} className="text-stone-300 hover:text-amber-400 transition-colors font-medium text-lg">Testimonios</button>
              <button onClick={() => scrollToSection('contacto')} className="text-stone-300 hover:text-amber-400 transition-colors font-medium text-lg">Contacto</button>
              <button
                onClick={() => scrollToSection('servicios')}
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
              onClick={() => scrollToSection('servicios')}
              className="bg-gradient-to-r from-amber-500 to-amber-600 text-stone-950 px-8 sm:px-10 py-4 rounded-full font-bold text-lg hover:from-amber-400 hover:to-amber-500 transition-all shadow-2xl shadow-amber-500/30 flex items-center gap-2 w-full sm:w-auto justify-center"
            >
              <Calendar className="w-5 h-5" />
              Reservar Serenata
            </button>
            <a
              href="https://wa.link/wrc5mf"
              target="_blank"
              rel="noopener noreferrer"
              className="border-2 border-amber-500/50 text-amber-400 px-8 sm:px-10 py-4 rounded-full font-bold text-lg hover:bg-amber-500/10 transition-all flex items-center gap-2 w-full sm:w-auto justify-center"
            >
              <MessageCircle className="w-5 h-5" />
              WhatsApp
            </a>
          </div>

          {/* Stats */}
          <StatCounters />
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <ChevronDown className="w-8 h-8 text-amber-400/60" />
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
            {packagesData.map((pkg) => (
              <div
                key={pkg.id || pkg.name}
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
                    src={getPackageImageSrc(pkg)}
                    fallback={getPackageFallback(pkg)}
                    alt={pkg.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                  />
                  <div className="absolute top-0 left-0 right-0 h-48 bg-gradient-to-b from-transparent to-stone-900/80"></div>
                </div>

                <div className="p-6 sm:p-8 flex flex-col flex-1">
                  <h3 className="text-xl sm:text-2xl font-bold text-white mb-2">{pkg.name}</h3>
                  <p className="text-stone-400 text-sm mb-4">{pkg.description}</p>

                  <div className="flex items-baseline gap-1 mb-6">
                    <span className="text-3xl sm:text-4xl font-extrabold text-amber-400">${formatCop(pkg.priceCop)}</span>
                    <span className="text-stone-500 text-sm">COP</span>
                  </div>

                  <div className="flex flex-wrap gap-3 mb-6">
                    <span className="flex items-center gap-1 text-xs text-stone-400 bg-stone-800 rounded-full px-3 py-1.5">
                      <Clock className="w-3 h-3 text-amber-400" /> {pkg.durationMinutes} min
                    </span>
                    <span className="flex items-center gap-1 text-xs text-stone-400 bg-stone-800 rounded-full px-3 py-1.5">
                      <Music className="w-3 h-3 text-amber-400" /> {pkg.songsCount} canciones
                    </span>
                    <span className="flex items-center gap-1 text-xs text-stone-400 bg-stone-800 rounded-full px-3 py-1.5">
                      <Users className="w-3 h-3 text-amber-400" /> {pkg.musiciansCount} músicos
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
                    onClick={() => openCheckout(pkg)}
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

      {/* Checkout Modal */}
      {checkoutPackage && (
        <div className="fixed inset-0 z-[60] flex items-start justify-center overflow-y-auto" onClick={(e) => { if (e.target === e.currentTarget) closeCheckout() }}>
          <div className="absolute inset-0 bg-stone-950/80 backdrop-blur-sm" />
          <div className="relative z-10 w-full max-w-2xl mx-4 my-8 sm:my-12">
            {/* Close button */}
            <button onClick={closeCheckout} className="absolute -top-3 -right-3 sm:top-0 sm:right-0 z-20 bg-stone-800 hover:bg-stone-700 border border-stone-600 rounded-full w-10 h-10 flex items-center justify-center text-stone-300 hover:text-white transition-all shadow-lg">
              <X className="w-5 h-5" />
            </button>

            {bookingSubmitted ? (
              <div className="bg-gradient-to-b from-amber-900/30 to-stone-900 border border-amber-500/40 rounded-3xl p-10 sm:p-14 text-center">
                <CheckCircle className="w-16 h-16 text-amber-400 mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-white mb-2">¡Reserva Enviada!</h3>
                <p className="text-stone-400 text-lg">Te contactaremos por WhatsApp para confirmar todos los detalles.</p>
              </div>
            ) : (
              <form onSubmit={handleBooking} className="bg-gradient-to-b from-stone-800/95 to-stone-900/98 border border-amber-900/30 rounded-3xl p-6 sm:p-8 space-y-5 backdrop-blur-md shadow-2xl">
                {/* Selected package summary */}
                <div className="flex items-center gap-4 bg-amber-500/10 border border-amber-500/30 rounded-2xl p-4">
                  <div className="w-16 h-16 rounded-xl overflow-hidden flex-shrink-0 border border-stone-700">
                    <ImageWithFallback src={getPackageImageSrc(checkoutPackage)} fallback={getPackageFallback(checkoutPackage)} alt={checkoutPackage.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-white text-lg truncate">{checkoutPackage.name}</h3>
                    <div className="flex items-center gap-3 text-sm text-stone-400">
                      <span className="flex items-center gap-1"><Clock className="w-3 h-3 text-amber-400" />{checkoutPackage.durationMinutes} min</span>
                      <span className="flex items-center gap-1"><Music className="w-3 h-3 text-amber-400" />{checkoutPackage.songsCount} canciones</span>
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <div className="text-xl font-extrabold text-amber-400">${formatCop(checkoutPackage.priceCop)}</div>
                    <div className="text-xs text-stone-500">COP</div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-amber-300 mb-2">Nombre Completo *</label>
                    <input type="text" required value={name} onChange={(e) => setName(e.target.value)} placeholder="Tu nombre completo" className="w-full bg-stone-800/80 border border-stone-700 rounded-xl px-4 py-3 text-white placeholder-stone-500 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500/50 transition-all" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-amber-300 mb-2">Teléfono / WhatsApp *</label>
                    <input type="tel" required value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="320 411 2721" className="w-full bg-stone-800/80 border border-stone-700 rounded-xl px-4 py-3 text-white placeholder-stone-500 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500/50 transition-all" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-amber-300 mb-2">Ciudad *</label>
                    <div className="relative">
                      <select required value={selectedCity} onChange={(e) => setSelectedCity(e.target.value)} className="w-full bg-stone-800/80 border border-stone-700 rounded-xl px-4 py-3 text-white appearance-none focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500/50 transition-all cursor-pointer">
                        <option value="">Selecciona la ciudad</option>
                        {cities.map((city) => (<option key={city} value={city}>{city}</option>))}
                      </select>
                      <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-stone-500 pointer-events-none" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-amber-300 mb-2">Fecha *</label>
                    <input type="date" required min={today} value={selectedDate} onChange={(e) => setSelectedDate(e.target.value)} className="w-full bg-stone-800/80 border border-stone-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500/50 transition-all cursor-pointer" />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-sm font-medium text-amber-300 mb-2">Hora *</label>
                    <div className="relative">
                      <select required value={selectedTime} onChange={(e) => setSelectedTime(e.target.value)} className="w-full bg-stone-800/80 border border-stone-700 rounded-xl px-4 py-3 text-white appearance-none focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500/50 transition-all cursor-pointer">
                        <option value="">Selecciona la hora</option>
                        {timeSlots.map((time) => (<option key={time} value={time}>{time}</option>))}
                      </select>
                      <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-stone-500 pointer-events-none" />
                    </div>
                  </div>
                </div>

                {/* Extras */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-amber-300 mb-3">
                    <Gift className="w-4 h-4" />
                    Detalles Adicionales (Opcional)
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {extras.map((extra) => {
                      const isSelected = selectedExtras.includes(extra.id)
                      return (
                        <button key={extra.id} type="button" onClick={() => toggleExtra(extra.id)}
                          className={`flex flex-col items-center gap-1.5 p-3 rounded-xl border-2 transition-all duration-200 ${isSelected ? 'border-amber-500 bg-amber-500/10 shadow-lg shadow-amber-500/10' : 'border-stone-700 bg-stone-800/60 hover:border-amber-900/60 hover:bg-stone-800'}`}>
                          <span className="text-2xl">{extra.icon}</span>
                          <span className={`text-xs font-medium text-center leading-tight ${isSelected ? 'text-amber-300' : 'text-stone-300'}`}>{extra.name}</span>
                          <span className={`text-xs font-bold ${isSelected ? 'text-amber-400' : 'text-stone-500'}`}>+${extra.price}</span>
                          {isSelected && <CheckCircle className="w-4 h-4 text-amber-400" />}
                        </button>
                      )
                    })}
                  </div>
                </div>

                {/* Address */}
                <div>
                  <label className="block text-sm font-medium text-amber-300 mb-2">Dirección de la Serenata *</label>
                  <input type="text" required value={address} onChange={(e) => setAddress(e.target.value)} placeholder="Dirección completa donde será la serenata" className="w-full bg-stone-800/80 border border-stone-700 rounded-xl px-4 py-3 text-white placeholder-stone-500 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500/50 transition-all" />
                </div>

                {/* Message */}
                <div>
                  <label className="block text-sm font-medium text-amber-300 mb-2">Mensaje Adicional (Opcional)</label>
                  <textarea value={message} onChange={(e) => setMessage(e.target.value)} rows={2} placeholder="¿Alguna canción especial? ¿Algún detalle que debamos saber?" className="w-full bg-stone-800/80 border border-stone-700 rounded-xl px-4 py-3 text-white placeholder-stone-500 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500/50 transition-all resize-none" />
                </div>

                <button type="submit" className="w-full bg-gradient-to-r from-amber-500 to-amber-600 text-stone-950 py-4 rounded-xl font-bold text-lg hover:from-amber-400 hover:to-amber-500 transition-all shadow-2xl shadow-amber-500/20 flex items-center justify-center gap-2">
                  <Heart className="w-5 h-5" />
                  Enviar Reserva por WhatsApp
                </button>

                <p className="text-stone-500 text-xs text-center">Al enviar, serás redirigido a WhatsApp para confirmar tu reserva directamente con nuestro equipo.</p>
              </form>
            )}
          </div>
        </div>
      )}

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

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-2xl mx-auto mb-10">
            <div className="bg-stone-900 border border-stone-800 rounded-2xl p-6 hover:border-amber-900/40 transition-all">
              <Phone className="w-8 h-8 text-amber-400 mx-auto mb-3" />
              <h4 className="font-bold text-white mb-1">Teléfono</h4>
              <p className="text-stone-400 text-sm">320 411 2721</p>
            </div>
            <div className="bg-stone-900 border border-stone-800 rounded-2xl p-6 hover:border-amber-900/40 transition-all">
              <Clock className="w-8 h-8 text-amber-400 mx-auto mb-3" />
              <h4 className="font-bold text-white mb-1">Horario</h4>
              <p className="text-stone-400 text-sm">Lunes a Domingo<br />2:00 PM - 12:00 AM</p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="https://wa.link/wrc5mf"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-green-600 hover:bg-green-500 text-white px-8 py-4 rounded-full font-bold text-lg transition-all shadow-lg shadow-green-500/20 flex items-center justify-center gap-2"
            >
              <MessageCircle className="w-5 h-5" />
              Escríbenos por WhatsApp
            </a>
            <button
              onClick={() => scrollToSection('servicios')}
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
            <div>
              <img src="/images/logo.png" alt="Miserenata.co" className="h-12 w-auto" />
            </div>
            <div className="flex items-center gap-6 text-stone-500 text-sm">
              <span className="flex items-center gap-1"><Phone className="w-3 h-3" /> 320 411 2721</span>
            </div>
            <p className="text-stone-600 text-sm">
              © 2026 Miserenata.co. Todos los derechos reservados.
            </p>
          </div>
        </div>
      </footer>

      {/* Floating WhatsApp Button */}
      <a
        href="https://wa.link/wrc5mf"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-50 bg-white hover:bg-stone-100 w-14 h-14 sm:w-16 sm:h-16 rounded-full border border-green-500/30 shadow-2xl shadow-green-500/20 flex items-center justify-center transition-all hover:scale-110"
        title="Chat por WhatsApp"
      >
        <img
          src="/images/whatsapp-logo.png"
          alt="WhatsApp"
          className="w-7 h-7 sm:w-8 sm:h-8"
        />
      </a>
    </div>
  )
}

export default App
