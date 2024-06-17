import { prisma } from "@/utils/db"

const EntryCard = async ({entry}) => {
    const date = new Date(entry.createdAt).toDateString()

    const getAnalysis = async (id) => {
        const analysis = await prisma.analysis.findUnique({
            where : {
                entryId : id
            }
        })

        return {analysis}
    }

    const {analysis} = await getAnalysis(entry.id)

    return (
        <div className="divide-y divide-gray-200 overflow-hidden rounded-lg bg-white shadow">
            <div className="px-4 py-5 sm:px-6">{date}</div>
            <div className="px-4 py-5 sm:p-6">{(analysis?.summary)?.substring(0, 40) + "...."}</div>
            <div className="px-4 py-4 sm:px-6">{analysis?.mood}</div>
        </div>
    )
}

export default EntryCard