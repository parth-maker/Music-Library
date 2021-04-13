'use strict'
// use strict forces variable declaration before use

// to use the express framework, must do npm install express
const express = require('express')
const app = express()

// Install CORS to respond to requests from pages not served by this server
// requires: npm install cors
const cors = require('cors')
app.use(cors())

// Parse URL-encoded bodies (as sent by HTML forms)
app.use(express.urlencoded())

// Parse JSON bodies (as sent by API clients)
app.use(express.json())

// path module is built-in, part of basic node, no need to install
// const path = require('path')

// serve static html/css/js files, images etc..
// good old web site files
// in folder public_html
app.use(express.static('public_html'))

app.get('/tracks', (req, res) => {
const DB = require('./src/dao')
DB.connect()
DB.query('select t.id, p.title as playlist_title, t.title, uri, master_id from track t LEFT JOIN playlist p on p.id=t.playlist_id order by t.id asc',
function (tracks) {
if (tracks.rowCount > 0) {
const tracksJSON = { msg: 'OK', tracks: tracks.rows }
const tracksJSONString = JSON.stringify(tracksJSON, null, 4)
// set content type
res.writeHead(200, { 'Content-Type': 'application/json' })
// send out a string
res.end(tracksJSONString)
} else {
// set content type
const tracksJSON = { msg: 'Table empty, no tracks found' }
const tracksJSONString = JSON.stringify(tracksJSON, null, 4)
res.writeHead(404, { 'Content-Type': 'application/json' })
// send out a string
res.end(tracksJSONString)
}

DB.disconnect()
}
)
})

// SELECT 1 - GET
app.get('/tracks/:id', (req, res) => {
const id = req.params.id
const DB = require('./src/dao')
DB.connect()
DB.queryParams('SELECT * from track, playlist WHERE playlist.id=track.playlist and id=$1', [id],
function (tracks) {
if (tracks.rowCount === 1) {
const tracksJSON = { msg: 'OK', tracks: tracks.rows[0] }
const tracksJSONString = JSON.stringify(tracksJSON, null, 4)
// set content type
res.writeHead(200, { 'Content-Type': 'application/json' })
// send out a string
res.end(tracksJSONString)
} else {
// set content type
const tracksJSON = { msg: 'Track not found' }
const tracksJSONString = JSON.stringify(tracksJSON, null, 4)
res.writeHead(404, { 'Content-Type': 'application/json' })
// send out a string
res.end(tracksJSONString)
}

DB.disconnect()
}
)
})

// DELETE
app.delete('/tracks/:id', function (request, response) {
const id = request.params.id // read the :id value send in the URL
const DB = require('./src/dao')
DB.connect()

DB.queryParams('DELETE from track WHERE id=$1', [id], function (tracks) {
const tracksJSON = { msg: 'OK track deleted' }
const tracksJSONString = JSON.stringify(tracksJSON, null, 4)
// set content type
response.writeHead(200, { 'Content-Type': 'application/json' })
// send out a string
response.end(tracksJSONString)
DB.disconnect()
})
})

// INSERT - POST
app.post('/tracks',
function (request, response) {
// get the form inputs from the body of the HTTP request
console.log(request.body)
const id = request.body.id
const playlist_id = request.body.playlist_id
const title = request.body.title
const uri = request.body.uri
const master_id = request.body.master_id

const DB = require('./src/dao')
DB.connect()

DB.queryParams('INSERT INTO track VALUES ($1,$2,$3,$4,$5)',
[id, playlist_id, title, uri, master_id], function (tracks) {
const tracksJSON = { msg: 'Track added' }
const tracksJSONString = JSON.stringify(tracksJSON, null, 4)
// set content type
response.writeHead(200, { 'Content-Type': 'application/json' })
// send out a string
response.end(tracksJSONString)
DB.disconnect()
})
}
)
app.get('/playlist', function (request, response) {
const DB = require('./src/dao')
DB.connect()
DB.query('SELECT * from playlist order by id asc', function (playlist) {
const playListJSON = {
playlist: playlist.rows
}
const playListJSONString = JSON.stringify(playListJSON, null, 4)
// set content type
response.writeHead(200, {
'Content-Type': 'application/json'
})
// DB.disconnect()
// send out a string
response.end(playListJSONString)
DB.disconnect()
})
})

// go to http://localhost:3001
// listen to port 3001
app.listen(3001, function () {
console.log('server listening to port 3001')
})