require('dotenv').config(); // Load environment variables from .env file
const app = require('./app'); // Import the app configured in app.js

// Server setup
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
