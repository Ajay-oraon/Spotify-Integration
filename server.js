// index.js
const express = require("express");
const axios = require("axios");
const dotenv = require("dotenv");
const querystring = require("querystring");

dotenv.config();
const app = express();

const clientId = process.env.SPOTIFY_CLIENT_ID;
const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;
const redirectUri = process.env.SPOTIFY_REDIRECT_URI;

// Step 1: Login Route
app.get("/login", (req, res) => {
  const scope =
    "user-read-currently-playing user-read-playback-state user-top-read user-modify-playback-state";
  const authURL = `https://accounts.spotify.com/authorize?${querystring.stringify(
    {
      response_type: "code",
      client_id: clientId,
      scope: scope,
      redirect_uri: redirectUri,
    }
  )}`;
  res.redirect(authURL);
});

// Step 2: Callback Route
app.get("/callback", async (req, res) => {
  const code = req.query.code;

  const tokenResponse = await axios.post(
    "https://accounts.spotify.com/api/token",
    querystring.stringify({
      grant_type: "authorization_code",
      code: code,
      redirect_uri: redirectUri,
    }),
    {
      headers: {
        Authorization: `Basic ${Buffer.from(
          `${clientId}:${clientSecret}`
        ).toString("base64")}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
    }
  );

  const { access_token, refresh_token } = tokenResponse.data;

  res.json({
    message: "Authorization successful!",
    access_token,
    refresh_token,
  });

  // Optional: Save tokens in memory or database if needed
});

// Home route
app.get("/", (req, res) => {
  res.send("Hello, welcome to Spotify integration!");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running at port ${PORT}`));
