import { engine } from "../engine";
import { Rule } from "json-rules-engine";
import facts from "../facts/LaboratoryFacts";

export default {
  async criarLaboratorio(request, response) {
    const { nome, sigla } = request.body;

    try {
      if (!nome && !sigla) {
        return response.status(400).json({
          success: false,
          message: "nome e sigla são obrigatórios.",
        });
      }

      //Instancia a regra de criação de laboratório
      const criarLaboratorio = new Rule({
        conditions: {
          all: [
            {
              name: "verificaExistenciaNomeLaboratorio",
              fact: "laboratorio",
              operator: "notEqual",
              value: nome,
              path: "$.nome",
            },
            {
              name: "verificaExistenciaSiglaLaboratorio",
              fact: "laboratorio",
              operator: "notEqual",
              value: sigla,
              path: "$.sigla",
            },
          ],
        },
        event: {
          type: "success",
          params: {
            message: "Laboratório pode ser criado.",
          },
        },
      });

      // adiciona os fatos ao motor
      engine.addFact(facts.laboratorio);

      // adiciona a regra ao motor
      engine.addRule(criarLaboratorio);

      // executa o motor de regras
      const results = await engine.run({ nome, sigla });

      //remove os fatos do motor
      engine.removeFact(facts.laboratorio);

      //remove a regra do motor
      engine.removeRule(criarLaboratorio);

      if (results.events && results.events.length > 0) {
        return response
          .status(200)
          .json({ success: true, message: results.events[0].params?.message });
      }

      const mensagensErro = results.failureResults.flatMap((ruleResult) =>
        ruleResult.conditions.all
          .filter((condition) => !condition.result)
          .map((condition) => {
            switch (condition.name) {
              case "verificaExistenciaNomeLaboratorio":
                return "Nome de laboratório já existe.";
              case "verificaExistenciaSiglaLaboratorio":
                return "Sigla de laboratório já existe.";
              default:
                return "";
            }
          })
      );
      if (mensagensErro.length > 0) {
        return response.status(400).json({
          success: false,
          messages: mensagensErro,
        });
      }
    } catch (error) {
      console.error("Erro ao processar o motor de regras:", error.message);
      return response.status(500).json({ error: "Erro no motor de regras." });
    }
  },
};
