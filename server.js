app.get("/", (req, res) => {
  res.send("API Cuidadores rodando 🚀");
});
const express = require("express");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const { PrismaClient } = require("@prisma/client");

const app = express();
const prisma = new PrismaClient();

app.use(cors());
app.use(express.json());

const SECRET = process.env.JWT_SECRET || "123";

// ================= AUTH =================
app.post("/login", async (req, res) => {
  const { email, senha } = req.body;

  const user = await prisma.usuario.findUnique({ where: { email } });

  if (!user || user.senha !== senha) {
    return res.status(401).json({ error: "Credenciais inválidas" });
  }

  const token = jwt.sign(
    { id: user.id, role: user.role, empresaId: user.empresaId },
    SECRET
  );

  res.json({ token });
});

// ================= CUIDADORES =================
app.post("/cuidadores", async (req, res) => {
  const data = await prisma.cuidador.create({ data: req.body });
  res.json(data);
});

app.get("/cuidadores", async (req, res) => {
  const data = await prisma.cuidador.findMany();
  res.json(data);
});

// ================= CONTRATOS =================
app.post("/contratos", async (req, res) => {
  const data = await prisma.contrato.create({ data: req.body });
  res.json(data);
});

app.get("/contratos", async (req, res) => {
  const data = await prisma.contrato.findMany();
  res.json(data);
});

// ================= AGENDAMENTOS =================
app.post("/agendamentos", async (req, res) => {
  const data = await prisma.agendamento.create({ data: req.body });
  res.json(data);
});

app.get("/agendamentos", async (req, res) => {
  const data = await prisma.agendamento.findMany();
  res.json(data);
});

// ================= FINANCEIRO =================
app.post("/financeiro", async (req, res) => {
  const data = await prisma.financeiro.create({ data: req.body });
  res.json(data);
});

app.get("/financeiro", async (req, res) => {
  const data = await prisma.financeiro.findMany();
  res.json(data);
});

// ================= FLUXO DE CAIXA =================
app.get("/fluxo-caixa", async (req, res) => {
  const receitas = await prisma.financeiro.aggregate({
    _sum: { valor: true },
    where: { tipo: "receita" }
  });

  const despesas = await prisma.financeiro.aggregate({
    _sum: { valor: true },
    where: { tipo: "despesa" }
  });

  res.json({
    receitas: receitas._sum.valor || 0,
    despesas: despesas._sum.valor || 0,
    saldo:
      (receitas._sum.valor || 0) - (despesas._sum.valor || 0)
  });
});

// ================= START =================
const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log("Servidor rodando na porta", PORT);
});
