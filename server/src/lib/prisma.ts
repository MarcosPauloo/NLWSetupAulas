import { PrismaClient } from "@prisma/client" //banco de dados

export const prisma = new PrismaClient({
    log:['query']
});