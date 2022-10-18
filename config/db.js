import mongoose from "mongoose";

const dbConnect = async () => {
  try {
    const connection = await mongoose.connect(
      // "mongodb+srv://admin:xkj9bjf9HFW.fdu_evp@cluster0.lguxo.mongodb.net/TEST2?retryWrites=true&w=majority"
      process.env.MONGO_URI
      ,
      { useNewUrlParser: true, useUnifiedTopology: true }
    );
    const url = `${connection.connection.host}:${connection.connection.port}`;
    console.log(`Mongo DB connected at: ${url}`);
  } catch (error) {
    console.log(`error: ${error.message}`);
    process.exit(1);
  }
};

export default dbConnect;
