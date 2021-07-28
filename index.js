const express = require('express')
const fetch = require('node-fetch')
require("dotenv").config()
const fs = require("fs")

express()
    .use(express.static("public"))
    .get("/", (req, res) => {
        fs.readFile(`${__dirname}/src/index.html`, "utf8", function (err, text) {
            res.send(text)
        })
    })
    .get("/api/comment", (req, res) => {
        if ("videoId" in req.query) {
            fetch(
                `https://www.googleapis.com/youtube/v3/commentThreads?part=snippet%2Creplies&maxResults=500&order=time&videoId=${req.query.videoId}&key=${process.env.googleApiToken}`
            ).then((req) => req.json()).then((data) => {
                if ("error" in data) {
                    console.warn("error:", data.error.code, data.error.message)
                    return res.json({
                        "error": {
                            "code": data.error.code,
                            "msg": data.error.message
                        }
                    })
                }
                res.json(data.items.map(function (item) {
                    let msg = item.snippet.topLevelComment.snippet
                    return {
                        id: item.id,
                        userId: msg.authorChannelId.value,
                        txtJs: msg.textOriginal,
                        txtHtml: msg.textDisplay,
                        authorName: msg.authorDisplayName,
                        avatar: msg.authorProfileImageUrl,
                        time: {
                            send: msg.publishedAt,
                            up: msg.updatedAt
                        }
                    }
                }))
            })
        }
    })
    .listen(3001, () => {
        console.log("web online")
    })