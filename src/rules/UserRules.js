import { engine } from "../engine"; // Importa o objeto 'engine' do módulo 'engine'
import { Rule } from "json-rules-engine"; // Importa a classe 'Rule' do módulo 'json-rules-engine'
import facts from "../facts/UserFacts"; // Importa o módulo 'UserFacts'
import { all } from "axios";

export default {
  async cadastrarUsuario(request, response) {
    const { email, senha } = request.body;
    // dados recebe um objeto com as propriedades email e senha do cliente
    try {
      if (!email && !senha) {
        return response.status(400).json({
          success: false,
          message: "email e senha são obrigatórios.",
        });
      }

      // // Instancia uma nova regra para validar o cadastro do usuário
      let cadastroUsuario = new Rule({
        conditions: {
          all: [
            {
              // RN2 - O identificador do Usuário deve ser único.
              name: "verificaExistenciaEmail",
              fact: "usuario",
              operator: "notEqual",
              value: email,
              path: "$.email",
            },
            {
              // A senha do Usuário deve ter no mínimo 8 caracteres.
              name: "verificaTamanhoSenha",
              fact: "passwordLength",
              operator: "greaterThanInclusive",
              value: 6,
            },
          ],
        },
        event: {
          type: "cadastro-valido",
          params: {
            message: "Usuário pode ser cadastrado.",
          },
        },
        name: "cadastroUsuario",
      });

      // Adiciona os fatos ao motor
      engine.addFact(facts.usuario);
      engine.addFact(facts.passwordLength);

      // Adiciona a regra ao motor
      engine.addRule(cadastroUsuario);

      // Executa o motor de regras com os dados recebidos
      const results = await engine.run({ email, senha });

      console.log(results);

      // Limpando os fatos do motor
      engine.removeFact(facts.usuario);
      engine.removeFact(facts.passwordLength);

      // Limpa a regra do motor
      engine.removeRule(cadastroUsuario);

      // Verifica se eventos de sucesso foram disparados
      if (results.events && results.events.length > 0) {
        return response.status(200).json({
          success: true,
          message: results.events[0].params?.message,
        });
      }

      // Tratar condições que falharam
      const mensagensErro = results.failureResults.flatMap((ruleResult) =>
        ruleResult.conditions.all
          .filter((condition) => !condition.result)
          .map((condition) => {
            switch (condition.name) {
              case "verificaExistenciaEmail":
                return "O e-mail já está cadastrado no sistema.";
              case "verificaTamanhoSenha":
                return "A senha deve ter no mínimo 6 caracteres.";
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
  async loginUsuario(request, response) {
    const { email, senha } = request.body;

    try {
      if (!email && !senha) {
        return response.status(400).json({
          success: false,
          message: "email e senha são obrigatórios.",
        });
      }

      // Instancia uma nova regra para validar o login do usuário
      const loginUsuario = new Rule({
        conditions: {
          all: [
            {
              // RN1 - O Usuário deve estar cadastrado no sistema.
              name: "verificaExistenciaEmail",
              fact: "usuario",
              operator: "equal",
              value: email,
              path: "$.email",
            },
            {
              name: "verificaSenha",
              fact: "usuario",
              operator: "equal",
              value: senha,
              path: "$.senha",
            },
          ],
        },
        event: {
          type: "login-valido",
          params: {
            message: "Usuario pode logar.",
          },
        },
        name: "loginUsuario",
      });

      // Adiciona os fatos ao motor
      engine.addFact(facts.usuario);

      // Adiciona a regra ao motor
      engine.addRule(loginUsuario);

      // Executa o motor de regras com os dados recebidos
      const results = await engine.run({ email, senha });
      console.log(results);

      // Remove o fato do motor
      engine.removeFact(facts.usuario);

      // Limpa a regra do motor
      engine.removeRule(loginUsuario);

      // Verifica se eventos de sucesso foram disparados
      if (results.events && results.events.length > 0) {
        return response.status(200).json({
          success: true,
          message: results.events[0].params?.message,
        });
      }

      // Tratar condições que falharam
      const mensagensErro = results.failureResults.flatMap((ruleResult) =>
        ruleResult.conditions.all
          .filter((condition) => !condition.result)
          .map((condition) => {
            switch (condition.name) {
              case "verificaExistenciaEmail":
                return "O e-mail não está cadastrado no sistema.";
              case "verificaSenha":
                return "A senha informada está incorreta.";
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
