import { useRef, useState, useEffect } from 'react'
import './Home.css'

type Attachment = {
  id: string
  name: string
  size: string
}

const INITIAL_EDITOR_CONTENT = `
  <h3 style="color:#2f9d44;margin-top:0;">Welcome to Kendimed Text Editor Text Editor!</h3>
  <p>Lorem ipsum dolor sit amet consectetur adipiscing elit ut et massa mi. Aliquam in hendrerit urna. Pellentesque sit amet sapien.</p>
  <ul>
    <li>Lorem ipsum dolor sit amet consectetur adipiscing.</li>
    <li>Lorem ipsum dolor sit amet consectetur adipiscing.</li>
    <li>Lorem ipsum dolor sit amet consectetur adipiscing.</li>
  </ul>
`

function formatBytes(bytes: number) {
  if (bytes === 0) return '0 o'
  const k = 1024
  const sizes = ['o', 'Ko', 'Mo', 'Go']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`
}

function Home() {
  const editorRef = useRef<HTMLDivElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [attachments, setAttachments] = useState<Attachment[]>([])
  const [zone, setZone] = useState('')
  const [locationStatus, setLocationStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [locationError, setLocationError] = useState('')
  const [isDragging, setIsDragging] = useState(false)
  const [editorHtml, setEditorHtml] = useState(INITIAL_EDITOR_CONTENT)

  useEffect(() => {
    if (editorRef.current) {
      editorRef.current.innerHTML = INITIAL_EDITOR_CONTENT
    }
  }, [])

  const handleFiles = (files: File[]) => {
    const next = files.map((file) => ({
      id: crypto.randomUUID(),
      name: file.name,
      size: formatBytes(file.size),
    }))
    setAttachments((prev) => [...prev, ...next])
  }

  const onFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files) return
    handleFiles(Array.from(event.target.files))
    event.target.value = ''
  }

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault()
    setIsDragging(false)
    if (event.dataTransfer.files?.length) {
      handleFiles(Array.from(event.dataTransfer.files))
    }
  }

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = () => setIsDragging(false)

  const removeAttachment = (id: string) => {
    setAttachments((prev) => prev.filter((item) => item.id !== id))
  }

  const execCommand = (command: string, value?: string) => {
    if (!editorRef.current) return
    editorRef.current.focus()
    document.execCommand(command, false, value)
    setEditorHtml(editorRef.current.innerHTML)
  }

  const handleFontSizeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const sizeMap: Record<string, string> = {
      '12': '2',
      '14': '3',
      '16': '4',
      '18': '5',
    }
    execCommand('fontSize', sizeMap[event.target.value] ?? '3')
  }

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault()
    console.log('Form submitted', { content: editorHtml, attachments })
  }

  const handleCreateLink = () => {
    const url = prompt('Entrez le lien (ex: https://example.com)')
    if (url) {
      execCommand('createLink', url)
    }
  }

  const handleReset = () => {
    setAttachments([])
    setEditorHtml(INITIAL_EDITOR_CONTENT)
    if (editorRef.current) {
      editorRef.current.innerHTML = INITIAL_EDITOR_CONTENT
      editorRef.current.focus()
    }
    setZone('')
    setLocationStatus('idle')
    setLocationError('')
  }

  const resolveZoneFromPosition = async (lat: number, lng: number) => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}`
      )
      if (!response.ok) {
        throw new Error('Réponse invalide du service de géolocalisation')
      }
      const data = await response.json()
      const display =
        data?.address?.city ||
        data?.address?.town ||
        data?.address?.village ||
        data?.address?.county ||
        data?.display_name ||
        `${lat.toFixed(4)}, ${lng.toFixed(4)}`
      setZone(display)
      setLocationStatus('success')
    } catch (error) {
      console.error(error)
      setZone(`${lat.toFixed(4)}, ${lng.toFixed(4)}`)
      setLocationStatus('error')
      setLocationError("Impossible d'obtenir la commune exacte, coordonnées utilisées.")
    }
  }

  const requestLocation = () => {
    if (!navigator.geolocation) {
      setLocationStatus('error')
      setLocationError('La géolocalisation est indisponible sur ce navigateur.')
      return
    }

    setLocationStatus('loading')
    setLocationError('')

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords
        resolveZoneFromPosition(latitude, longitude)
      },
      (error) => {
        console.error(error)
        setLocationStatus('error')
        switch (error.code) {
          case error.PERMISSION_DENIED:
            setLocationError('Permission de localisation refusée.')
            break
          case error.POSITION_UNAVAILABLE:
            setLocationError('Position indisponible.')
            break
          case error.TIMEOUT:
            setLocationError('La demande de localisation a expiré.')
            break
          default:
            setLocationError('Impossible de récupérer votre position.')
        }
      },
      { enableHighAccuracy: true, timeout: 10000 }
    )
  }

  useEffect(() => {
    requestLocation()
  }, [])

  return (
    <div className="home-page">
      <header className="page-header">
        <div>
          <h1 className="page-title">
            Prise de note de la réunion
            <span className="title-underline"></span>
          </h1>
          <p className="page-description">
            dummy text of the printing and typesetting industry. Lorem ipsum has been the industry&apos;s
          </p>
        </div>

        <div className="filters-row">
          <div className="search-input-wrapper">
            <input
              type="text"
              placeholder="Zone intervention"
              className="search-input"
              value={zone}
              onChange={(e) => setZone(e.target.value)}
            />
            <button
              type="button"
              className="gps-btn"
              onClick={requestLocation}
              disabled={locationStatus === 'loading'}
            >
              {locationStatus === 'loading' ? 'Localisation…' : 'Utiliser ma position'}
            </button>
            {locationError && <p className="location-error">{locationError}</p>}
          </div>
          <button className="select-input">
            Commune
            <span className="dropdown-arrow">▼</span>
          </button>
        </div>
      </header>

      <section className="form-section">
        <div className="form-header">
          <h2>Formulaire de saisie</h2>
        </div>

        <form className="form-body" onSubmit={handleSubmit}>
          <div className="attachments-area">
            <div className="attachments-header">
              <h3>Pièces jointes</h3>
              <button
                type="button"
                className="link-btn"
                onClick={() => fileInputRef.current?.click()}
              >
                Ajouter un fichier
              </button>
            </div>

            <div
              className={`dropzone ${isDragging ? 'dropzone--active' : ''}`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
            >
              <div className="drop-icon">📄</div>
              <p>Glissez-déposez un fichier ou cliquez pour importer une pièce jointe</p>
              <input
                ref={fileInputRef}
                type="file"
                multiple
                onChange={onFileChange}
                style={{ display: 'none' }}
              />
            </div>

            {attachments.length > 0 && (
              <ul className="attachments-list">
                {attachments.map((file) => (
                  <li key={file.id} className="attachment-chip">
                    <div>
                      <strong>{file.name}</strong>
                      <span>{file.size}</span>
                    </div>
                    <button type="button" onClick={() => removeAttachment(file.id)}>
                      ✕
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="editor-area">
            <div className="editor-toolbar">
              <div className="toolbar-group">
                <select defaultValue="14" onChange={handleFontSizeChange}>
                  <option value="12">12</option>
                  <option value="14">14</option>
                  <option value="16">16</option>
                  <option value="18">18</option>
                </select>
                <button type="button" onClick={() => execCommand('removeFormat')}>
                  T
                </button>
                <button type="button" onClick={() => execCommand('bold')}>
                  B
                </button>
                <button type="button" onClick={() => execCommand('italic')}>
                  I
                </button>
                <button type="button" onClick={() => execCommand('underline')}>
                  U
                </button>
              </div>
              <div className="toolbar-group">
                <button type="button" onClick={() => execCommand('insertUnorderedList')}>
                  •
                </button>
                <button type="button" onClick={() => execCommand('insertOrderedList')}>
                  1.
                </button>
                <button type="button" onClick={() => execCommand('outdent')}>
                  ⊖
                </button>
                <button type="button" onClick={() => execCommand('indent')}>
                  ⊕
                </button>
                <button type="button" onClick={handleCreateLink}>
                  🔗
                </button>
              </div>
            </div>

            <div
              ref={editorRef}
              className="editor-content"
              contentEditable
              suppressContentEditableWarning
              spellCheck
              onInput={() => setEditorHtml(editorRef.current?.innerHTML ?? '')}
              data-placeholder="Écrivez votre note ici..."
            ></div>
          </div>

          <div className="form-actions">
            <button type="button" className="ghost-btn" onClick={handleReset}>
              Annuler
            </button>
            <button type="submit" className="primary-btn">
              Soumettre
            </button>
          </div>
        </form>
      </section>
    </div>
  )
}

export default Home
