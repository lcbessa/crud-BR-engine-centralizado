import express from "express";
import { routes } from "../routes";

const app = express();
const PORT = 7000;

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(routes);

app.listen(PORT, () => {
  console.log(`Servidor json-rules-engine rodando na porta ${PORT}`);
});
