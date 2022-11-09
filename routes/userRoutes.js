const router = require("express").Router();
const express = require("express");
const bcrypt = require("bcryptjs");
const nodemailer = require("nodemailer");
const crypto = require("crypto");
const adminAuth = require("../middlewares/adminAuth");
const UserRamal = require("../models/UserRamal");
const UserPanel = require("../models/UserPanel");
const { now } = require("mongoose");
const { find } = require("../models/UserRamal");

router.get("/listaRamais", async (req, res) => {
  await UserRamal.find({ raw: true }).then((body) => {
    res.json(body);
  });
});

//ROTAS PARA EDICAO DOS RAMAIS
router.get("/maintenance", (req, res) => {
  res.render("maintenance");
});
router.post("/user", async (req, res) => {
  const { ramal, name, occupation, department, company, status } = req.body;

  const userRamal = {
    ramal,
    name,
    occupation,
    department,
    company,
    status,
  };

  if (
    !userRamal.ramal ||
    !userRamal.name ||
    !userRamal.occupation ||
    !userRamal.department ||
    !userRamal.company ||
    !userRamal.status
  ) {
    res.status(422).json({
      message:
        "Preencha todos os campos, para que possa inserir o usuário com sucesso.",
    });
    return;
  }

  try {
    await UserRamal.create(userRamal);

    res
      .status(201)
      .json({ message: "Usuário(s) inserido(s) no sistema com sucesso" });
  } catch (error) {
    res.status(500).json({ error: error });
  }
});
router.get("/user", async (req, res) => {
  try {
    const usersRamal = await UserRamal.find();

    res.status(200).json(usersRamal);
  } catch (error) {
    res.status(500).json({ error: error });
  }
});
//Read One
router.get("/user/:id", async (req, res) => {
  // extrair o dado da requisicao = pela url = req.params
  const id = req.params.id;

  try {
    const userRamal = await UserRamal.findOne({ _id: id });

    if (!userRamal) {
      res.status(422).json({ message: "O usuário não foi encontrado" });
      return;
    }

    res.status(200).json(userRamal);
  } catch (error) {
    res.status(500).json({ error: error });
  }
});
router.patch("/user/:id", async (req, res) => {
  const id = req.params.id;

  const { ramal, name, occupation, department, company, status } = req.body;

  const userRamal = {
    ramal,
    name,
    occupation,
    department,
    company,
    status,
  };

  try {
    const updatedUser = await UserRamal.updateOne({ _id: id }, userRamal);

    if (updatedUser.matchedCount === 0) {
      res.status(422).json({ message: "O usuário não foi encontrado! " });
      return;
    }

    res.status(200).json(userRamal);
  } catch (error) {
    res.status(500).json({ error: error });
  }
});
router.delete("/user/:id", async (req, res) => {
  const id = req.params.id;

  const userRamal = await UserRamal.findOne({ _id: id });

  if (!userRamal) {
    res.status(422).json({ message: "O usuário não foi encontrado" });
    return;
  }

  try {
    await UserRamal.deleteOne({ _id: id });

    res.status(200).json({ message: "Usuário removido com sucesso!" });
  } catch (error) {
    res.status(500).json({ error: error });
  }
});

//Routes for Acess Panel

//Route Login
router.post("/authenticate", (req, res) => {
  let email = req.body.email;
  let password = req.body.password;
  UserPanel.findOne({ email: email }).then((foundUser) => {
    if (foundUser != undefined) {
      let correctPass = bcrypt.compareSync(password, foundUser.password);
      if (correctPass) {
        req.session.user = {
          id: foundUser._id,
          email: foundUser.email,
        };
        res.redirect("/access-panel");
      } else {
        res.redirect("/");
      }
    } else {
      res.redirect("/");
    }
  });
});

router.get("/forgot-password", (req, res) => {
  res.render("forgotPassword");
});

router.post("/forgot-password", async (req, res) => {
  const { email } = req.body;
  const foundUser = await UserPanel.findOne({ email: email });

  if (foundUser) {
    const token = crypto.randomBytes(20).toString("hex");

    const now = new Date();
    now.setHours(now.getHours() + 1);

    await UserPanel.findByIdAndUpdate(foundUser.id, {
      $set: {
        passwordResetToken: token,
        passwordResetExpires: now,
      },
    });

    let transport = nodemailer.createTransport({
      host: "smtp.mailtrap.io",
      port: 2525,
      auth: {
        user: "51278027338e83",
        pass: "a92f006e4b1ad5",
      },
    });

    let message = {
      from: "naoresponda@jglopes.dev",
      to: `${foundUser.email}`,
      subject: "Recuperação de senha - Lista de Ramais",
      text: "Clique no link para cadastrar uma nova senha e informe o Token informado neste e-mail, pois ele será utilizado para confirmar sua identidade.",
      html: `<body style="margin-top: 4rem; margin-left: 1rem; font-size: 1.2rem;
               font-family: Calibri; background-color: #1a1a21; color: #faffff; text-align: center">
              <div>
                <h1 style="font-size: 1.5rem; color: #03cfb1">${foundUser.name},</h1>
                <p style="line-height: 1.6rem">
                Você solicitou a redefinição de senha de acesso
                ao Painel da Lista de Ramais.<br><br>
                Para prosseguir com a solicitação, copie este Token:<br>
                <span style="background-color:#03cfb1; color: #1a1a21; border-radius: 5px"><strong> &nbsp;${token}&nbsp;</strong></span><br>
                ele será utilizado para confirmar sua identidade.
                </p>
                <p>Com o token copiado, <a href="http://localhost:3000/update-password" style="color: #03cfb1; text-decoration: none">
                <strong>Clique Aqui</strong></a><span> e redefina sua senha</span><br>
                <img src="https://i.ibb.co/RBWn9tc/Jglopes.png" style="width: 120px; margin: 0 auto; margin: 5rem 0rem";
              </div>
             </body>`,
    };

    transport.sendMail(message, function (err) {
      if (err) {
        res.status(400).json({
          erro: true,
          mensagem: "Erro: E-mail não enviado",
        });
      } else {
        res.json({
          mensagem:
            "Veja seu e-mail e siga as instruções para redefinir sua senha!",
        });
      }
    });
  } else {
    res
      .status(400)
      .json({ erro: true, mensagem: "Erro: E-mail não encontrado" });
  }
});

router.get("/update-password", (req, res) => {
  res.render("updatePassword");
});

router.post("/update-password", async (req, res) => {
  let { email, token, password } = req.body;
  password = await bcrypt.hash(password, 8);
  token = token.trim();

  try {
    const foundUser = await UserPanel.findOne({ email }).select(
      "+passwordResetToken passwordResetExpires"
    );

    if (!foundUser)
      return res.status(400).send({ error: "Usuário não localizado" });

    if (token !== foundUser.passwordResetToken) {
      res.status(400).send({ error: "Token inválido" });
    }

    const now = new Date();
    if (now > foundUser.passwordResetExpires)
      return res.status(400).send({
        error: "Token expirado, gere um novo Token e tente novamente",
      });

    foundUser.password = password;

    console.log(await foundUser.save());

    res.status(200).send({ message: "Alteração realizada com sucesso!" });
  } catch (error) {
    res
      .status(400)
      .send({ error: "Não foi possível redefinir sua senha, tente novamente" });
  }
});

router.get("/logout", (req, res) => {
  req.session.user = undefined;
  res.redirect("/");
});

//Main page / Read All Operators registered
router.get("/access-panel", adminAuth, async (req, res) => {
  await UserPanel.find({ raw: true }).then((operators) => {
    res.render("accessPanel/accessPanel", {
      operators: operators,
    });
  });
});

//route view New Operator
router.get("/access-panel/new", adminAuth, (req, res) => {
  res.render("accessPanel/newOp");
});

//create
router.post("/access-panel/new", async (req, res) => {
  let { name, email, password, occupation, company, statusUser } = req.body;

  req.body.password = await bcrypt.hash(req.body.password, 8);

  const userPanel = {
    name,
    email,
    password,
    occupation,
    company,
    statusUser,
  };

  userPanel.password = req.body.password;

  if ((userPanel.statusUser = req.body.statusUser == "on")) {
    !!userPanel.statusUser;
  } else if (
    userPanel.statusUser == undefined ||
    userPanel.statusUser == null
  ) {
    userPanel.statusUser == false;
  }

  if (
    !userPanel.name ||
    !userPanel.email ||
    !userPanel.password ||
    !userPanel.occupation ||
    !userPanel.company
  ) {
    res.status(422).json({
      message: "Todos os campos são obrigatórios!",
    });
    return;
  }

  try {
    await UserPanel.create(userPanel);
    res.status(201);
    res.redirect("/access-panel");
  } catch (err) {
    res.status(500).json({ err: err });
  }
});

//route view Edit Operator
router.get("/access-panel/edit/:id", adminAuth, (req, res) => {
  const id = req.params.id;
  UserPanel.findById(id)
    .then((userPanel) => {
      if (userPanel != undefined) {
        res.render("accessPanel/editOp", { userPanel: userPanel });
      } else {
        res.redirect("/access-panel");
      }
    })
    .catch((error) => {
      res.redirect("/access-panel");
    });
});

router.post("/access-panel/update", async (req, res) => {
  let { id, name, email, password, occupation, company, statusUser } = req.body;

  if (req.body.statusUser == "on") {
    statusUser = !!req.body.statusUser;
  } else {
    statusUser = false;
  }

  password = await bcrypt.hash(password, 8);

  await UserPanel.updateOne(
    { _id: id },
    {
      $set: {
        name: name,
        email: email,
        password: password,
        occupation: occupation,
        company: company,
        statusUser: statusUser,
      },
    }
  ).then(() => {
    res.redirect("/access-panel");
  });
});

//Delete
router.get("/access-panel/delete/:id", adminAuth, async (req, res) => {
  const id = req.params.id;
  UserPanel.deleteOne({ _id: id })
    .then(() => {
      res.redirect("/access-panel");
    })
    .catch((error) => {
      res.send(error);
    });
});

//Error HTTP401 - Unauthorized
router.get("/error", (req, res) => {
  res.render("error");
});

module.exports = router;
