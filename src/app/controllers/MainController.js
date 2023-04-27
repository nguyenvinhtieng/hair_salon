const fs = require('fs');
class MainController {
    renderHome(req, res, next) {
        res.render("./home");
    }

    renderServices(req, res, next) {
        res.render("./services");
    }

    getData(req, res, next) {
        let rawdata = fs.readFileSync('src/data.json');
        let data = JSON.parse(rawdata);
        return res.json({status: true, data: data});
    }

}

module.exports = new MainController();
