

module.exports = connectDB = async () => {
    try {
        await require("mongoose").connect(process.env.MONGO_URL);
        console.log('DB connected');
    } catch (error) {
        console.log('error in connectDB', error.message);
    }
}