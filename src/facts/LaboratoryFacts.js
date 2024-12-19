import { Fact } from "json-rules-engine";
import LaboratoryPersistence from "../persistence/LaboratoryPersistence";

const laboratorio = new Fact("laboratorio", async (params, almanac) => {
  const nome = await almanac.factValue("nome");
  const sigla = await almanac.factValue("sigla");
  const nomeLaboratorio = await LaboratoryPersistence.obterLaboratorioPorCampo(
    "nome",
    nome
  );
  const siglaLaboratorio = await LaboratoryPersistence.obterLaboratorioPorCampo(
    "sigla",
    sigla
  );
  return nomeLaboratorio || siglaLaboratorio || null;
});

const facts = {
  laboratorio,
};
export default facts;
