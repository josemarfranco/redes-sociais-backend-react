const express = require("express");
const app = express();

const dotenv = require("dotenv");
dotenv.config();

const db = process.env.DB;
const PORT = process.env.PORT;

const mongoose = require("mongoose");
mongoose
  .connect(db, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
  })
  .then(() => console.log("Banco OK"))
  .catch((err) => console.log(err));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(require("./routes/loginRoutes"));
app.use(require("./routes/userRoutes"));
app.use(require("./routes/postRoutes"));
app.use(require("./routes/fileRoutes"));
app.use(require("./routes/customQueriesRoutes"));

app.listen(PORT, console.log(`Servidor OK (${PORT})`));
