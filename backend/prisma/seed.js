const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const achievements = [
  {
    code: 'FIRST_CONSOLE',
    title: 'Primeiro Hardware',
    description: 'Cadastrou o primeiro console na coleção.',
    icon: 'Tv',
  },
  {
    code: 'FIRST_GAME',
    title: 'Primeiro Jogo',
    description: 'Cadastrou o primeiro jogo na coleção.',
    icon: 'Gamepad2',
  },
  {
    code: 'COLLECTOR_10',
    title: 'Colecionador',
    description: 'Possui 10 ou mais itens na coleção.',
    icon: 'Trophy',
  },
  {
    code: 'QUIZ_MASTER',
    title: 'Mestre do Quiz',
    description: 'Acertou todas as perguntas do quiz diário.',
    icon: 'Trophy',
  },
];

async function main() {
  for (const achievement of achievements) {
    await prisma.achievement.upsert({
      where: { code: achievement.code },
      update: {
        title: achievement.title,
        description: achievement.description,
        icon: achievement.icon,
      },
      create: achievement,
    });
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
