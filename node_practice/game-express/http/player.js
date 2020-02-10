const express = require('express')
const fs = require('fs')
const app = express()
const getGameAnswer = require('./computer')
let playerWon = 0
let sameTimes = 0
let playerLastAction

app.get('/favicon.ico', function( req, res) {
    res.status(200)
    return 
})

app.get('/game' , 
    function( req, res, next) {
        if (playerWon > 4 || sameTimes === 9) {
            response.status(400)
            response.send('我再也不和你玩了')
            return
        }

        next()
        console.log('111', res.playerWon)
        if(res.playerWon) {
            playerWon++
        }
    },
    function (req, res, next) {
        const query = req.query
        const playerAction = query.action

        if (playerLastAction && playerLastAction === playerAction) {
            sameTimes++
            if (sameTimes >3) {
                response.status(400);
                response.send('你作弊！我再也不玩了');
                sameCount = 9
                return;
            }
        } else {
            sameTimes = 0
        }
        playerLastAction = playerAction

        res.playerAction = playerAction
        next()
    },
    function (req, response) {
        const playerAction = response.playerAction;
        const result = getGameAnswer(playerAction);
        
        // 如果这里执行setTimeout，会导致前面的洋葱模型失效
        // 因为playerWon不是在中间件执行流程所属的那个事件循环里赋值的
        // setTimeout(()=> {
            response.status(200);
            if (result == 0) {
                response.send('平局')

            } else if (result == -1) {
                response.send('你输了')

            } else {
                response.send('你赢了')
                response.playerWon = true;

            }
        // }, 500)
    }
)

app.get('/', function (request, response) {
    // send接口会判断你传入的值的类型，文本的话则会处理为text/html
    // Buffer的话则会处理为下载
    response.send(
        fs.readFileSync(__dirname + '/index.html', 'utf-8')
    )
})

app.listen(3000);