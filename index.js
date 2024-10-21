import express from "express";
import statsCard from "./api/index.js";
const app = express();

app.listen(process.env.port || 9000,() => {
    console.log(`${process.env.port || 9000}`);
  })

app.get("/", statsCard);