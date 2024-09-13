import mongoose from 'mongoose';

export const initDb = async (): Promise<typeof mongoose> => {
  try {
    const db = await mongoose.connect(process.env.MONGO_URL, {
      dbName: 'orca',
      useCreateIndex: true,
      useNewUrlParser: true,
      useFindAndModify: false,
      useUnifiedTopology: true,
    });
    console.log('DB connected');
    return db;
  } catch (error) {
    console.error('DB connection failed', error);
    process.exit(1);
  }
};
