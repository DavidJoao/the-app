import { prismaClient } from "@/app/lib/prismaClient";

export default async function getStatus (req, res) {
    const { email } = req.query;
    try {
        const user = await prismaClient.user.findUnique({ where: { email: email} })
        if (user) {
            res.status(200).json({ status: user?.status })
        } else if (!user) {
            res.status(200).json({ status: 'deleted'})
        }
    } catch (error) {
        res.status(400).json({ error: 'Unable to retreive status' })
        console.error("Error:", error)
        return error
    }
}