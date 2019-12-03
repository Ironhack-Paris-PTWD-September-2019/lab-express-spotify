require('dotenv').config()

const express = require('express');
const hbs = require('hbs');
const SpotifyWebApi = require("spotify-web-api-node");

const app = express();

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));

hbs.registerPartials(__dirname + '/views/partials');


// spotify API
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
app.get(`/`, function(req, res, next) {
  res.render(`index`, {
    hideMenu: `yes`
  });
})

app.get(`/artists`, function(req, res, next) {
  // spotify API
  spotifyApi
  .searchArtists(req.query.q)
  .then(data => {
    // collect artists
    if(data.body.artists.items[0].images.length !== 0) {
      console.log(data.body.artists.items[0])
    }
    
    res.render(`artists`, {
      artists: data.body.artists.items
    });
  })
  .catch(err => {
    console.log("The error while searching artists occurred: ", err);
  });
});

app.get("/albums/:artistId", (req, res, next) => {
  spotifyApi
  .getArtistAlbums(req.params.artistId)
  .then(
    function(data) {
      console.log('Artist albums', data.body);
      res.render(`albums`, {
        albums: data.body.items
      })
    },
    function(err) {
      console.error(err);
    }
  );
});

app.get(`/album/:albumId`, (req, res, next) => {
  spotifyApi
  .getAlbumTracks(req.params.albumId, { limit : 5, offset : 1 })
  .then(function(data) {
      console.log(data.body.items[0]);
      res.render(`album`, {
        tracks: data.body.items
      })
    }, function(err) {
      console.log('Something went wrong!', err);
    });
})

app.listen(3000, () => console.log("My Spotify project running on port 3000 🎧 🥁 🎸 🔊"));
