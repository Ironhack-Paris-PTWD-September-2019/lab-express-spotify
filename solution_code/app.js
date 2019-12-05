require('dotenv').config()

const express = require('express');
const hbs = require('hbs');
const SpotifyWebApi = require("spotify-web-api-node");

// require spotify-web-api-node package here:



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
app.get('/', function (req, res, next) {
  res.render('home', {});
});

app.get('/artists', function (req, res, next) {
  spotifyApi
  .searchArtists(`${req.query.artist}`)
  .then(data => {
    console.log("The received data from the API: ", data.body);
    // ----> 'HERE WHAT WE WANT TO DO AFTER RECEIVING THE DATA FROM THE API'
    res.render('artists', {
      artists: data.body.artists.items
    });
  })
  .catch(err => {
    console.log("The error while searching artists occurred: ", err);
  });
});

app.get('/albums/:id', function (req, res, next) {
  const id = req.params.id;

  spotifyApi.getArtistAlbums(id)
    .then(function(data) {
      console.log('Artist albums', data.body.items);
      res.render('albums', {
        albums: data.body.items
      })
    }).catch(error => console.log("Error:", error));
});

app.get('/tracks/:albumid', function (req, res, next) {
  const albumid = req.params.albumid;

  spotifyApi.getAlbumTracks(albumid)
    .then(data => {
      console.log('Tracks:', data.body.items);
      res.render("tracks", {tracks: data.body.items})
    })
    .catch(error => console.log("Error:", error))
});

app.listen(3000, () => console.log("My Spotify project running on port 3000 🎧 🥁 🎸 🔊"));
