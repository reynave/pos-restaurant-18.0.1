// EDIT HERE
let ssl = false;
let serverName = "localhost";
let port = "3000";

// DO NOT CHANGE THIS CODE 
const server = `http${ssl == true ? 's':''}://${serverName}:${!port ? "80":port}/`;
const api = server+"terminal/";
const lisence  = 'MITRALINK';
