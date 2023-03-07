//Start express server
var express = require("express");
var app = express();
//var server = app.listen(16761)
var server = app.listen(16761)
app.use(express.static("public"));
//Parse incoming POST requests to make them useable
//app.use(express.json());
//app.use(express.urlencoded({extended: false}))

//filereading
var fs = require("fs")

console.log("Server is running");