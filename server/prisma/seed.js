const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()
const bcrypt = require('bcrypt')

async function main() {
  await prisma.subscription.deleteMany()
  await prisma.refreshToken.deleteMany()
  await prisma.plan.deleteMany()
  await prisma.user.deleteMany()

  const plans = [
    { name: 'Starter', price: 9.99, features: ['Basic features', 'Email support'], duration: 30 },
    { name: 'Pro', price: 29.99, features: ['Everything in Starter', 'Priority support', 'Analytics'], duration: 30 },
    { name: 'Business', price: 79.99, features: ['All Pro features', 'Team seats', 'Advanced reports'], duration: 30 }
  ]

  for (const p of plans) {
    await prisma.plan.create({ data: p })
  }

  const password = await bcrypt.hash('admin123', 10)
  await prisma.user.create({ data: { name: 'Admin', email: 'admin@example.com', password, role: 'admin' } })

  console.log('Seed finished.')
}

main()
  .catch((e) => console.error(e))
  .finally(async () => {
    await prisma.$disconnect()
  })
