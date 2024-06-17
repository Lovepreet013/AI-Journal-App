import EntryCard from "@/components/EntryCard"
import NewEntryCard from "@/components/NewEntryCard"
import Question from "@/components/Question"
import { getUserByClerkID } from "@/utils/auth"
import { prisma } from "@/utils/db"
import Link from "next/link"

const getEntries = async () => {
    const user = await getUserByClerkID()
    const entries = await prisma.journalEntry.findMany({
        where : {
            userId : user.id
        },
        orderBy : {
            createdAt : 'desc'
        }
    })

    return entries
}

const JournalPage = async () => {
    const entries = await getEntries()
    console.log(entries)

    return (
        <div className="p-12">
            <h1 className="text-3xl mb-8">Journals</h1>
            <Question/>
            <div className="grid grid-cols-3 gap-3 mt-8">
                <NewEntryCard/>
                {entries.map(entry => (
                    <Link href={`/journal/${entry.id}`} key={entry.id}>
                        <EntryCard entry={entry}/>
                    </Link>
                ))}
            </div>
        </div>
    )
}

export default JournalPage