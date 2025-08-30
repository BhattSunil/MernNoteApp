import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import NotesApp from './NotesApp.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
    <NotesApp/>
  </StrictMode>,
)
