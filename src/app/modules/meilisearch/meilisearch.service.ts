import meiliClient from "../../utils/meilisearch"


const getAllPosts = async (limit:number,searchTerm : string) => {

    const index = meiliClient?.index('posts')

    if(!index){
        throw new Error ("MeiliSearch client or index not found")
    }

    const searchString = searchTerm || ""

    try {
        const result = await index.search(searchString, {limit})
        console.log(result)

        return result
    }
    catch (error) {
        console.log(error)
    }
}

export const MeiliSearchServices = {
    getAllPosts
}