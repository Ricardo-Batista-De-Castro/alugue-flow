import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient({
  log: process.env.NODE_ENV === 'development' 
    ? ['query', 'error', 'warn'] 
    : ['error'],
});

// Middleware para detectar queries lentas
prisma.$use(async (params, next) => {
  const before = Date.now();
  const result = await next(params);
  const after = Date.now();
  const queryTime = after - before;
  
  if (queryTime > 1000) {
    console.warn(`⚠️ Slow query detected: ${params.model}.${params.action} took ${queryTime}ms`);
  }
  
  return result;
});

// Graceful shutdown
process.on('beforeExit', async () => {
  await prisma.$disconnect();
});

export default prisma;
