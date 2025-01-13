const express = require("express");
const { login } = require("../middlewares/login");
const {
  upload,
  verifyToken,
  postLaboratorio,
  getAllLaboratorios,
  isDiaUtil,
  gerarPdfLaboratorios,
} = require("../middlewares/laboratorios");

const router = express.Router();

router.post("/login", login, (req, res) => {
  res.status(200).send({
    message: "Login bem-sucedido!",
    user: {
      id: req.user.id,
      email: req.user.email,
      name: req.user.name,
    },
    token: req.user.token,
  });
});

router.post(
  "/laboratorios/novo",
  verifyToken,
  upload.single("foto"),
  postLaboratorio
);

router.get("/laboratorios", verifyToken, isDiaUtil, getAllLaboratorios);

router.get("/laboratorios/pdf", verifyToken, gerarPdfLaboratorios);

module.exports = router;
