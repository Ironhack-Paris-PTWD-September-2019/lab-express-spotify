require('dotenv').config()

const express = require('express');
const hbs = require('hbs');
hbs.registerPartials(__dirname + '/views/partials');

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

spotifyApi
  .clientCredentialsGrant()
  .then(data => {
    spotifyApi.setAccessToken(data.body["access_token"]);
  })
  .catch(error => {
    console.log("Something went wrong when retrieving an access token", error);
  });




// the routes go here:

app.get('/', (req,res,next)=>{
  res.render("home");
})

app.get('/artists', (req,res,next)=>{

  spotifyApi
  .searchArtists(req.query.artist)
  .then(data => {
    //console.log("The received data from the API: ", data.body);
    let artists=data.body.artists.items.map(artist=>{
      return {artistName:artist.name, artistPicture:artist.images[1], artistId:artist.id}; 
    })
    res.render('artistResult', {artists});
    //res.send(data.body);
  })
  .catch(err => {
    console.log("The error while searching artists occurred: ", err);
  });

})

app.get('/albums/:artistId', (req,res,next)=>{
  spotifyApi.getArtistAlbums(req.params.artistId)
  .then(function(data) {
    console.log('Artist albums', data);
    let albums=data.body.items.map(album=>{
      return {albumName:album.name, albumImage:album.images[1], albumId:album.id}
    })
    res.render('albumResult', {albums})
    //res.send(data)
  }, function(err) {
    console.error(err);
  });
})

app.get('/albums/:albumId/tracks', (res,req,next)=>{
  
})

app.listen(3001, () => console.log("My Spotify project running on port 3001 🎧 🥁 🎸 🔊"));
