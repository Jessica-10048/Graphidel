// App.jsx
import { Route, Routes } from "react-router";
// Importation de style
import '../css/bootstrap.css'
import '../css/style.css'
import '../js/bootstrap.bundle'

import Layout from "./components/Layout/Layout";
import PrivateRoute from "./utils/helpers/PrivateRoute";
import PublicRoute from "./utils/helpers/PublicRoute"; // <-- fix double slash
import PrivateRouterAdmin from "./utils/helpers/PrivateRouterAdmin";

// Pages publiques
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

// Admin
import Dashboard from "./pages/Admin/Dashboard";
import AddProduct from "./pages/Admin/product/AddProduct";
import ProductList from "./pages/Admin/product/ProductList";
import EditProduct from "./pages/Admin/product/EditProduct";
import AdminOrders from "./pages/Admin/AdminOrders";
import AdminNewsletter from "./pages/Admin/newsletter/AdminNewsletter";
import AdminNewsletterAdd from "./pages/Admin/newsletter/AdminNewsletterAdd";
import AdminNewsletterEdit from "./pages/Admin/newsletter/AdminNewsletterEdit";
import AdminSubscribers from "./pages/Admin/newsletter/AdminSubscribers";
import AdminMember from "./pages/User/AdminMember";
import EditUser from "./pages/User/EditUser";

// Template (wrapper + composant)
import AdminTemplateAssetUploadWrapper from "./pages/Admin/Template/AdminTemplateAssetUploadWrapper";
import AdminTemplateAssetUpload from "./pages/Admin/Template/AdminTemplateAssetUpload";
function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        {/* Public */}
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

        {/* Public only */}
        <Route element={<PublicRoute />}>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Route>

        {/* Private */}
        <Route element={<PrivateRoute />}>
          <Route path="/account" element={<Account />} />
          <Route path="/favourites" element={<Favourites />} />
        </Route>

        {/* Admin */}
        <Route element={<PrivateRouterAdmin />}>
          <Route path="/admin/dashboard" element={<Dashboard />} />
          {/* product */}
          <Route path="/admin/product/add" element={<AddProduct />} />
          <Route path="/admin/products" element={<ProductList />} />
          <Route path="/admin/product/edit/:id" element={<EditProduct />} />
          {/* order */}
          <Route path="/admin/orders" element={<AdminOrders />} />
          {/* newsletter */}
          <Route path="/admin/newsletter" element={<AdminNewsletter />} />
          <Route
            path="/admin/newsletter/add"
            element={<AdminNewsletterAdd />}
          />
          <Route
            path="/admin/newsletter/edit/:id"
            element={<AdminNewsletterEdit />}
          />
          <Route path="/admin/subscribers" element={<AdminSubscribers />} />
          {/* members */}
          <Route path="/admin/members" element={<AdminMember />} />
          <Route path="/admin/user/update/:id" element={<EditUser />} />

          {/* Template: upload d’assets avec param idOrSlug */}
          <Route
            path="/admin/template/:idOrSlug"
            element={<AdminTemplateAssetUploadWrapper />}
          />
          <Route
            path="/admin/template"
            element={<AdminTemplateAssetUpload />}
          />
        </Route>
      </Route>
    </Routes>
  );
}

export default App;
