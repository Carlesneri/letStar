const app = require('./server')
const https = require ('https')
const fs = require('fs')
const path = require('path')

// app.listen(app.get('PORT'), () => {
//     console.log('Server listening on port:' + app.get('PORT'));
// })
const privateKey = fs.readFileSync(path.join(__dirname, '../SSL/private.key'), 'utf8')
const certificate = fs.readFileSync(path.join(__dirname, '../SSL/certificate.crt'), 'utf8')
const caBundle = fs.readFileSync(path.join(__dirname, '../SSL/ca_bundle.crt'), 'utf8')


https.createServer({
    key: privateKey,
    cert: certificate,
    ca: caBundle
}, app)
    .listen(app.get('PORT'), () => console.log('Server listening on port:' + app.get('PORT')))