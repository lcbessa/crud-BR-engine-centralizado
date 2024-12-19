import { engine } from "../engine";
import { Rule } from "json-rules-engine";
import facts from "../facts/ReservationFacts";

export default {
  async cancelarReserva(request, response) {
    const { id, usuarioId } = request.body;

    try {
      if (!id && !usuarioId) {
        return response.status(400).json({
          success: false,
          message: "id e usuarioId são obrigatórios.",
        });
      }

      const cancelarReserva = new Rule({
        conditions: {
          all: [
            {
              name: "verificaExistenciaReserva", // RN 15
              fact: "reserva",
              operator: "notEqual",
              value: null,
              path: "$",
            },
            {
              all: [
                {
                  name: "verificaCriadorReserva", // RN 16
                  fact: "reserva",
                  operator: "equal",
                  value: usuarioId,
                  path: "$.usuarioId",
                },
                {
                  name: "verificaTempoParaCancelamento", // RN 17
                  fact: "tempoRestanteParaInicioDaReserva",
                  operator: "greaterThanInclusive",
                  value: 1, // 1 hora
                },
              ],
            },
          ],
        },
        event: {
          type: "success",
          params: {
            message: "Reserva pode ser cancelada.",
          },
        },
      });

      // adiciona os fatos ao motor
      engine.addFact(facts.reserva);
      engine.addFact(facts.tempoRestanteParaInicioDaReserva);

      // adiciona a regra ao motor
      engine.addRule(cancelarReserva);

      const results = await engine.run({ id });

      // remove os fatos do motor
      engine.removeFact(facts.reserva);
      engine.removeFact(facts.tempoRestanteParaInicioDaReserva);
      // remove a regra do motor
      engine.removeRule(cancelarReserva);

      if (results.events && results.events.length > 0) {
        return response.status(200).json({
          success: true,
          message: results.events[0].params?.message,
        });
      }

      const mensagensErro = results.failureResults.flatMap((ruleResult) =>
        ruleResult.conditions.all
          .filter((condition) => !condition.result)
          .map((condition) => {
            switch (condition.name) {
              case "verificaExistenciaReserva":
                return "A reserva não existe.";
              case "verificaCriadorReserva":
                return "Somente o criador da reserva pode cancelá-la.";
              case "verificaTempoParaCancelamento":
                return "A reserva só pode ser cancelada com no mínimo 1 hora de antecedência.";
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
