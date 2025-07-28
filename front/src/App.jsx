import { Route, Routes } from 'react-router'
// Importation de style
import "../css/style.css"

import Layout from './components/Layout/Layout'

// Importation de page

import Home from './pages/pageHome/Home'
import About from './pages/pageHome/About'
import Shop from './pages/pageHome/Shop'
import Contact from './pages/pageHome/Contact'
import Account from './pages/pageHome/Account'
import Favourites from './pages/pageHome/Favourites'
import Cart from './pages/pageHome/Cart'
import Terms from './pages/pageHome/Terms'
import Privacy from './pages/pageHome/Privacy'
function App() {
    return (
    <Routes>
      <Route element={<Layout />}>
        <Route path='/' element={<Home />} />
        <Route path='/about' element={<About/>}/>
        <Route path='/shop' element={<Shop/>}/>
        <Route path='/contact' element={<Contact/>}/>
        <Route path='/account' element={<Account/>}/>
        <Route path='/favourites' element={<Favourites/>}/>
        <Route path='/cart' element={<Cart/>}/>
        <Route path='/terms' element={<Terms/>}/>
        <Route path='/privacy' element={<Privacy/>}/>
        

        

      </Route>
    </Routes>

  )
}

export default App
