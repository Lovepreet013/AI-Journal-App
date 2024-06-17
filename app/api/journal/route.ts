import { getUserByClerkID } from "@/utils/auth"
import { prisma } from "@/utils/db"
import { revalidatePath } from "next/cache"
import { NextResponse } from "next/server"

export const POST = async () => {
    const user = await getUserByClerkID()
    const entry = await prisma.journalEntry.create({
        data : {
            userId : user.id,
            content : 'Write about your day'
        }
    })

    const analysis = {
        mood: 'Neutral',
        subject: 'None',
        negative: false,
        summary: 'None',
        sentimentScore: 0,
        color: '#0101fe'
    }
    await prisma.analysis.create({
        data : {
            userId : user.id,
            entryId : entry.id,
            ...analysis
        }
    })

    revalidatePath('/journal')

    return NextResponse.json({data : entry})  //data is just a key, you can name it anything
}