import { useState } from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { Check } from 'lucide-react'
import './Indicateurs.css'

const chartData = [
  { name: 'Jan', value: 95 },
  { name: 'Fév', value: 105 },
  { name: 'Mar', value: 120 },
  { name: 'Avr', value: 115 },
  { name: 'Mai', value: 95 },
  { name: 'Juin', value: 88 },
  { name: 'Juil', value: 78 },
  { name: 'Août', value: 70 },
]

function Indicateurs() {
  const [zone, setZone] = useState('')
  const [thematique, setThematique] = useState('Education')

  return (
    <div className="indicateurs-page">
      <div className="page-header">
        <h1 className="page-title">
          Indicateurs & Performances
          <span className="title-underline"></span>
        </h1>
        <p className="page-subtitle">
          Évolution des besoins et impact des actions gouvernementales
        </p>
      </div>

      <div className="filters-section">
        <div className="filter-group">
          <label>Zone géographique</label>
          <select
            className="filter-select"
            value={zone}
            onChange={(e) => setZone(e.target.value)}
          >
            <option value="">-- Selection d'une zone --</option>
            <option value="Fianarantsoa">Fianarantsoa</option>
            <option value="Antananarivo">Antananarivo</option>
            <option value="Antsirabe">Antsirabe</option>
          </select>
        </div>
        <div className="filter-group">
          <label>Thématique</label>
          <select
            className="filter-select"
            value={thematique}
            onChange={(e) => setThematique(e.target.value)}
          >
            <option value="Education">Education</option>
            <option value="Eau">Eau</option>
            <option value="Santé">Santé</option>
          </select>
        </div>
        <button className="apply-btn">
          <Check size={18} />
          Appliquer la synthèse
        </button>
      </div>

      <div className="kpi-grid">
        <div className="kpi-card pink">
          <div className="kpi-header">
            <h3 className="kpi-title">Réduction Totale</h3>
            <span className="kpi-trend down">↘</span>
          </div>
          <div className="kpi-value">15.8%</div>
          <div className="kpi-period">Jan - Août 2024</div>
        </div>

        <div className="kpi-card green">
          <div className="kpi-header">
            <h3 className="kpi-title">Impact Eau (Projet Avril)</h3>
            <span className="kpi-trend up">↗</span>
          </div>
          <div className="kpi-value">51.7%</div>
          <div className="kpi-description">Après infrastructure hydraulique</div>
        </div>

        <div className="kpi-card green">
          <div className="kpi-header">
            <h3 className="kpi-title">Doléances Août</h3>
            <span className="kpi-icon">📁</span>
          </div>
          <div className="kpi-value">684</div>
          <div className="kpi-comparison">vs 812 en janvier</div>
        </div>

        <div className="kpi-card pink">
          <div className="kpi-header">
            <h3 className="kpi-title">Réduction Totale</h3>
            <span className="kpi-trend down">↘</span>
          </div>
          <div className="kpi-value">15.8%</div>
          <div className="kpi-period">Jan - Août 2024</div>
        </div>

        <div className="kpi-card green">
          <div className="kpi-header">
            <h3 className="kpi-title">Impact Eau (Projet Avril)</h3>
            <span className="kpi-trend up">↗</span>
          </div>
          <div className="kpi-value">51.7%</div>
          <div className="kpi-description">Après infrastructure hydraulique</div>
        </div>

        <div className="kpi-card green">
          <div className="kpi-header">
            <h3 className="kpi-title">Doléances Août</h3>
            <span className="kpi-icon">📁</span>
          </div>
          <div className="kpi-value">684</div>
          <div className="kpi-comparison">vs 812 en janvier</div>
        </div>
      </div>

      <div className="chart-section">
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis domain={[0, 120]} />
            <Tooltip />
            <Legend />
            <Bar dataKey="value" fill="#4caf50" name="Éducation" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

export default Indicateurs

