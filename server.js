require("dotenv").config();
const express = require("express");
const app = express();
// const spotifyRoutes = require("./routes/spotifyRoutes");

app.use(express.json());
// app.use("/spotify", spotifyRoutes);

app.get("/", (req, res) => {
  res.send("Hello, welcome to Spotify integration!");
});

app.get("/callback", (req, res) => {
  const code = req.query.code;
  res.send(`Authorization code: ${code}`);
  // Later: exchange this code for access_token
});

const PORT = process.env.PORT || 8888;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

