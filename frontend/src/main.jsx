import React from 'react'
import ReactDOM from 'react-dom/client'
import { StarknetConfig, InjectedConnector } from '@starknet-react/core'
import App from './App.jsx'
import './index.css'

const connectors = [
  new InjectedConnector({ options: { id: 'braavos' } }),
  new InjectedConnector({ options: { id: 'argentX' } })
]

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <StarknetConfig autoConnect connectors={connectors}>
      <App />
    </StarknetConfig>
  </React.StrictMode>,
)
