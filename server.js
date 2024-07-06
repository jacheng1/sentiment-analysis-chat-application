// setup server to wrap an Express application server

const cors = require("cors");
const next = require("next");
const Pusher = require("pusher");
const express = require("express");
const bodyParser = require("body-parser");
const dotenv = require("dotenv").config();
const Sentiment = require("sentiment");

const dev = process.env.NODE_ENV !== "production"; // boolean; if NODE_ENV is set to 'production', set true
const port = process.env.PORT || 3000; // set port for listening by server; default to 3000

const app = next({ dev }); // create new Next.js app with 'dev' config
const handler = app.getRequestHandler(); // create request handler for app; handles all HTTP requests
const sentiment = new Sentiment(); // create new 'Sentiment' instance

// initialize new pusher instance w/ .env credentials
const pusher = new Pusher({
  appId: process.env.PUSHER_APP_ID,
  key: process.env.PUSHER_APP_KEY,
  secret: process.env.PUSHER_APP_SECRET,
  cluster: process.env.PUSHER_APP_CLUSTER,
  encrypted: true,
});

// prepare Next.js app before handling requests
app.prepare().then(() => {
  const server = express(); // create new Express server instance

  // use middleware
  server.use(cors()); // enable CORS for server
  server.use(bodyParser.json()); // enable server to parse incoming JSON request bodies
  server.use(bodyParser.urlencoded({ extended: true })); // enable server to parse URL-encoded request bodies; 'extended' allows rich objects & arrays to be encoded into URL-encoded format

  const chatHistory = { messages: [] }; // set 'chatHistory' w/ 'messages' initialized to empty array; stores messages in memory

  // endpoint to listen to POST requests to '/message'
  server.post("/message", (request, response, next) => {
    const { user = null, message = "", timestamp = +new Date() } = request.body; // destructure props from request body
    const sentimentScore = sentiment.analyze(message).score; // calculate sentiment score of the message
    const chat = { user, message, timestamp, sentiment: sentimentScore }; // create a 'chat' object w/ fields

    chatHistory.messages.push(chat); // add new 'chat' object to 'messages' array
    pusher.trigger("chat-room", "new-message", { chat }); // trigger a 'new-message' event on 'chat-room' Pusher subscribed channel by passing 'chat' object as event data

    response.sendStatus(200); // send success response back to client
  });

  // endpoint to listen to POST requests to '/message
  server.post("/messages", (request, response, next) => {
    response.json({ ...chatHistory, status: "success" }); // respond w/ current 'chatHistory' object (all stored messages) and status 'success'
  });

  // set up route to handle get requests
  server.get("*", (request, response) => {
    return handler(request, response);
  });

  // start Express server
  server
    .listen(port, (error) => {
      // if error occurs during startup, throw it
      if (error) {
        throw error;
      }

      console.log(`> Ready on http://localhost:${port}`);
    })
    .catch((ex) => {
      console.error(ex.stack); // catch error, & log error stack to console

      process.exit(1);
    });
});
