import Router from "express";
import UserRules from "./src/rules/UserRules";
import ReservationRules from "./src/rules/ReservationRules";
import LaboratoryRules from "./src/rules/LaboratoryRules";

const routes = Router();

// Rotas de regras de usuário
routes.post("/motor-de-regras/cadastrarUsuario", UserRules.cadastrarUsuario);
routes.post("/motor-de-regras/loginUsuario", UserRules.loginUsuario);

// Rotas de regras de reserva
routes.post(
  "/motor-de-regras/cancelarReserva",
  ReservationRules.cancelarReserva
);

// Rotas de regras de laboratório
routes.post(
  "/motor-de-regras/criarLaboratorio",
  LaboratoryRules.criarLaboratorio
);
export { routes };
