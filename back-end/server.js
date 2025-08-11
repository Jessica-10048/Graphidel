const app = require('./app');
const ENV = require('./');

// PORT 
const PORT = ENV.PORT || 8080



// LISTEN
app.listen(PORT, () => {
  console.log(`Listening at http://localhost:${PORT}`);
});