const http = require('http')
const url = require('url')
const queryString = require('querystring')
const fs = require('fs')

const getGameAnswer = require('./computer')
let playerWon = 0
let sameTimes = 0
let playerLastAction

http.createServer(function (request, response) {
    console.log('111')
    const parseUrl = url.parse(request.url)

    if (parseUrl.pathname === '/favicon.ico') {
        console.log('121')
        response.writeHead(200)
        response.end()
        return
    }

    if (parseUrl.pathname === '/game') {
        console.log('222')
        const query = queryString.parse(parseUrl.query)
        const playerAction = query.action

        if (playerWon > 4 && sameTimes === 9) {
            response.writeHead(400)
            response.end('我再也不和你玩了')
            return
        }
        
        if (sameTimes >3) {
            response.writeHead(400)
            response.end('你作弊了！！')
            sameTimes = 9
            return
        }

        if (playerLastAction && playerLastAction === playerAction) {
            sameTimes++
        } else {
            sameTimes = 0
        }
        playerLastAction = playerAction

        const gameAnswer = getGameAnswer(playerAction)
        response.writeHead(200)
        if(gameAnswer === 0){
            response.end('平局了')
        } else if (gameAnswer === -1) {
            response.end('辣鸡，你输了')
        } else {
            response.end('算你厉害，你赢了，再战一回合？')
            playerWon++
        }
    }

    if (parseUrl.pathname = '/') {
        console.log('123')
        fs.createReadStream(__dirname + '/index.html').pipe(response)
    }
}).listen(3000)