import { analyze } from "@/utils/ai"
import { getUserByClerkID } from "@/utils/auth"
import { prisma } from "@/utils/db"
import { revalidatePath } from "next/cache"
import { NextResponse } from "next/server"

export const PATCH = async (request : Request, {params}) => {
    const {content} = await request.json()

    const user = await getUserByClerkID()
    const updatedEntry = await prisma.journalEntry.update({ //here entry is updated
        where : {
            userId_id  : {
                userId : user.id,
                id : params.id,
            }
        },
        data : {
            content,
        }
    })

    //to update the analysis

    const analysis = await analyze(updatedEntry.content)
    const updatedAnalysis = await prisma.analysis.upsert({ //upsert is like if you don't find it, create it
        where : {
            entryId : updatedEntry.id,
        },
        create : { //creating the analysis
            userId : user.id,
            entryId : updatedEntry.id,
            ...analysis
        },
        update : analysis  //updating the analysis
    })

    return NextResponse.json({data : {...updatedEntry, analysis : updatedAnalysis}})
}