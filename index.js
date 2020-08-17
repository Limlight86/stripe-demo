require('dotenv').config()
const express = require("express")
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

const app = express()

app.use(express.json())

const PORT = process.env.PORT || 3000

app.get('/products', async (_request, response) => {
  const products = await stripe.products.list({limit: 100});
  const prices = await stripe.prices.list({limit: 100});
  prices.data.forEach(price => {
    const theAssociatedProduct = products.data.find(product => product.id === price.product);
    theAssociatedProduct.price = price;
  });
  const cleanedUpProducts = products.data.map(product => ({
    name: product.name,
    description: product.description,
    image: product.images[0],
    category: product.metadata.category,
    currency: product.price.currency,
    price_cents: product.price.unit_amount,
  }));
  response.json(cleanedUpProducts);
});

app.listen(PORT, () =>
  console.log(`Server is up and running at port ${PORT} 🚀`)
);