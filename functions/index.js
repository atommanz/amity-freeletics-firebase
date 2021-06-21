const functions = require("firebase-functions");
// const { PubSub } = require('@google-cloud/pubsub');

const postService = require('./services/post')

// const pubsub = new PubSub();
const config = functions.config()
// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
// //
// exports.helloWorld = functions.https.onRequest(async (request, response) => {
//     // functions.logger.info("Hello logs!", { structuredData: true });
//     // response.send("Hello from Firebase!");
//     console.log("Pubsub Emulator:", process.env.PUBSUB_EMULATOR_HOST);

//     const msg = await pubsub.topic(config.env.topic).publishJSON({
//         foo: 'bar',
//         date: new Date()
//     }, { attr1: 'value' });

//     response.json({
//         published: msg
//     })

// });

exports.hashtag = functions.region('asia-southeast2').https.onRequest(async (request, response) => {
    const { hashtagName, size, page } = request.query
    let pageNumber = 1, sizeNumber = 5
    if (page) pageNumber = Number(page)
    if (size) sizeNumber = Number(size)

    if (!hashtagName) return response.json({ success: false, message: 'hashtagName not found' })
    const resElastic = await postService.getPostListByHashtag(hashtagName, pageNumber, sizeNumber)
    const { body: { hits } } = resElastic
    const postList = hits.hits.map(v => (v._id))
    const formatOut = {
        totalIndex: hits.hits.length,
        totalPage: Math.ceil(hits.hits.length / size),
        currentPage: pageNumber,
        posts: postList,
    }
    return response.json({ success: true, data: formatOut })

});


exports.ascEvent = functions.region('asia-southeast2').pubsub.topic(config.env.topic).onPublish(async (message, context) => {

    const jsonEvent = JSON.parse(Buffer.from(message.data, 'base64').toString())

    // 1. Check event type (didCreate, didUpdate, didDelete)
    // 2.1 IF(didCreate, didUpdate) Call post service by event didCreate
    if (jsonEvent.event === 'v3.post.didCreate' || jsonEvent.event === 'v3.post.didUpdate') {
        await postService.didCreate(jsonEvent.data)
    }

    // 2.2 IF(didDelete) Call post service by event didDelete
    else if (jsonEvent.event === 'v3.post.didDelete') {
        const { posts } = jsonEvent.data
        const { postId } = posts[0]
        await postService.didDelete(postId)
    }

    return null;

});

