//import express
 const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const {readDir, readdirSync} = require("fs");
const { connectDb } = require("./db/connection");

//intialize express
const app = express();
dotenv.config();

//handling connection errors
app.use(
  cors({
    origin: [
      process.env.CLIENT_URL, // local dev e.g. http://localhost:3000
      "https://premique.in", // production main domain
      "https://www.premique.in", // production www domain
    ],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
// app.use(cors({origin: process.env.CLIENT_URL}));
app.use(express.json());

connectDb();


const port = process.env.PORT || 5000;

// dynamically include routes
readdirSync("./routes").map((route) =>
    app.use("/api", require(`./routes/${route}`))
);





//listen to port
app.listen(port, () =>{
    console.log(`Server is running on port ${port}`)
})