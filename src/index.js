require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const mahasiswaRoutes = require("./routes/mahasiswaRoutes");

const app = express();
const PORT = 4000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

mongoose.connect(process.env.MONGO_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error: "));
db.once("open", function () {
  console.log("Connected to MongoDB Rivi");
});

app.use("/api/mahasiswa", mahasiswaRoutes);

app.listen(PORT, () => console.log(`🚀 Server started at port:${PORT}`));
