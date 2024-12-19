import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default {
  async buscarUsuarioPorEmail(email) {
    try {
      const emailRegistrado = await prisma.usuario.findUnique({
        where: { email },
      });
      return emailRegistrado;
    } catch (error) {
      console.error(
        "Erro ao buscar usuário por email no UserPersistence",
        error
      );
      return {
        status: 500,
        error: "Não foi possível buscar o usuário!",
      };
    }
  },
};
