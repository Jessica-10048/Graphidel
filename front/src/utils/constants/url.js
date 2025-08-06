const URL = {
  // USER
  POST_USER_REGISTER: "http://localhost:8000/api/user/register",
  AUTH_LOGIN: "http://localhost:8000/api/user/sign",

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

  // NEWSLETTER
  POST_NEWSLETTER: "http://localhost:8000/api/newsletter/add",
  CREATE_NEWSLETTER: "http://localhost:8000/api/newsletter/create",
  GET_ALL_NEWSLETTER:"http://localhost:8000/api/newsletter/all",
  GET_NEWSLETTER: "http://localhost:8000/api/newsletter/get",
  UPDATE_NEWSLETTER: "http://localhost:8000/api/newsletter/update",
  DELETE_NEWSLETTER: "http://localhost:8000/api/newsletter/delete",

  // Subscribers
   GET_ALL_SUBSCRIBERS: "http://localhost:8000/api/newsletter/subscribers",

};
export default URL;
