const express = require("express");
const cors = require("cors");
const { PrismaClient } = require("@prisma/client");

const app = express(); // ⚠️ PRIMEIRO cria o app
const prisma = new PrismaClient();

app.use(cors());
app.use(express.json());

// ✅ ROTA TESTE (AGORA NO LUGAR CERTO)
app.get("/", (req, res) => {
  res.send("API Cuidadores rodando 🚀");
});

// ===== CUIDADORES =====
app.get("/cuidadores", async (req, res) => {
  const data = await prisma.cuidador.findMany();
  res.json(data);
});

app.post("/cuidadores", async (req, res) => {
  const cuidador = await prisma.cuidador.create({
    data: req.body,
  });
  res.json(cuidador);
});

// ===== START =====
const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log("API rodando na porta " + PORT);
});
