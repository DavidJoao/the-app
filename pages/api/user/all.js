import { prismaClient } from "@/app/lib/prismaClient";

export default async function POST(request, response) {
	try {
        const users = await prismaClient.user.findMany();
		response.status(200).json({ users: users })
        return users
	} catch (error) {
		console.error("Error:", error)
		response.status(500).json({ error: error })
	}
}
