const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const axios = require("axios");

const app = express();
app.use(bodyParser.json());
app.use(cors());

const posts = [];

const handleEvent = (type, data) => {
  if (type === "PostCreated") {
    posts.push(data);
  }
};

app.get("/posts", (req, res) => {
  res.send({ postslength: posts.length, posts: posts });
});

app.post("/events", (req, res) => {
  const { type, data } = req.body;

  handleEvent(type, data);
  const used = process.memoryUsage().heapUsed / 1024 / 1024;
  console.log(
    "gateway service2",
    data.id,
    `${Math.round(used * 100) / 100} MB`,
    posts.length
  );

  res.send({});
});

app.listen(4006, async () => {
  console.log("Listening on 4006");

  const res = await axios.get("http://localhost:4005/events");

  for (let index = 0; index < res.data.length; index++) {
    const element = res.data;
    handleEvent(element[index].type, element[index].data);
    console.log(
      "SyncDataAfterServiceDown",
      element[index].data.id,
      posts.length
    );
  }
});
