import mongoose, { ConnectOptions } from "mongoose";
// import logger from "../logger";

/*-----------------------------------------------------------------
 * MongoDB Connection
 *-----------------------------------------------------------------*/
const connectToMongoDB = async (): Promise<void> => {
  const self = connectToMongoDB;

  const options: ConnectOptions = {};

  try {
    await mongoose.connect(process.env.ATLAS_URI as string, options);

    if (process.env.DEV === "true") {
      // mongoose.set("debug", true);
      console.log("MongoDB: Debug parameter Set");
      //   logger.info("MongoDB: Debug parameter Set");
    }
  } catch (err) {
    console.log(`MongoDB: Failed to connect to mongo on startup - retrying in 5 sec. ${err}`);
    // logger.error(`MongoDB: Failed to connect to mongo on startup - retrying in 5 sec. ${err}`);
    setTimeout(self, 5000);
  }
};

export default connectToMongoDB;
