// Import mongoose library for MongoDB object modeling
const mongoose = require('mongoose');

// Asynchronous function to connect to MongoDB
const connectDB = async () => {
    try {
        // Attempt to connect to MongoDB using the provided connection string
        const conn = await mongoose.connect(
            'mongodb+srv://MealMate:Aadi%404455@cluster0.mtk8y.mongodb.net/mydb',
            {
                // Recommended options for mongoose connection
                useNewUrlParser: true,
                useUnifiedTopology: true,
            }
        );
        // Log successful connection with host information
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (err) {
        // Log any connection errors and exit the process with failure
        console.error(`Error: ${err.message}`);
        process.exit(1);
    }
};

// Export the connectDB function for use in other modules
module.exports = connectDB;