import dotenv from "dotenv";
dotenv.config();

import mongoose from "mongoose";

const connectDB = async () => {
    mongoose.connection.on('connected' , ()=> console.log('connected'))
    await mongoose.connect(`${process.env.MONgODB_URL}/w-hos`)
}

export default connectDB;
