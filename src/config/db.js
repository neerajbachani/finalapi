const mongoose = require("mongoose")

const mongodburl = "mongodb+srv://vinicreation:FCsEsMTDAFU21Ur4@cluster0.7rvkhzb.mongodb.net/?retryWrites=true&w=majority"

const connectDb = () => {
    return mongoose.connect(mongodburl);
}

module.exports={connectDb}