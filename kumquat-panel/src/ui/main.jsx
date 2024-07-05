import React from 'react'
import ReactDOM from 'react-dom/client'
import Webterm from './Webterm.jsx'
// import './index.css'
let ws = new WebSocket('ws://127.0.0.1:3300/')



ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Webterm />
  </React.StrictMode>
)
