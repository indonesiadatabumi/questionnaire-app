require('dotenv').config()
const express = require("express");
const path = require("path");
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 20605;

const corsOptions = {
  origin: `http://${process.env.HOST}:${process.env.PORT}`,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};

app.use(cors(corsOptions));

// Serve the static files from the React app
app.use(express.static(path.join(__dirname, "build")));

// For any requests that don't match, send back index.html
app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "build", "index.html"));
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
