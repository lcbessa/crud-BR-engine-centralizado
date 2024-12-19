import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default {
  async obterLaboratorioPorId(id) {
    try {
      const laboratorio = await prisma.laboratorio.findUnique({
        where: { id: parseInt(id) },
        include: { reservas: true },
      });
      return {
        status: 200,
        success: laboratorio,
      };
    } catch (error) {
      console.error("Erro ao buscar laboratório", error);
      return {
        status: 500,
        error: "Não foi possível buscar laboratório!",
      };
    }
  },
  async obterLaboratorioPorCampo(campo, valorCampo) {
    try {
      const laboratorio = await prisma.laboratorio.findUnique({
        where: { [campo]: valorCampo },
      });
      return laboratorio;
    } catch (error) {
      console.error(`Erro ao buscar laboratório por ${campo}`, error);
      return {
        status: 500,
        error: `Não foi possível buscar laboratório por ${campo}!`,
      };
    }
  },
};
