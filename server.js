const express = require("express");
const cors = require("cors");

// 👉 executa criação das tabelas automaticamente
const { execSync } = require("child_process");

try {
  execSync("npx prisma db push", { stdio: "inherit" });
} catch (err) {
  console.error("Erro ao rodar prisma db push:", err.message);
}

// 👉 Prisma
const { PrismaClient } = require("@prisma/client");

const app = express();
const prisma = new PrismaClient();

app.use(cors());
app.use(express.json());

// ===== ROTA TESTE =====
app.get("/", (req, res) => {
  res.send("API Cuidadores rodando 🚀");
});

// ===== LISTAR CUIDADORES =====
app.get("/cuidadores", async (req, res) => {
  try {
    const data = await prisma.cuidador.findMany();
    res.json(data);
  } catch (error) {
    console.error("ERRO GET:", error);
    res.status(500).json({
      error: "Erro ao buscar cuidadores",
      detalhe: error.message
    });
  }
});

// ===== CRIAR CUIDADOR =====
app.post("/cuidadores", async (req, res) => {
  try {
    console.log("BODY:", req.body);

    const { nome, cpf, telefone, pix } = req.body;

    // validação básica
    if (!nome || !cpf) {
      return res.status(400).json({
        error: "Nome e CPF são obrigatórios"
      });
    }

    const cuidador = await prisma.cuidador.create({
      data: {
        nome,
        cpf,
        telefone,
        pix
      }
    });

    res.json(cuidador);

  } catch (error) {
    console.error("ERRO POST:", error);

    res.status(500).json({
      error: "Erro ao criar cuidador",
      detalhe: error.message
    });
  }
});

// ===== START =====
const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log("API rodando na porta " + PORT);
});
