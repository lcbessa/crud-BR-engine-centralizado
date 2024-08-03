import express from "express";
import RuleEngine from "./ruleEngine";
import usuarioRules from "./rules/usuarioRules";
import reservaRules from "./rules/reservaRules";
import laboratorioRules from "./rules/laboratorioRules";

const app = express();
const port = 3000;

const ruleEngine = new RuleEngine();
ruleEngine.addRules(usuarioRules);
ruleEngine.addRules(reservaRules);
ruleEngine.addRules(laboratorioRules);

app.get("/run-rules", async (request, response) => {
  const facts = {
    user: request.query.user || "guest",
    reserva: request.query.reserva || 0,
    laboratorio: request.query.laboratorio || "fechado",
  };
  const results = await ruleEngine.run(facts);
  response.json(results);
});

app.listen(port, () => {
  console.log(`Rule engine server listening at http://localhost:${port}`);
});
