'use client'

import { updateEntry } from "@/utils/api"
import { useState } from "react"
import { useAutosave } from "react-autosave"
import Spinner from "./Spinner"

const Editor = ({entry}) => {
    const [value, setValue] = useState(entry.content)
    const [isLoading, setIsLoading] = useState(false)
    const [analysis, setAnalysis] = useState(entry.analysis)

    const {mood, summary, subject, negative, color} = analysis

    const analysisData = [
        {name : 'Subject', value : subject},
        {name : 'Summary', value : summary},
        {name : 'Mood', value : mood},
        {name : 'Negative', value : negative ? 'True' : 'False'},
    ]

    useAutosave({
        data : value,
        onSave : async (_value) => {
            setIsLoading(true)
            const data = await updateEntry(entry.id, _value)  //this function is calling updateEntry util function which then calls the PATCH api...
            setAnalysis(data.analysis)
            setIsLoading(false)
        }
    })

    return (
        <div className="w-full h-full grid grid-cols-3">
            <div className="col-span-2">
                {isLoading && <Spinner/>}
                <textarea
                    className="w-full h-full p-8 text-xl outline-none"
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                />
            </div>

            <div className="border-l border-black/10">
                <div className="px-6 py-10" style={{backgroundColor : color}}>
                    <h2 className="text-2xl">Analysis</h2>
                </div>
                <div>
                    <ul>
                        {analysisData.map((data) => (
                            <li key={data.name} className="flex justify-between items-center px-2 py-3 border-t border-b border-black/10">
                                <span className="text-lg font-semibold">{data.name}</span>
                                <span>{data.value}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    )
}

export default Editor