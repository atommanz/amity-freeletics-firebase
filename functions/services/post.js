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

async function getPostList(hashtag, page, size, content) {
    let query = {}
    if (hashtag && content) {
        query = {
            bool: {
                must: []
            }
        }
        if (hashtag) query.bool.must.push({ match: { hashtag } })
        if (hashtag) query.bool.must.push({ wildcard: { content: `*${content}*` } })
    }
    else if (hashtag) query.match = { hashtag }
    else if (content) query.wildcard = { content: `*${content}*` }

    const postList = await client.search({
        index: 'post',
        body: {
            from: (page - 1) * size,
            size,
            query,
            sort: [
                { updatedAt: 'desc' },
                { _id: 'asc' }
            ]
        }
    })
    return postList
}

module.exports = {
    didCreate, didDelete, getPostList
}