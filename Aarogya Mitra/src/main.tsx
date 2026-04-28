import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import './i18n'

import { AarogyaProvider } from './context/AarogyaContext'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AarogyaProvider>
      <App />
    </AarogyaProvider>
  </StrictMode>,
)
