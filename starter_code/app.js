require('dotenv').config()

const express = require('express');
const hbs = require('hbs');

// require spotify-web-api-node package here:
const SpotifyWebApi = require("spotify-web-api-node");


const app = express();

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));
hbs.registerPartials(__dirname + '/views/partials');

// setting the spotify-api goes here:
const spotifyApi = new SpotifyWebApi({
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET
  });
  
  
// the routes go here:


app.get('/' , function(req , res , next) {
    res.render('index');
});

app.get('/artists' , function(req , res , next) {
  spotifyApi
    .clientCredentialsGrant()
    .then(data => {
      spotifyApi.setAccessToken(data.body["access_token"]);
      spotifyApi
    .searchArtists(Object.values(req.query))
    .then(data => {
      console.log("The received data from the API: ", data.body);
      // ----> 'HERE WHAT WE WANT TO DO AFTER RECEIVING THE DATA FROM THE API'
      let datas = {
        items : data.body.artists.items,
      }
      //console.log(data.body.artists.items[0])
      res.render('artists' , datas);
    })
    .catch(err => {
      console.log("The error while searching artists occurred: ", err);
    });
    })
    .catch(error => {
      console.log("Something went wrong when retrieving an access token", error);
    });
});

app.get("/albums/:artistId", (req, res, next) => {
  spotifyApi
    .clientCredentialsGrant()
    .then(data => {
      spotifyApi.setAccessToken(data.body["access_token"]);
  spotifyApi
  .getArtistAlbums(req.params.artistId).then(
    function(data) {
      let datas = {
        albumsitems : data.body.items,
      }
      res.render('albums' , datas)
      //console.log('Artist albums', data.body);
    },
    function(err) {
      console.error(err);
    }
  );
});
});

app.get('/tracks/:albumsId', (req, res, next) => {
  spotifyApi
    .clientCredentialsGrant()
    .then(data => {
      spotifyApi.setAccessToken(data.body["access_token"]);
  spotifyApi
  .getAlbumTracks(req.params.albumsId, { limit : 5, offset : 1 })
  .then(
    function(data) {
      let datas = {
        tracksitems : data.body.items,
      }
      res.render('viewstracks' , datas)
      //console.log('Artist albums', data.body);
    },
    function(err) {
      console.error(err +' on tracks');
    }
  );
});
});

app.listen(3000, () => console.log("My Spotify project running on port 3000 🎧 🥁 🎸 🔊"));
