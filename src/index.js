const app = require('./server')

app.listen(app.get('PORT'), () => {
    console.log('Server listening on http://localhost:' + app.get('PORT'));
})
