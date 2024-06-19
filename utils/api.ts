//fetch can't have relative URLs, we have to define the full path to fetch, so to make it dynamic we create a function, we can hardcode the fetch URL but we need fetch dynamic because if we not localhost our api not going to work
const createURL = (path : String) => {
    return window.location.origin + path
}

export const createNewEntry = async () => {
    const res = await fetch(
        new Request(createURL('/api/journal'), {
        method: 'POST'
        })
    )

    if(res.ok){
        const data = await res.json()
        return data.data
    }
}

export const updateEntry = async (id, content) => {
    const res = await fetch(
        new Request(createURL(`/api/journal/${id}`), {
            method : 'PATCH',
            body : JSON.stringify({content})
        })
    )

    if(res.ok){
        const data = await res.json()
        return data.data
    }
}

export const deleteEntry = async (id) => {
    const res = await fetch(
        new Request(createURL(`/api/journal/${id}`), {
            method : 'DELETE',
        })
    )

    if(res.ok){
        return res.json()
    }else {
        throw new Error("Something went wrong on API server!")
    }
}

export const askQuestion = async (question) => {
    const res = await fetch(
        new Request(createURL('/api/question'), {
            method : 'POST',
            body : JSON.stringify({question})
        })
    )

    if(res.ok){
        const data = await res.json()
        return data.data
    }
}