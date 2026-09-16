import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
    import './darkMode.css'

import { RouterProvider } from 'react-router'
import router from './routes/router'
createRoot(document.getElementById('root')).render(
<RouterProvider router={router}/>,
)
