import { useState, useMemo } from 'react'
import ReactQuill from 'react-quill'
import 'react-quill/dist/quill.snow.css'
import { Upload, X, RotateCw } from 'lucide-react'
import './Doleances.css'

function Doleances() {
  const [content, setContent] = useState(`
    <h2 style="color: #4caf50;">Welcome to Kendimed Text Editor Text Editor!</h2>
    <p>Lorem ipsum dolor sit amet consectetur adipiscing elit Ut et massa mi. Aliquam in hendrerit urna. Pellentesque sit amet sapien.</p>
    <ul>
      <li>Lorem ipsum dolor sit amet consectetur adipiscing.</li>
      <li>Lorem ipsum dolor sit amet consectetur adipiscing.</li>
      <li>Lorem ipsum dolor sit amet consectetur adipiscing.</li>
    </ul>
  `)
  const [attachments, setAttachments] = useState<File[]>([])

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setAttachments([...attachments, ...Array.from(e.target.files)])
    }
  }

  const removeAttachment = (index: number) => {
    setAttachments(attachments.filter((_, i) => i !== index))
  }

  const modules = useMemo(() => ({
    toolbar: [
      [{ 'size': ['14', '16', '18', '20'] }],
      [{ 'color': [] }, { 'background': [] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ 'align': [] }],
      [{ 'list': 'ordered' }, { 'list': 'bullet' }],
      [{ 'indent': '-1' }, { 'indent': '+1' }],
      ['link'],
    ],
  }), [])

  return (
    <div className="doleances-page">
      <div className="page-header">
        <h1 className="page-title">
          Prise de note de la réunion
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
          />
        </div>
        <div className="commune-dropdown">
          <span>Commune</span>
          <span className="dropdown-arrow">▼</span>
        </div>
      </div>

      <div className="form-container">
        <div className="form-header">
          <h2>Formulaire de saisie</h2>
        </div>

        <div className="form-content">
          <div className="attachments-section">
            <h3>Pièces jointes</h3>
            <div className="upload-area">
              <input
                type="file"
                id="file-upload"
                multiple
                onChange={handleFileUpload}
                style={{ display: 'none' }}
              />
              <label htmlFor="file-upload" className="upload-label">
                <Upload size={48} />
                <span>Importer une pièce jointe</span>
              </label>
            </div>
            {attachments.length > 0 && (
              <div className="attachments-list">
                {attachments.map((file, index) => (
                  <div key={index} className="attachment-item">
                    <span>{file.name}</span>
                    <button
                      className="remove-attachment"
                      onClick={() => removeAttachment(index)}
                    >
                      <X size={16} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="editor-section">
            <ReactQuill
              theme="snow"
              value={content}
              onChange={setContent}
              modules={modules}
              className="text-editor"
            />
          </div>

          <div className="form-actions">
            <button className="cancel-btn">Annuler</button>
            <button className="submit-btn">
              <RotateCw size={18} />
              Soumettre
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Doleances

