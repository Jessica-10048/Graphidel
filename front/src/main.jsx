import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router'
import '../css/bootstrap.css'
import './index.css'
import App from './App.jsx'
import {CartProvider} from '../src/utils/context/CartContext.jsx'
import { AuthProvider } from '../src/utils/context/AuthContext';
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <CartProvider>
          <App />
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>
)
