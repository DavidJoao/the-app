const bcrypt = require('bcrypt');
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function POST (request, response) {
    try { 
        const form = await request.body;
        const existingEmail = await prisma.user.findFirst({ where: { email: form.email } });

        if (existingEmail) {
            response.status(500).json({ error: 'El correo electrónico está en uso' })
        } else {
            const hash = await bcrypt.hash(form.password, 10);
            await prisma.user.create({
                data: {
                    name: form.name,
                    email: form.email,
                    password: hash,
                    role: "user",
                }
            })
            response.status(200).json({ success: true });
        }
    } catch (error) {
        console.error('Error:', error);
        response.status(500).json({ error: "Internal Server Error" })
    }
}