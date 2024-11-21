import { prismaClient } from "@/app/lib/prismaClient";

export default async function POST(request, response) {
	try {
        const users = await prismaClient.user.findMany({ 
			orderBy: {
				lastLogin: 'desc'
			}
		});
		const allUsers = users.map(user => {
			const { password, ...userWithoutPassowrd } = user
			return userWithoutPassowrd
		})
		response.status(200).json({ users: allUsers })
        return users
	} catch (error) {
		console.error("Error:", error)
		response.status(500).json({ error: error })
	}
}
