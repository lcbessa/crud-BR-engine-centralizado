import { Fact } from "json-rules-engine";
import { differenceInHours, differenceInMinutes } from "date-fns";
import ReservationPersistence from "../persistence/ReservationPersistence";

const reserva = new Fact("reserva", async (params, almanac) => {
  const id = await almanac.factValue("id");
  const reserva = await ReservationPersistence.obterUmaReservaPorId(id);
  console.log("reserva", reserva);
  return reserva || null;
});

const tempoRestanteParaInicioDaReserva = new Fact(
  "tempoRestanteParaInicioDaReserva",
  async (params, almanac) => {
    const reserva = await almanac.factValue("reserva");
    if (reserva) {
      const dataAtual = new Date();
      dataAtual.setHours(dataAtual.getHours() - 3); // Ajuste de fuso horário para o horário de Brasília
      console.log("dataAtual", dataAtual);

      const dataHoraInicio = new Date(reserva.dataHoraInicio);
      console.log("dataHoraInicio", dataHoraInicio);

      const tempoRestanteParaInicioDaReserva = differenceInHours(
        dataHoraInicio,
        dataAtual
      );
      console.log(
        "tempoRestanteParaInicioDaReserva",
        tempoRestanteParaInicioDaReserva
      );

      return tempoRestanteParaInicioDaReserva;
    }
    return 0; // Se não encontrar a reserva, retorna 0
  }
);

const facts = {
  reserva,
  tempoRestanteParaInicioDaReserva,
};

export default facts;
