const mongoose = require('mongoose');

const gallerySchema = new mongoose.Schema({
    user: String,
    title: String,
    url: String
});


const Gallery = new mongoose.model("GALLERY", gallerySchema);

module.exports = Gallery;