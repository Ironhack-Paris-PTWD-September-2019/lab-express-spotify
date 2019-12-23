// Private API keys
require('dotenv').config()

const express = require('express');
const hbs = require('hbs');
// const SpotifyWebAPI = require('spotify-web-api-js')
const SpotifyWebApi = require("spotify-web-api-node");



const app = express();

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));


// setting the spotify-api goes here:
const spotifyApi = new SpotifyWebApi({
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET
});

// Retrieve an access token
spotifyApi
    .clientCredentialsGrant()
    .then(data => {
        spotifyApi.setAccessToken(data.body["access_token"]);
    })
    .catch(error => {
        console.log("Something went wrong when retrieving an access token", error);
    });

// the routes go here:
app.get("/", (req, res, next) => {
    res.render('homepage');
})

app.get("/artists", (req, res, next) => {
    // console.log(req.params)

    spotifyApi
        .searchArtists(`${req.query.artist}`)
        .then(data => {
            // console.log("The received data from the API: ", data.body.artists.items);
            res.render('artists', data.body.artists)
        })
        .catch(err => {
            console.log("The error while searching artists occurred: ", err);
        });

})

app.get("/albums/:artistId", (req, res, next) => {
    // let artist, albums;

    // const pArtist = spotifyApi
    //     .getArtist(req.params.artistId)
    //     .then(data => {
    //         artist = data.name
    //     })
    //     .catch(e => console.log("The error while searching the artist occurred: ", err))

    // const pAlbums = spotifyApi
    //     .getArtistAlbums(req.params.artistId)
    //     .then(data => {
    //         albums = data.items
    //     })
    //     .catch(err => console.log("The error while searching albums occurred: ", err));

    // Promise.all([pArtist, pAlbums])
    //     .then((artist, albums) => {
    //         console.log("Promesses OK")
    //         res.render('albums', { artist, albums })
    //     })

    // [ORIGINAL]
    spotifyApi
        .getArtistAlbums(req.params.artistId)
        .then(data => {
            // console.log("The received data from the API: ", data.body);
            res.render('albums', data.body)
        })
        .catch(err => {
            console.log("The error while searching albums occurred: ", err);
        });
})

app.get("/tracks/:albumId", (req, res, next) => {
    spotifyApi
        .getAlbumTracks(req.params.albumId)
        .then(data => {
            // console.log("The received data from the API: ", data.body);
            res.render('tracks', data.body)
        })
        .catch(err => {
            console.log("The error while searching tracks occurred: ", err);
        });
})


app.listen(3000, () => console.log("My Spotify project running on port 3000 🎧 🥁 🎸 🔊"));
