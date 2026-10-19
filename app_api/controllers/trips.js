const mongoose = require('mongoose');
const Trip = require('../models/travlr');
const Model = mongoose.model('trips');

const tripsList = async(req, res) => {
    try {
        const { search, maxPrice, sort } = req.query;
        const filter = {};


        if (search && search.trim()) {
        //search treated as text
            const safeSearch = search.trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

            filter.$or = [
                { name: { $regex: safeSearch, $options: 'i' } },
                { resort: { $regex: safeSearch, $options: 'i' } },
                { code: { $regex: safeSearch, $options: 'i' } },
            ];
        }


        if (maxPrice !== undefined) {
            const price = Number(maxPrice);

            if (!Number.isFinite(price) || price < 0) {
                return res.status(400).json({
                    message: 'Invalid max price'
                });
            }
            filter.perPerson = { $lte: price };
        }
        const sortOptions = {
            name: { name: 1 },
            priceAsc: { perPerson: 1 },
            priceDesc: { perPerson: -1 }
        };
        const sortOrder = sortOptions[sort] || { name: 1 };

        let query = Model.find(filter).sort(sortOrder);

        if (req.query.page !== undefined || req.query.limit !== undefined) {
            const page = Number(req.query.page ?? 1);
            const limit = Number(req.query.limit ?? 10);

            if (!Number.isInteger(page) || page < 1 ||
                !Number.isInteger(limit) || limit < 1 || limit > 100) {
                return res.status(400).json({
                    message: 'Invalid pagination parameters'
                });
            }
            query = query.skip((page - 1) * limit).limit(limit);
        }
        const trips = await query.exec();

        return res.status(200).json(trips);
    }
    catch(err) {
        console.error(err);
        return res
            .status(500)
            .json({message: "Internal server error"})

    }   
    }
const tripsUpdateTrip = async (req, res) => {
    // Uncomment for debugging
    //console.log(req.params);
    //console.log(req.body);

    try {
        const updatedTrip = await Model.findOneAndUpdate(
            { code: req.params.tripCode },
            {
                code: req.body.code,
                name: req.body.name,
                length: req.body.length,
                start: req.body.start,
                resort: req.body.resort,
                perPerson: req.body.perPerson,
                image: req.body.image,
                description: req.body.description
            },
            { new: true, runValidators: true } // returns the updated document and runs schema validators
        ).exec();

        if (!updatedTrip) {
            // Database returned no data
            return res.status(404).json({ message: "Trip not found" });
        } else {
            // Return resulting updated trip
            return res.status(200).json(updatedTrip);
        }

        // Uncomment the following line to show results of operation on the console
        // console.log(updatedTrip);

    } catch (err) {
        console.error(err);
        if (err.name === 'ValidationError') {
            return res.status(400).json({ message: "Invalid trip data" });
        }
        return res
            .status(500)
            .json({ message: "Internal server error" });
    }
}

//removed redundant module.export()


//replaced error coding with try/catch block

const tripsFindByCode = async (req, res) => {
    try {
        const trip = await Model
            .findOne({ 'code': req.params.tripCode }) //returns single trip
            .exec();

        //console.log(q)

        if (!trip) {
            return res
                .status(404)
                .json({ message: "Trip not found" });
        }

        return res
            .status(200)
            .json(trip);
    }
    catch (err) {
        console.error(err);
        return res
            .status(500)
            .json({ message: "Internal server error" });

    }
    }  
    
const tripsAddTrip = async (req, res) => {
    try {
        const newTrip = new Trip({
            code: req.body.code,
            name: req.body.name,
            length: req.body.length,
            start: req.body.start,
            resort: req.body.resort,
            perPerson: req.body.perPerson,
            image: req.body.image,
            description: req.body.description
        });
        const savedTrip = await newTrip.save();

        return res
            .status(201)
            .json(savedTrip);

    }
    catch (err) {
        console.error(err);

        if (err.name === 'ValidationError') {
            return res
                .status(400)
                .json({ message: "Invalid trip data" });
        }
        if (err.code === 11000) {
            return res
                .status(409)
                .json({ message: "Trip code already exists" }); //added dup entry check
        }
        return res
            .status(500)
            .json({ message: "Internal server error" });
    }
    }
    
module.exports = {
    tripsList,
    tripsFindByCode,
    tripsAddTrip,
    tripsUpdateTrip
}