require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const mahasiswaRoutes = require("./routes/mahasiswaRoutes");
const matkulRoutes = require("./routes/matkulRoutes");
const enrollmentRoutes = require("./routes/enrollmentRoutes");
const jadwalRoutes = require("./routes/jadwalRoutes");

const app = express();
const PORT = 4000;

console.log("MONGO_URL:", process.env.MONGO_URL);

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
app.use("/api/matkul", matkulRoutes);
app.use("/api/enrollments", enrollmentRoutes); 
app.use("/api/jadwal", jadwalRoutes);
app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(PORT, () => console.log(`🚀 Server started at port:${PORT}`));
