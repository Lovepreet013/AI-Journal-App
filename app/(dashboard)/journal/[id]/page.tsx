import Editor from "@/components/Editor"
import { getUserByClerkID } from "@/utils/auth"
import { prisma } from "@/utils/db"

const getEntry = async (id) => {
    const user = await getUserByClerkID()
    const entry = await prisma.journalEntry.findUnique({ //to find the unique entry
        where : {
            userId_id : {
                userId : user.id,
                id,
            }
        },
        include : {  //to include the analysis of the entry too
            analysis : true
        }
    })

    return entry
}

const EntryEditorPage = async ({ params }) => {
    const entry = await getEntry(params.id)

    return (
        <div className="w-full h-full">
            <Editor entry={entry}/>
        </div>
    )
}

export default EntryEditorPage