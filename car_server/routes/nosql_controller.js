var nosql = require('nosql').load('./database/db.nosql');
var d = new Date();
var t = Math.round(d.getTime() / (1000 * 60));

function init_car() {
    var car = {
        "timestamp": {
            "minutes_70": t,
            "minutes": d.getMinutes(),
            "day": d.getDate(),
            "month": d.getMonth(),
            "year": d.getFullYear()
        },
        "sensordata": {
            "levels": {
                "fuel": Math.floor((Math.random() * 100) + 1),
                "oil": Math.floor((Math.random() * 100) + 1),
                "brake_fluid": Math.floor((Math.random() * 100) + 1),
                "windshield_washer_fluid": Math.floor((Math.random() * 100) + 1)
            },
            "engine_RPM": Math.floor((Math.random() * 100) + 1),
            "temperatures": {
                "engine": Math.floor((Math.random() * 100) + 1),
                "outside": Math.floor((Math.random() * 100) + 1)
            }
        }
    }
    return car;
}
// var last = function(err, selected) {
//     console.log(selected[selected.length-1]);
//     selected.forEach(function(o) {
//         exports.last = o;
//     });
// };
var last = function(err, selected) {
    exports.last = selected[selected.length - 1];
};
// var map = function(doc) {
//     if (doc["timestamp"]["minutes_70"] == t) return doc;
// };
exports.read_last = function() {
    nosql.all(last);
};
exports.insert = function() {
    nosql.insert(init_car());
};