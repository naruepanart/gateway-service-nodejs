const express = require("express");
const bodyParser = require("body-parser");
const axios = require("axios");
var Queue = require("better-queue");
const app = express();
app.use(bodyParser.json());

/* var q = new Queue(
  function (input, cb) {
    const used = process.memoryUsage().heapUsed / 1024 / 1024;
    console.log(
      "gateway service1",
      input.data.id,
      `${Math.round(used * 100) / 100} MB`,
      q.getStats().total
    );

    cb(null, result);
  },
  { concurrent: 100, fifo: true }
); */

const events = [];

app.post("/events", (req, res) => {
  const event = req.body;

  /* q.push(event); */

  events.push(event);
  const used = process.memoryUsage().heapUsed / 1024 / 1024;
  console.log(
    "gateway service1",
    event.data.id,
    `${Math.round(used * 100) / 100} MB`,
    events.length
  );

  try {
    // post to post service
    axios.post("http://localhost:4000/events", event);
  } catch (error) {
    /*  console.log("post service down"); */
    console.log(error);
  }

  try {
    // gateway service2
    axios.post("http://localhost:4006/events", event);
  } catch (error) {
    console.log(error);
  }

  res.send("OK");
});

app.get("/events", (req, res) => {
  res.send(events);
});

app.listen(4005, () => {
  console.log("Listening on 4005");
});
