// Get Travel View
//var fs = require('fs');
//var trips = JSON.parse(fs.readFileSync('./data/trips.json', 'utf8'));

const tripsEndpoint = "http://localhost:3000/api/trips"
const options = {
  method: "GET",
  headers: {
    Accept: "application/json",
  },
};

const travel = async (req, res, next) => {
  await fetch(tripsEndpoint, options)
    .then((res) => res.json())
    .then((json) => {
      let message = null;
      if(!(json instanceof Array)) {
        message = "API Lookup Error";
        json = [];
      } else {
        if(!json.length) {
          message = "No Trips Exist In Our Database";
        }
      }
      res.render("travel", {title: "Travlr Gateways", trips: json, message});
    })
    .catch((err) => res.status(500).send(err.message));
};

//const travel = (req, res) => {
//  res.render("travel", {title: "Travlr Gateways", trips});
//}

module.exports = { travel, };
