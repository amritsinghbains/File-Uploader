var http = require("http")
var https = require("https")
var express = require("express")
var fs = require('fs');
var uuid = require('node-uuid');
var path = require('path');
var formidable = require('formidable');
var app = express()
var port = process.env.PORT || 5000
var bodyParser = require('body-parser');
var app = express()
app.use(bodyParser.json({limit: '500mb'}))
app.use(bodyParser.urlencoded({
  extended: false ,
  limit: '500mb'
}))
app.use(express.static(__dirname + "/"))

app.all('*', function(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'X-Requested-With, Authorization, Content-Type');
  next();
});

var server = http.createServer(app)
server.listen(port)

console.log("Listening on %d", port);
var that = this;

app.post('/', function(req, res){
  var newUuid = uuid.v1();
  // create an incoming form object
  var form = new formidable.IncomingForm();

  // specify that we want to allow the user to upload multiple files in a single request
  form.multiples = true;

  // store all uploads in the /data directory
  form.uploadDir = path.join(__dirname, '/data');

  // every time a file has been uploaded successfully,
  // rename it to it's orignal name
  var finalName = '';
  form.on('file', function(field, file) {
    finalName = newUuid + '.' + file.name.substr(file.name.lastIndexOf('.')+1);
    fs.rename(file.path, path.join(form.uploadDir, finalName));
  });

  // log any errors that occur
  form.on('error', function(err) {
    console.log('An error has occured: \n' + err);
  });

  // once all the files have been uploaded, send a response to the client
  form.on('end', function() {
    console.log(finalName)
    res.end(finalName);
  });

  // parse the incoming request containing the form data
  form.parse(req);

});
