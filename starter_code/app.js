require('dotenv').config()

const express = require('express');
const hbs = require('hbs');

// require spotify-web-api-node package here:
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


// Retrieve artists
// spotifyApi
//   .searchArtists(req.params.artists)
//   .then(data => {
//     console.log("The received data from the API: ", data.body);
//     // ----> 'HERE WHAT WE WANT TO DO AFTER RECEIVING THE DATA FROM THE API'
//   })
//   .catch(err => {
//     console.log("The error while searching artists occurred: ", err);
//   });

// the routes go here:

app.get('/', (req, res, next) => {
  res.render("index");
})


//
// Artists //

app.get('/artists', (req, res, next) => {
  spotifyApi
  .searchArtists(req.query.search)
  .then(data => {
    console.log("The received data from the API: ", data.body);
    // ----> 'HERE WHAT WE WANT TO DO AFTER RECEIVING THE DATA FROM THE API'
    res.render("artists", {
      artists: data.body.artists.items
    }); // j'ai checké la solution pour ce qu'il y a entre {}, je n'y aurais jamais pensé hahaha trop compliqué Spotify
  })
  .catch(err => {
    console.log("The error while searching artists occurred: ", err);
  });
})


//
// Albums //

app.get("/albums/:id", (req, res, next) => {
  spotifyApi
  .getArtistAlbums(req.params.id, { limit: 10, offset: 20 })
  .then(
    function(data) {
      console.log('Album information', data.body);
      res.render("albums", {
        albums: data.body.items
      });
    },
    function(err) {
      console.error(err);
    }
  );
});

//
// Tracks //

app.get("/tracks/:albumid", (req, res, next) => {
  spotifyApi
  .getAlbumTracks(req.params.albumid, { limit : 5, offset : 1 })
  .then(function(data) {
    console.log(data.body);
    res.render("tracks", { 
      tracks: data.body.items
    })
  }, function(err) {
    console.log('Something went wrong!', err);
  });
});

app.listen(3000, () => console.log("My Spotify project running on port 3000 🎧 🥁 🎸 🔊"));
