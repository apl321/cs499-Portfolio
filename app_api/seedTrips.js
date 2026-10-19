//Database connection 
require('dotenv').config();

const mongoose = require('mongoose');
const Trip = require('./models/travlr');

const host = process.env.DB_HOST || '127.0.0.1';
const dbURI = `mongodb://${host}/travlr`;

async function seedTrips() {
    try {
        await mongoose.connect(dbURI);//wait for database connection
        console.log('Connected to MongoDB');





        const destinations = [
            'Dublin',
            'London',
            'Madrid',
            'Lisbon',
            'Paris',
            'Berlin',
            'Bern',
            'Rome',
            'Warsaw',
            'Belgrade',
            'Pristina',
            'Oslo',
            'Helsinki',
            'Stockholm',
            'Amsterdam',
            'Copenhagen'

        ];
        const durations = [
            '3 days',
            '5 days',
            '7 days',
            '10 days',
            '14 days'
        ];

        const trips = [];

        for (let i = 0; i < 100; i++) {
            const destination = destinations[i % destinations.length];
            const duration = durations[i % durations.length];

            trips.push({
                code: `TEST${String(i + 1).padStart(3, '0')}`,
                name: `${destination} vacation ${1 + i}`,
                length: duration,
                start: new Date(2027, i % 12, 1 + (i % 28)),
                resort: `${destination} Hotel`,
                perPerson: 500 + (i % 20) * 100,
                image: 'reef1.jpg',
                description: `<p>Explore ${destination} on this ${duration} vacation.</p>`
            });
        }
            const codes = trips.map(trip => trip.code);
            const existing = await Trip.find({ code: { $in: codes } }).select('code');
            const existingCodes = new Set(existing.map(trip => trip.code));
            const newTrips = trips.filter(
                trip => !existingCodes.has(trip.code)
            );

            if (newTrips.length > 0 ){
                await Trip.insertMany(newTrips);
            }
            console.log(`Inserted ${newTrips.length} new trips`);
            }
        
    catch (error) {
        console.error('Seeding failed:', error);
        process.exitCode = 1;
    }
    finally {
        await mongoose.disconnect();
    }
}

seedTrips();