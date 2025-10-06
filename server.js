import express from "express";
import fetch from "node-fetch"; // npm i node-fetch
import bodyParser from "body-parser";

const app = express();
app.use(bodyParser.json({ limit: "10mb" })); // aceita PDF em base64

// ⚠️ Coloque o token aqui, mas **não no front-end**
const GITHUB_TOKEN = process.env.GITHUB_TOKEN; // coloque em .env
const REPO = "psigiovana/contratos-assinados";
const BRANCH = "main"; // ou master

app.post("/upload", async (req, res) => {
  try {
    const { nomeArquivo, conteudoBase64 } = req.body;

    const url = `https://api.github.com/repos/${REPO}/contents/contratos/${nomeArquivo}`;
    const response = await fetch(url, {
      method: "PUT",
      headers: {
        Authorization: `token ${GITHUB_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        message: `Adicionando contrato assinado: ${nomeArquivo}`,
        content: conteudoBase64,
        branch: BRANCH,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      return res.status(response.status).json(data);
    }

    res.json({ ok: true, data });
  } catch (err) {
    console.error(err);
    res.status(500).json({ ok: false, error: err.message });
  }
});

app.listen(3000, () => console.log("Servidor rodando na porta 3000"));
// Agora, no front-end, você faria uma requisição para /upload em vez de diretamente para o GitHub
// Exemplo de requisição no front-end:
// fetch('/upload', {