import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  const hashedPassword = await bcrypt.hash('admin123', 10)
  const studentPassword = await bcrypt.hash('alumno123', 10)
  
  // Crear Administrador
  await prisma.user.upsert({
    where: { email: 'admin@jpesgym.com' },
    update: {},
    create: {
      email: 'admin@jpesgym.com',
      name: 'Instructor JPES',
      password: hashedPassword,
      rol: 'admin',
    },
  })

  // Crear Alumno de prueba
  await prisma.user.upsert({
    where: { email: 'alumno@jpesgym.com' },
    update: {},
    create: {
      email: 'alumno@jpesgym.com',
      name: 'Camilo (Alumno)',
      password: studentPassword,
      rol: 'alumno',
      nivel: 'intermedio',
      genero: 'masculino',
    },
  })
  
  console.log("Usuarios de prueba creados.")
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
