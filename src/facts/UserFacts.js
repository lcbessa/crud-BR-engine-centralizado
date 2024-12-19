import { Fact } from "json-rules-engine";
import UserPersistence from "../persistence/UserPersistence"; // Importa o módulo 'UserPersistence'

const usuario = new Fact("usuario", async (params, almanac) => {
  const email = await almanac.factValue("email");
  const emailRegistrado = await UserPersistence.buscarUsuarioPorEmail(email);
  console.log("Usuario", emailRegistrado);

  return emailRegistrado || null;
});

const passwordLength = new Fact("passwordLength", async (params, almanac) => {
  const senha = await almanac.factValue("senha");
  return senha.length;
});

const facts = {
  usuario,
  passwordLength,
};

export default facts;
