const express = require('express');
const path = require('path');
const app = express();
const port = process.env.PORT || 8080;

// Serve static files (index.html, styles.css, main.js) from the src/ folder
app.use(express.static(path.join(__dirname, 'src')));

app.listen(port, () => {
  console.log(`Coffee Shop app running on port ${port}`);
});
