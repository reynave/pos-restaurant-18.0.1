// EDIT HERE
let ssl = false;
let serverName = "localhost";
let port = "3000";

// DO NOT CHANGE THIS CODE 
var server = `http${ssl == true ? 's':''}://${serverName}:${!port ? "80":port}/`;
var api = server+"terminal/";
