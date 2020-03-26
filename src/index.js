const app = require('./server')
const http = require ('http')
const https = require ('https')
const fs = require('fs')
const path = require('path')
const dotenv = require('dotenv')

dotenv.config()

const privateKey = fs.readFileSync(path.join(__dirname, '../SSL/private.key'), 'utf8')
const certificate = fs.readFileSync(path.join(__dirname, '../SSL/certificate.crt'), 'utf8')
const caBundle = fs.readFileSync(path.join(__dirname, '../SSL/ca_bundle.crt'), 'utf8')

if(process.env.DEVELOPMENT = 'true'){
    http.createServer(app)
    .listen(app.get('PORT'), () => console.log('Server listening on port ', app.get('PORT')))

}else{
    console.log('Redirecting https');
    
    http.createServer((req, res) => {
            res.writeHead(301, { "Location": "https://" + req.headers['host'] + req.url });
            res.end();
        })
        .listen(app.get('PORT'), () => console.log('Server listening on port ', app.get('PORT')))

}

https.createServer({
    key: privateKey,
    cert: certificate,
    ca: caBundle
}, app)
    .listen(443, () => console.log('Server listening on port 443'))
