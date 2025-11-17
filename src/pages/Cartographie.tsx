import { useState, useEffect } from 'react'
import { MapContainer, TileLayer, GeoJSON } from 'react-leaflet'
import L from 'leaflet'
import { Bot, X, Send } from 'lucide-react'
import 'leaflet/dist/leaflet.css'
import './Cartographie.css'

// Fix for Leaflet default icon issue - moved inside component
if (typeof window !== 'undefined') {
  delete (L.Icon.Default.prototype as any)._getIconUrl
  L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
  })
}

// Mock GeoJSON data for Madagascar regions
const madagascarRegions = {
  type: 'FeatureCollection',
  features: [
    {
      type: 'Feature',
      properties: { name: 'Antananarivo', color: '#4caf50' },
      geometry: {
        type: 'Polygon',
        coordinates: [[[47.5, -18.9], [47.6, -18.9], [47.6, -19.0], [47.5, -19.0], [47.5, -18.9]]]
      }
    }
  ]
}

function Cartographie() {
  const [mounted, setMounted] = useState(false)
  
  useEffect(() => {
    setMounted(true)
    // Fix for Leaflet default icon issue
    if (typeof window !== 'undefined' && L) {
      delete (L.Icon.Default.prototype as any)._getIconUrl
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
        iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
      })
    }
  }, [])

  const [chatOpen, setChatOpen] = useState(true)
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'assistant',
      text: "Bonjour, bienvenu(e) Mr Faneva, en quoi puis-je vous aider aujourd'hui ?"
    },
    {
      id: 2,
      type: 'user',
      text: 'Je veux obtenir un rapport sur les doléances récentes de Fianarantsoa.'
    },
    {
      id: 3,
      type: 'assistant',
      text: 'Bien sûr ! Je peux vous générer un résumé thématique ou un rapport détaillé avec cartes et statistiques. Que souhaitez-vous recevoir ?'
    },
    {
      id: 4,
      type: 'user',
      text: 'Résumé thématique.'
    },
    {
      id: 5,
      type: 'assistant',
      text: 'Reflexion... Lorem ipsum dolor sit ...'
    }
  ])
  const [inputMessage, setInputMessage] = useState('')

  const handleSendMessage = () => {
    if (inputMessage.trim()) {
      setMessages([...messages, { id: messages.length + 1, type: 'user', text: inputMessage }])
      setInputMessage('')
    }
  }

  return (
    <div className="cartographie-page">
      <div className="page-header">
        <h1 className="page-title">
          Cartographie des doléances
          <span className="title-underline"></span>
        </h1>
        <p className="page-description">
          dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's st
        </p>
      </div>

      <div className="search-bar">
        <div className="search-input-wrapper">
          <input
            type="text"
            placeholder="Zone intervention"
            className="search-input"
            defaultValue="Fianarantsoa"
          />
        </div>
        <div className="commune-dropdown">
          <span>Commune</span>
          <span className="dropdown-arrow">▼</span>
        </div>
      </div>

      <div className="cartographie-content">
        <div className="layers-panel">
          <h2 className="panel-title">Couches</h2>
          <button className="import-btn">Import données</button>
          
          <div className="themes-section">
            <div className="themes-header">
              <h3 className="themes-title">Thématiques</h3>
              <span className="expand-icon">▲</span>
            </div>
            <div className="checkbox-group">
              <label className="checkbox-label">
                <input type="checkbox" />
                <span>Points lié à l'eau</span>
              </label>
              <label className="checkbox-label">
                <input type="checkbox" />
                <span>Educations</span>
              </label>
            </div>
          </div>
        </div>

        <div className="map-container">
          {mounted ? (
            <MapContainer
              center={[-18.8792, 47.5079]}
              zoom={6}
              style={{ height: '100%', width: '100%' }}
            >
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              />
              <GeoJSON data={madagascarRegions as any} />
            </MapContainer>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
              <p>Chargement de la carte...</p>
            </div>
          )}
        </div>

        <div className="commune-panel">
          <div className="commune-header">
            <h2>Commune de Fianarantsoa</h2>
            <p className="last-update">dern. màj: 04/11/2025</p>
          </div>

          <div className="rag-status">
            <h3>Statut général (RAG)</h3>
            <div className="rag-indicators">
              <div className="rag-item">
                <div className="rag-circle red"></div>
                <span>Critique</span>
              </div>
              <div className="rag-item active">
                <div className="rag-circle orange"></div>
                <span>Modérée</span>
              </div>
              <div className="rag-item">
                <div className="rag-circle green"></div>
                <span>Stable</span>
              </div>
            </div>
          </div>

          <div className="summary-section">
            <h3>Résumé doléances</h3>
            <p>
              Au cours des quatre dernières semaines, 87 doléances ont été recensées par les agents de terrain.
            </p>
            <p>Les besoins prioritaires concernent:</p>
            <ul>
              <li>L'eau (pénuries récurrentes dans 3 fokontany)</li>
              <li>La santé (centres de soins sous-équipés)</li>
              <li>L'éducation (salles de classe inachevées, manque d'enseignants)</li>
            </ul>
            <p>
              Les habitants expriment une inquiétude croissante quant à la lenteur des interventions locales.
            </p>
            <p>
              Les messages collectés font état d'un sentiment général de frustration, mais aussi d'un fort engagement communautaire pour trouver des solutions locales.
            </p>
          </div>

          <div className="rag-synthesis">
            <h3>Synthèse RAG</h3>
            <div className="synthesis-item">
              <div className="synthesis-dot red"></div>
              <span>Points liés à l'eau: 24 doléances actives, 8 infrastructures...</span>
            </div>
            <div className="synthesis-item">
              <div className="synthesis-dot orange"></div>
              <span>Santé: 18 doléances actives, 5 infrastructures...</span>
            </div>
            <div className="synthesis-item">
              <div className="synthesis-dot green"></div>
              <span>Educations: 12 doléances actives, 4 infrastructures...</span>
            </div>
            <div className="synthesis-item">
              <div className="synthesis-dot green"></div>
              <span>Autres: 6 doléances actives, 8 infrastructures...</span>
            </div>
          </div>

          <div className="statistics-section">
            <h3>Statistiques</h3>
            <div className="stat-item">
              <span>Nombre total de doléances: 87</span>
            </div>
            <div className="stat-item">
              <span>Taux de doléances urgentes: 46%</span>
            </div>
            <div className="stat-item">
              <span>Taux de résolution: 32%</span>
            </div>
            <div className="stat-item">
              <span>Délai moyen de traitement: 11 jours</span>
            </div>
            <div className="stat-item">
              <span>Tendance générale: +18% de doléances par rapport au mois précédent</span>
            </div>
          </div>

          <div className="analysis-section">
            <h3>Analyse</h3>
            <p>
              Une corrélation forte a été détectée entre la baisse d'accès à l'eau et l'augmentation des plaintes sanitaires (maladies hydriques).
            </p>
            <p>
              Une action prioritaire sur l'approvisionnement en eau pourrait réduire 40% des doléances globales.
            </p>
          </div>
        </div>
      </div>

      {chatOpen && (
        <div className="chat-panel">
          <div className="chat-header">
            <div className="chat-header-left">
              <Bot size={20} />
              <span>AI Chat Assistant</span>
            </div>
            <span className="chat-status">En ligne</span>
            <button className="close-chat" onClick={() => setChatOpen(false)}>
              <X size={18} />
            </button>
          </div>
          <div className="chat-messages">
            {messages.map((msg) => (
              <div key={msg.id} className={`chat-message ${msg.type}`}>
                <div className="message-avatar">
                  {msg.type === 'assistant' ? <Bot size={16} /> : <span>F</span>}
                </div>
                <div className="message-content">{msg.text}</div>
              </div>
            ))}
          </div>
          <div className="chat-input-wrapper">
            <input
              type="text"
              placeholder="Ecrire un message..."
              className="chat-input"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
            />
            <button className="send-btn" onClick={handleSendMessage}>
              <Send size={18} />
            </button>
          </div>
        </div>
      )}

      {!chatOpen && (
        <button className="chat-toggle-btn" onClick={() => setChatOpen(true)}>
          <Bot size={24} />
        </button>
      )}
    </div>
  )
}

export default Cartographie

