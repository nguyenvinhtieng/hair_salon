const fs = require('fs');
class MainController {
    renderHome(req, res, next) {
        res.render("./home");
    }

    renderServices(req, res, next) {
        res.render("./services");
    }

    getServices(req, res, next) {
        let rawdata = fs.readFileSync('src/services.json');
        let services = JSON.parse(rawdata);
        return res.json({status: true, services: services});
    }

}

module.exports = new MainController();
