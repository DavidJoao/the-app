import { prismaClient } from "@/app/lib/prismaClient";

export default async function (req, res) {
    const { email } = req.query;
    try {
        const updatedUser = await prismaClient.user.update({ 
            where: { email: email},
            data: { lastLogin: new Date() }
         })
         res.status(200).json(updatedUser)
    } catch (error) {
        console.error("Error updating lastLogin:", error);
        res.status(500).json({ error: "Unable to update lastLogin" });
    }
}