const mongoose = require('mongoose');
// Define the trip schema
const tripSchema = new mongoose.Schema({
//added space removal and made entry unique
code: { type: String, required: true, trim: true, unique: true }, 
name: { type: String, required: true, trim: true, index: true },
length: { type: String, required: true, trim: true },
start: { type: Date, required: true },
    resort: { type: String, required: true, trim: true },
//still scratching my head as to why this was a string. Improvement should allow sorting and comparisons between trips
perPerson: { type: Number, required: true, min: 0 }, 
image: { type: String, required: true, trim: true},
description: { type: String, required: true, trim: true }
});
const Trip = mongoose.model('trips', tripSchema);
module.exports = Trip;