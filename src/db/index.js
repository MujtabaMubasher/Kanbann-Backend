import mongoose from "mongoose"

const connectionDB = async () => {
    try {
        const objReturn = await mongoose.connect(process.env.MONGO_DB_URI)
        console.log("DB_MONGO Connected at the Host: ", objReturn.connection.host);
    } catch (error) {
        console.log("Enable to Connect to the DataBase: ", error);
        process.exit(1)
    }
}

export default connectionDB
 