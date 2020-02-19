const http = require('http');
const queryString = require('querystring');
const crypto = require('crypto');
let security = 'WYF'
const sign = (value) => {
    return crypto.createHmac('sha256', security).update(value).digest('base64').replace(/\+|\/|\=/g,'')
}

http.createServer(function(req, res){
    let saveCookies = []
    res.getCookie = (key, options = {}) => {
        let cookies = req.headers['cookie']
        cookies =  queryString.parse(cookies, '; ')
        let [item, value] =  cookies[key].split('.')
        console.log(111,item)
        console.log(sign(item),value);
        if(options.signed){
            if(value === sign(item)){
                return item
            }
            return 'noooooob'
        }
        return cookies[key].split('.')[0]
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
    if(req.url === '/read') {
        res.end(res.getCookie('name', {signed: true}) || 'null')
    }else if(req.url === '/write' ) {
        res.setCookie('name', 'wangyifei', {signed: true})
        res.setCookie('age', '12')
        res.end('write')
    } else {
        res.end('not fount')
    }
}).listen(3000)