import express from "express";
import fetch from "node-fetch";
import dotenv from "dotenv";

dotenv.config();
const app = express();
app.use(express.json({ limit: "10mb" }));

const token = process.env.GITHUB_TOKEN;
const repo = "psigiovana/contratos-assinados";
const branch = "main";

// Rota para upload do PDF
app.post("/upload", async (req, res) => {
  try {
    const { nomeArquivo, conteudoBase64 } = req.body;
    const url = `https://api.github.com/repos/${repo}/contents/contratos/${nomeArquivo}`;

    const resposta = await fetch(url, {
      method: "PUT",
      headers: {
        Authorization: `token ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        message: `Adicionando contrato: ${nomeArquivo}`,
        content: conteudoBase64,
        branch,
      }),
    });

    const resultado = await resposta.json();
    res.json(resultado);
  } catch (err) {
    console.error(err);
    res.status(500).json({ erro: "Falha no upload" });
  }
});

app.listen(3000, () => console.log("✅ Servidor rodando em http://localhost:3000"));
