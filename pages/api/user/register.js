const bcrypt = require("bcrypt")
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export default async function POST(request, response) {
	try {
		const form = await request.body
		const hash = await bcrypt.hash(form.password, 10)
		await prisma.user.create({
			data: {
				name: form.name,
				email: form.email,
				password: hash,
				status: "active",
				lastActivity: new Date(),
				lastLogin: new Date(),
				registerTime: new Date(),
			},
		})
		response.status(200).json({ success: true })
	} catch (error) {
		console.error("Error:", error)
		response.status(500).json({ error: 'Email Already In Use' })
	}
}
