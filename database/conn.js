const mongoose = require("mongoose");

mongoose.connect(process.env.DB).then(() => {
    console.log("connection established...!");
}).catch((err) => {
    console.log(err);
})