const BASE_URL = "http://localhost:8000";

const URL = {
  BASE_URL, // 🆕 Ajouter cette ligne
  
  // USER
  POST_USER_REGISTER: "http://localhost:8000/api/user/register",
  AUTH_LOGIN: "http://localhost:8000/api/user/sign",
  GET_USER: "http://localhost:8000/api/user/get",
  GET_ALL_USER: "http://localhost:8000/api/user/all",
  UPDATE_USER: "http://localhost:8000/api/user/update",
  DELETE_USER: "http://localhost:8000/api/user/delete",

  // PRODUCT
  POST_PRODUCT: "http://localhost:8000/api/product/add",
  GET_ALL_PRODUCT: "http://localhost:8000/api/product/all",
  GET_PRODUCT: "http://localhost:8000/api/product/get",
  UPDATE_PRODUCT: "http://localhost:8000/api/product/update",
  DELETE_PRODUCT: "http://localhost:8000/api/product/delete",

  // ORDER
  POST_ORDER: "http://localhost:8000/api/order/add",
  GET_ALL_ORDER: "http://localhost:8000/api/order/all",
  GET_ORDER: "http://localhost:8000/api/order/get",
  UPDATE_ORDER: "http://localhost:8000/api/order/update",
  DELETE_ORDER: "http://localhost:8000/api/order/delete",

  // 🆕 PAYMENT - Ajouter ces lignes
  CREATE_CHECKOUT_SESSION: "http://localhost:8000/api/payment/create-checkout-session",
  PAYMENT_WEBHOOK: "http://localhost:8000/api/payment/webhook",
  PAYMENT_TEST: "http://localhost:8000/api/payment/test",

  // NEWSLETTER
  POST_NEWSLETTER: "http://localhost:8000/api/newsletter/add",
  CREATE_NEWSLETTER: "http://localhost:8000/api/newsletter/create",
  GET_ALL_NEWSLETTER: "http://localhost:8000/api/newsletter/all",
  GET_NEWSLETTER: "http://localhost:8000/api/newsletter/get",
  UPDATE_NEWSLETTER: "http://localhost:8000/api/newsletter/update",
  DELETE_NEWSLETTER: "http://localhost:8000/api/newsletter/delete",

  // Subscribers
  GET_ALL_SUBSCRIBERS: "http://localhost:8000/api/newsletter/subscribers",

  // ===== TEMPLATES =====
  POST_TEMPLATE: "http://localhost:8000/api/templates/add", 
  UPDATE_TEMPLATE: "http://localhost:8000/api/templates/update", 
  DELETE_TEMPLATE: "http://localhost:8000/api/templates/delete", 
  GET_ALL_TEMPLATES: "http://localhost:8000/api/templates/all",
  GET_TEMPLATE: "http://localhost:8000/api/templates/get/:id",
  
  // Assets protégés (admin)
  ADD_TEMPLATE_ASSET: "http://localhost:8000/api/templates", 
  REMOVE_TEMPLATE_ASSET: "http://localhost:8000/api/templates", 

  // Téléchargements sécurisés (client connecté)
  MY_DOWNLOADS_LIST: "http://localhost:8000/api/templates/me/downloads/list",
  DOWNLOAD_ASSET: "http://localhost:8000/api/templates/me/downloads", 
};

export default URL;