import { Engine } from "json-rules-engine"; // Importa a Engine do pacote json-rules-engine

class RuleEngine {
  constructor() {
    this.engine = new Engine(); // Cria uma nova instância da Engine
  }

  // Adiciona cada regra individualmente
  addRules(rules) {
    rules.forEach((rule) => {
      if (!rule.event) {
        console.error("Regra inválida:", rule);
        throw new Error('Engine: addRule() argument requires "event" property');
      }
      this.engine.addRule(rule);
    });
  }

  async run(facts) {
    return await this.engine.run(facts); // Executa a engine com os fatos fornecidos
  }
}

export default RuleEngine;
