import mongoose from 'mongoose';

const connectDB = async () => {
    try {
        // connect() returns a promise, so we await it
        const conn = await mongoose.connect(process.env.MONGO_URI);
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error(`Error connecting to MongoDB: ${error.message}`);
        process.exit(1); // Exit the process with failure if DB connection fails
    }
};

export default connectDB;