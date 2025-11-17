import { Link, useLocation } from 'react-router-dom'
import { Search, Bell, Globe, ChevronDown } from 'lucide-react'
import './Navigation.css'

function Navigation() {
  const location = useLocation()

  const isActive = (path: string) => location.pathname === path

  return (
    <nav className="navigation">
      <div className="nav-left">
        <Link to="/" className={isActive('/') ? 'active' : ''}>
          Accueil
        </Link>
        <Link to="/cartographie" className={isActive('/cartographie') ? 'active' : ''}>
          Cartographie
        </Link>
        <Link to="/doleances" className={isActive('/doleances') ? 'active' : ''}>
          Doléances
        </Link>
        <Link to="/indicateurs" className={isActive('/indicateurs') ? 'active' : ''}>
          Indicateurs
        </Link>
      </div>
      <div className="nav-right">
        <button className="nav-icon-btn">
          <Search size={20} />
        </button>
        <button className="nav-icon-btn notification-btn">
          <Bell size={20} />
          <span className="notification-dot"></span>
        </button>
        <div className="language-selector">
          <Globe size={18} />
          <span>FRA</span>
          <ChevronDown size={16} />
        </div>
      </div>
    </nav>
  )
}

export default Navigation

