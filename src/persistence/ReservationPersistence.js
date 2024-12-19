import { PrismaClient } from "@prisma/client";
import { startOfDay, endOfDay } from "date-fns";

const prisma = new PrismaClient();

export default {
  async buscarReservasDoDiaDoLaboratorio(laboratorioId, dataReferencia) {
    const inicioDoDia = startOfDay(dataReferencia);
    inicioDoDia.setHours(inicioDoDia.getHours() - 3);
    console.log("inicioDoDia", inicioDoDia);

    const fimDoDia = endOfDay(dataReferencia);
    fimDoDia.setHours(fimDoDia.getHours() - 3);
    console.log("fimDoDia", fimDoDia);

    const reservasDoLaboratorio = await prisma.reserva.findMany({
      where: {
        laboratorioId: Number(laboratorioId),
        dataHoraInicio: { gte: inicioDoDia },
        dataHoraFim: { lte: fimDoDia },
      },
    });
    console.log("reservasDoLaboratorio", reservasDoLaboratorio);
    return {
      status: 200,
      success: reservasDoLaboratorio,
    };
  },
  async obterUmaReservaPorId(id) {
    try {
      const reserva = await prisma.reserva.findUnique({
        where: { id: parseInt(id) },
      });
      return reserva;
    } catch (error) {
      console.error("Erro ao buscar a reservas", error);
      return {
        status: 500,
        error: "Não foi possível buscar a reserva!",
      };
    }
  },
};
