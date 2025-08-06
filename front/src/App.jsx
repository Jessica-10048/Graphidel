import { Route, Routes } from "react-router";
// Importation de style
import "../css/style.css";
import "../js/bootstrap.bundle";
import Layout from "./components/Layout/Layout";
import PrivateRoute from "../src/utils/helpers/PrivateRoute";
import PublicRoute from "../src/utils//helpers/PublicRoute";
import PrivateRouterAdmin from "./utils/helpers/PrivateRouterAdmin";
// Importation de page

import Home from "./pages/pageHome/Home";
import About from "./pages/pageHome/About";
import Shop from "./pages/pageHome/Shop";
import Contact from "./pages/pageHome/Contact";
import Account from "./pages/pageHome/Account";
import Favourites from "./pages/pageHome/Favourites";
import Cart from "./pages/pageHome/Cart";
import Terms from "./pages/pageHome/Terms";
import Privacy from "./pages/pageHome/Privacy";
import ProductShow from "./pages/pageHome/ProductShow";
import Login from "./pages/User/Login";
import Register from "./pages/User/Register";
import Checkout from "./pages/pageHome/Checkout";
import Success from "./pages/pageHome/Success";

import Dashboard from "./pages/Admin/Dashboard";
import AddProduct from "./pages/Admin/product/AddProduct";
import ProductList from "./pages/Admin/product/ProductList";
import EditProduct from "./pages/Admin//product/EditProduct";
import AdminOrders from "./pages/Admin/AdminOrders";
import AdminNewsletter from "./pages/Admin/newsletter/AdminNewsletter";
import AdminNewsletterAdd from "./pages/Admin/newsletter/AdminNewsletterAdd";
import AdminNewsletterEdit from "./pages/Admin/newsletter/AdminNewsletterEdit";
import AdminSubscribers from "./pages/Admin/newsletter/AdminSubscribers";
function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        {/* ✅ Accessible à tout le monde */}
        <Route path="/" element={<Home />} />
        <Route path="/shop" element={<Shop />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/product/show/:id" element={<ProductShow />} />
        <Route path="/terms" element={<Terms />} />
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/success" element={<Success />} />

        {/* 👤 Publics (uniquement si NON connecté) */}
        <Route element={<PublicRoute />}>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Route>

        {/* 🔐 Privés (réservés aux utilisateurs connectés) */}
        <Route element={<PrivateRoute />}>
          <Route path="/account" element={<Account />} />
          <Route path="/favourites" element={<Favourites />} />
        </Route>

        {/* 🛡️ Admin uniquement */}
        <Route element={<PrivateRouterAdmin />}>
          <Route path="/admin/dashboard" element={<Dashboard />} />
          {/* product */}
          <Route path="/admin/product/add" element={<AddProduct />} />
          <Route path="/admin/products" element={<ProductList />} />
          <Route path="/admin/product/edit/:id" element={<EditProduct />} />
          {/* order */}
          <Route path="/admin/orders" element={<AdminOrders />} />
          {/* Newsletter */}
          <Route path="/admin/newsletter" element={<AdminNewsletter />} />
          <Route path="/admin/newsletter/add" element={<AdminNewsletterAdd />}/>
          <Route path="/admin/newsletter/edit/:id" element={<AdminNewsletterEdit />}/>
          {/* Subscribers */}
           <Route path="/admin/subscribers" element={<AdminSubscribers />} />

        </Route>
      </Route>
    </Routes>
  );
}

export default App;
