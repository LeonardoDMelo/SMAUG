require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  const email = 'leonardodavimelo@live.com';
  const user = await prisma.user.findUnique({ where: { email } });

  if (!user) {
    console.log('STATUS=NOT_FOUND');
    const all = await prisma.user.findMany({
      select: { id: true, email: true, role: true, name: true },
    });
    console.log(JSON.stringify(all, null, 2));
    return;
  }

  const match123456 = await bcrypt.compare('123456', user.password);
  console.log('STATUS=FOUND');
  console.log('ID=', user.id);
  console.log('NAME=', user.name);
  console.log('EMAIL=', user.email);
  console.log('ROLE=', user.role);
  console.log('PASSWORD_IS_123456=', match123456);
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
