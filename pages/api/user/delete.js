import { prismaClient } from "@/app/lib/prismaClient"

export default async function deleteUsers (req, res) {
    const users = req.body;
    try {
        const response = await prismaClient.user.deleteMany({ 
            where: { user_id: { in: users }}
         })
         return res.status(200).json({ success: true, response });
    } catch (error) {
        console.error({ error: error })
        return res.status(500).json({ success: false, error: error.message });
    }
}