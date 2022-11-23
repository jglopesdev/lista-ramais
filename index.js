const express = require("express");
const mongoose = require("mongoose");
const session = require("express-session");
const app = express();
const userRoutes = require("./routes/userRoutes");
const UserPanel = require("./models/UserPanel");
const UserRamal = require("./models/UserRamal");

//View Engine
app.set("view engine", "ejs");

//Sessions
app.use(
  session({
    secret: "dY#HQUS%GHDJASdÇy3dGhaU",
    resave: true,
    saveUninitialized: true,
    cookie: { maxAge: 3600000 },
  })
);

//Static

app.use(express.static("public"));

//Body Parser
app.use(
  express.urlencoded({
    extended: true,
  })
);
app.use(express.json());

//Start Route
app.use("/", userRoutes);

app.get("/", (req, res) => {
  res.render("main");
});

//Database
mongoose
  .connect(
    "mongodb+srv://jgsantanalopes:vhZ4IPushBffYMcH@apicluster.e23rvkb.mongodb.net/?retryWrites=true&w=majority"
  )
  .then(() => {
    app.listen(3000, () => {
      console.log(
        "Servidor iniciado na porta 3000: http://localhost:3000 conectado ao MongoDB"
      );
    });
  })
  .catch((err) =>
    console.log(
      "Erro: Não foi possível conectar com o banco de dados. Erro gerado: " +
        err
    )
  );
