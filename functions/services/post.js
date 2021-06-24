const client = require('../elasticsearch')
const findHashtag = require('./findHashtag')


async function didCreate(eventData) {
    const { posts } = eventData
    const { postId, postedUserId, data, dataType, createdAt, updatedAt, isDeleted } = posts[0]
   if (dataType !== 'text') {
        throw new Error(`cannot create postType ${dataType} to elastic`)
    }
    const hashTagList = await findHashtag(data.text)
    if (!hashTagList) { return false }
   
    const created = await client.index({
        index: 'post',
        id: postId,
        body: {

            content: data.text,
            hashtag: hashTagList,
            createdBy: postedUserId,
            createdAt: new Date(createdAt).getTime(),
            updatedAt: new Date(updatedAt).getTime(),
        }
    })
    return created
}


async function didDelete(postId) {
    const deleted = await client.deleteByQuery({
        index: 'post',
        body: {
            query: {
                match: { _id: postId }
            }
        }
    })
    return deleted
}

async function getPostListByHashtag(hashtag, page, size) {
    const postList = await client.search({
        index: 'post',
        body: {
            from: (page - 1) * size,
            size,
            query: {
                match: { hashtag }
            },
            sort: [
                { updatedAt: 'desc' },
                { _id: 'asc' }
            ]
        }
    })
    return postList
}

async function getPostListByContent(search, page, size) {
    const postList = await client.search({
        index: 'post',
        body: {
            from: (page - 1) * size,
            size,
            query: {
                wildcard: { content:search }
            },
            sort: [
                { updatedAt: 'desc' },
                { _id: 'asc' }
            ]
        }
    })
    return postList
}

module.exports = {
    didCreate, didDelete, getPostListByHashtag,getPostListByContent
}