import MeiliSearch from "meilisearch";
import config from "../config";
import { Document, Types } from "mongoose";
import { TPost } from "../modules/creating-post/post.interface";


const meiliClient = new MeiliSearch({
    host: config.meilisearch_Host as string,
    apiKey: config.meilisearch_api_key
})

export async function addDocumentToIndex(
    result: Document<unknown, object, TPost> & TPost & { _id: Types.ObjectId },
    indexKey: string) {

    const index = meiliClient.index(indexKey)

    const { _id, caption, description, photo } = result

    const document = {
        id: _id.toString(),
        caption,
        description,
        thumbnail: photo
    }

    try {
        await index.addDocuments([document])
    }
    catch (error) {
        console.log(error)
    }

}

export const deleteDocumentFromIndex = async (indexKey: string, id: string) => {
    const index = meiliClient.index(indexKey)

    try {
        await index.deleteDocument(id)
    }
    catch (error) {
        console.log(error)
    }
}

export const deleteMeiliSearch = async (indexKey : string) => {
    meiliClient.deleteIndex(indexKey)
}

export default meiliClient