import { useEffect, useState } from 'react'
import './App.css'
import { checkApiHealth } from './services/api'

const navigation = [
  { id: 'inicio', icon: '⌂', label: 'Inicio' },
  { id: 'mesas', icon: '▦', label: 'Mesas' },
  { id: 'pedidos', icon: '◫', label: 'Pedidos' },
  { id: 'reservas', icon: '▣', label: 'Reservas' },
  { id: 'productos', icon: '◈', label: 'Menú y productos' },
  { id: 'clientes', icon: '♙', label: 'Clientes' },
  { id: 'cocina', icon: '♨', label: 'Cocina' },
  { id: 'reportes', icon: '▥', label: 'Reportes' },
  { id: 'configuracion', icon: '⚙', label: 'Configuración' },
]

const descriptions = {
  mesas: 'Gestiona el plano, las ubicaciones y el estado de cada mesa.',
  pedidos: 'Administra los pedidos y su avance durante el servicio.',
  reservas: 'Organiza la disponibilidad y las reservas de tus clientes.',
  productos: 'Actualiza la carta y los productos disponibles.',
  clientes: 'Consulta y registra la información de tus clientes.',
  cocina: 'Visualiza las comandas y controla las preparaciones.',
  reportes: 'Consulta ventas y métricas para tomar decisiones.',
  configuracion: 'Personaliza los datos generales del restaurante.',
}

function Dashboard({ onNavigate }) {
  return (
    <>
      <section className="hero">
        <div className="hero-copy">
          <span className="eyebrow">SISTEMA DE GESTIÓN</span>
          <h2>Todo tu restaurante, en un solo lugar.</h2>
          <p>Organiza la operación de Trattoria Bellavista con herramientas para cada etapa del servicio.</p>
          <button className="primary-button" type="button" onClick={() => onNavigate('mesas')}>Explorar las mesas <span aria-hidden="true">→</span></button>
        </div>
        <div className="hero-art" aria-hidden="true"><span>✦</span><strong>Trattoria<br/>Bellavista</strong><small>Cucina italiana</small></div>
      </section>
      <div className="section-heading"><div><span className="eyebrow">OPERACIÓN</span><h3>Accesos rápidos</h3></div><span>Selecciona un módulo para comenzar</span></div>
      <div className="quick-grid">
        {navigation.filter((item) => item.id !== 'inicio').map((item) => (
          <button className="quick-card" key={item.id} type="button" onClick={() => onNavigate(item.id)}>
            <span className="quick-icon" aria-hidden="true">{item.icon}</span><strong>{item.label}</strong><p>{descriptions[item.id]}</p><span className="quick-link">Abrir módulo →</span>
          </button>
        ))}
      </div>
    </>
  )
}

function ModulePlaceholder({ item }) {
  return <section className="placeholder"><div className="placeholder-icon" aria-hidden="true">{item.icon}</div><span className="eyebrow">MÓDULO DEL RESTAURANTE</span><h2>{item.label}</h2><p>{descriptions[item.id]}</p><div className="notice">Esta pantalla se desarrollará en su historia de usuario correspondiente. La navegación de HU-01 ya está funcionando.</div></section>
}

export default function App() {
  const [section, setSection] = useState('inicio')
  const [mobileOpen, setMobileOpen] = useState(false)
  const [api, setApi] = useState('checking')
  const current = navigation.find((item) => item.id === section) ?? navigation[0]

  useEffect(() => {
    let mounted = true
    checkApiHealth().then((ok) => { if (mounted) setApi(ok ? 'online' : 'offline') })
    return () => { mounted = false }
  }, [])

  const navigate = (id) => { setSection(id); setMobileOpen(false) }
  return (
    <div className="app-shell">
      {mobileOpen && <button className="mobile-overlay" type="button" aria-label="Cerrar menú" onClick={() => setMobileOpen(false)} />}
      <aside className={`sidebar ${mobileOpen ? 'sidebar-open' : ''}`}>
        <button className="brand" type="button" onClick={() => navigate('inicio')}><span className="brand-mark">✦</span><span><strong>Trattoria<br/>Bellavista</strong><small>RESTAURANTE ITALIANO</small></span></button>
        <div className="nav-caption">ESPACIO DE TRABAJO</div>
        <nav aria-label="Navegación principal">{navigation.map((item) => <button type="button" key={item.id} className={`nav-item ${section === item.id ? 'active' : ''}`} aria-current={section === item.id ? 'page' : undefined} onClick={() => navigate(item.id)}><span aria-hidden="true">{item.icon}</span>{item.label}</button>)}</nav>
        <div className="sidebar-bottom"><div className="mini-logo">✦</div><div><strong>Hecho para servir mejor</strong><small>Versión académica · HU-01</small></div></div>
      </aside>
      <main className="main-content">
        <header className="topbar"><div className="topbar-left"><button className="menu-button" type="button" aria-label="Abrir menú" onClick={() => setMobileOpen(true)}>☰</button><div className="breadcrumb">Administración <span>/</span> <strong>{current.label}</strong></div></div><div className="topbar-right"><span className={`api-status ${api}`} title="Estado de FastAPI"><span className="status-dot" />{api === 'online' ? 'API conectada' : api === 'checking' ? 'Comprobando API' : 'API pendiente'}</span><div className="user-avatar" aria-label="Perfil de administrador">AD</div></div></header>
        <div className="page-content"><div className="page-title"><div><span className="eyebrow">TRATTORIA BELLAVISTA</span><h1>{section === 'inicio' ? 'Bienvenido al restaurante' : current.label}</h1><p>{section === 'inicio' ? 'Tu centro de control para cada momento del servicio.' : descriptions[section]}</p></div><span className="date-label">{new Intl.DateTimeFormat('es-CO', { dateStyle: 'long' }).format(new Date())}</span></div>{section === 'inicio' ? <Dashboard onNavigate={navigate} /> : <ModulePlaceholder item={current} />}</div>
        <footer className="footer">© {new Date().getFullYear()} Trattoria Bellavista <span>Proyecto de desarrollo de software</span></footer>
      </main>
    </div>
  )
}
