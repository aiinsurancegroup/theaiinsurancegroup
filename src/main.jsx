import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import { loadGtag } from './ads'

// BEFORE React mounts, deliberately.
//
// This used to be a useEffect in App. React runs child effects before parent
// effects, so ThanksPage's fireConversion() ran before App's loadGtag() had
// defined window.gtag -- every conversion hit the "gtag is missing" guard and
// returned without firing. The tag loaded a moment later and looked perfectly
// healthy in Tag Assistant, which is why the failure read as "no conversion
// event" rather than as an error.
//
// At module scope there is no ordering left to get wrong: window.gtag exists
// before the first component renders.
loadGtag()

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
