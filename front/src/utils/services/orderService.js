// services/orderService.js
const createOrder = async ({ products, customer, stripeSessionId }) => {
  const cleanedProducts = products.map(product => ({
    _id: product._id,
    name: product.name,
    price: product.price,
    quantity: product.quantity
  }));

  const order = await Order.create({
    products: cleanedProducts,
    customer,
    stripeSessionId,
    status: stripeSessionId ? 'paid' : 'pending'
  });

  return order;
};
