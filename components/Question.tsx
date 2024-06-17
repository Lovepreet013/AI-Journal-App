'use client'

import { askQuestion } from "@/utils/api"
import { useState } from "react"

const Question = () => {

    const [value, setValue] = useState("")
    const [loading, setLoading] = useState(false)
    const [response, setResponse] = useState("")

    const onChange = (e) => {
        return setValue(e.target.value)
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)

        const answer = await askQuestion(value)

        setResponse(answer)

        setValue("")
        setLoading(false)
    }

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <input disabled={loading} className="border border-gray-300 p-2 text-lg " type="text" value={value} onChange={onChange} placeholder="Ask about journals" />
                <button className="bg-blue-400 px-6 py-2.5" type="submit" disabled={loading}>Ask</button>
            </form>

            {loading && <div>...loading</div>}
            {response && <div>{response}</div>}
        </div>
    )
}
export default Question