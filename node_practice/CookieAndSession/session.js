const http = require('http');
const queryString = require('querystring');
const crypto = require('crypto');
const uuid = require('uuid');
const factory = 'WYF';
const security = 'WYF';
const session = {
};

const sign = (value) => {
    return crypto.createHmac('sha256', security).update(value).digest('base64').replace(/\+|\/|\=/g,'')
}

http.createServer(function(req, res){
    let saveCookies = []
    res.getCookie = (key, options = {}) => {
        let cookies = req.headers['cookie']
        cookies =  queryString.parse(cookies, '; ')
        if( cookies[key]){
            let [item, value] =  cookies[key].split('.')
            if(options.signed){
                if(value === sign(item)){
                    return item
                }
                return 'noooooob'
            }
            return cookies[key].split('.')[0]
        }else{
            return ''
        }
    }
    res.setCookie = ( key, value, options={} ) => {
        let arr = []
        let cookie = `${key}=${value}`
        if(options.httpOnly){
            arr.push(`httpOnly=${options.httpOnly}`)
        }
        if(options.domain){
            arr.push(`domain=${options.expires}`)
        }
        if(options.maxAge){
            arr.push(`max-age=${options.maxAge}`)
        }
        if(options.signed){
            cookie = cookie + '.' + sign(value);
        }
        saveCookies.push(`${cookie}; ${arr.join(': ')}`)
        res.setHeader('Set-Cookie', saveCookies)
    }
    if(req.url === '/visit') {
        let card =res.getCookie(factory,{signed: true})
        if (card && session[card] ) {
            session[card].visit++
            res.setHeader('Content-Type', 'text/html; charset=utf-8')
            res.end(`这是你第${session[card].visit}次来`)
        } else {
            let cardId = uuid.v4()
            res.setHeader('Content-Type', 'text/html; charset=utf-8')
            res.setCookie(factory,cardId,{signed: true})
            session[cardId] = {
                visit: 1
            }
            res.end(`这是你第1次来`)
        }
    } else {
        res.end('not fount')
    }
}).listen(3000)