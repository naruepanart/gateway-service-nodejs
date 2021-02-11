const express = require("express");
const bodyParser = require("body-parser");
const bsonobjectID = require("bson-objectid");
const cors = require("cors");
const axios = require("axios");

const app = express();
app.use(bodyParser.json());
app.use(cors());

const posts = [];

app.get("/posts", (req, res) => {
  res.send({ postslength: posts.length, posts: posts });
});

app.post("/posts", async (req, res) => {
  const id = bsonobjectID();
  const { title } = req.body;

  const data = {
    id,
    title,
  };

  posts.push(data);

  await axios.post("http://localhost:4005/events", {
    type: "PostCreated",
    data,
  });

  res.status(201).send(data);
});

app.post("/events", (req, res) => {
  const used = process.memoryUsage().heapUsed / 1024 / 1024;
  console.log(
    "post service",
    req.body.data.id,
    `${Math.round(used * 100) / 100} MB`,
    posts.length
  );

  res.send({});
});

app.listen(4000, () => {
  console.log("Listening on 4000");
});
