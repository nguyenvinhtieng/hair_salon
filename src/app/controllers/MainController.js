
const fs = require('fs');
const Booking = require('../models/Booking');
class MainController {
    renderHome(req, res, next) {
        res.render("./home");
    }

    renderServices(req, res, next) {
        res.render("./services");
    }
    renderOrders(req, res, next) {
        res.render("./orders");
    }
    renderAnalytics(req, res, next) {
        res.render("./analytics");
    }
    getData(req, res, next) {
        let rawdata = fs.readFileSync('src/data.json');
        let data = JSON.parse(rawdata);
        return res.json({status: true, data: data});
    }

    async booking(req, res, next) {
        let data = req.body;
        let booking = new Booking(data);
        await booking.save();
        return res.json({status: true, data: booking});
    }

    async getAllOrders(req, res, next) {
        let orders = await Booking.find({});
        return res.json({status: true, data: orders});
    }
    async deleteOrder(req, res, next) {
        let {ids} = req.body
        console.log("ids::", ids)
        await Booking.deleteMany({_id: {$in: ids}})
        return res.json({status: true});
    }
}

module.exports = new MainController();
