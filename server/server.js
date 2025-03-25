const express = require('express');
const cors = require('cors');
const spotifyWebApi = require('spotify-web-api-node');
const bodyParser = require('body-parser');
const lyricsFinder = require('lyrics-finder');

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Endpoint para refrescar el token
app.post('/refresh', (req, res) => {
    const refreshToken = req.body.refreshToken;
    const spotifyApi = new spotifyWebApi({
        clientId: '40b9a4490c9e42089719f993d97a79df',
        clientSecret: 'cdb300d96546472eb915334d8e4e9c5a',
        redirectUri: 'http://localhost:3000',
    });

    spotifyApi.setRefreshToken(refreshToken);

    spotifyApi.refreshAccessToken().then(data => {
        res.json({
            accessToken: data.body.access_token,
            expiresIn: data.body.expires_in
        });
    }).catch(err => {
        console.error("Error al refrescar el token:", err);
        res.sendStatus(400);
    });
});

// Endpoint para hacer login y obtener los tokens
app.post('/login', async (req, res) => {
    const code = req.body.code;
    const spotifyApi = new spotifyWebApi({
        clientId: '40b9a4490c9e42089719f993d97a79df',
        clientSecret: 'cdb300d96546472eb915334d8e4e9c5a',
        redirectUri: 'http://localhost:3000'
    });

    try {
        const data = await spotifyApi.authorizationCodeGrant(code);
        res.json({
            accessToken: data.body.access_token,
            refreshToken: data.body.refresh_token,
            expiresIn: data.body.expires_in
        });
    } catch (err) {
        console.error("Error en login:", err);
        res.sendStatus(400);
    }
});

// Endpoint para obtener la letra de una canción
app.get('/lyrics', async (req, res) => {
    try {
        const lyrics = await lyricsFinder(req.query.artist, req.query.track) || 'No lyrics found';
        res.json({ lyrics });
    } catch (err) {
        console.error("Error al obtener la letra:", err);
        res.sendStatus(500);
    }
});

// Endpoint para obtener canciones guardadas del usuario
app.get('/tracks', async (req, res) => {
    const accessToken = req.headers['authorization'];

    if (!accessToken) {
        return res.status(401).json({ error: "No access token provided" });
    }

    const spotifyApi = new spotifyWebApi({
        clientId: '40b9a4490c9e42089719f993d97a79df',
        clientSecret: 'cdb300d96546472eb915334d8e4e9c5a',
        redirectUri: 'http://localhost:3000'
    });

    spotifyApi.setAccessToken(accessToken);

    try {
        const data = await spotifyApi.getMySavedTracks();
        res.json(data.body.items);
    } catch (err) {
        console.error("Error al obtener canciones guardadas:", err);
        res.sendStatus(500);
    }
});

// Iniciar el servidor en el puerto 3001
app.listen(3001, () => {
    console.log("Servidor corriendo en el puerto 3001");
});
