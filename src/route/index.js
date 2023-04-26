const Main = require('./mainRoute')
function route(app) {
    app.use('/', Main)
}
module.exports = route;