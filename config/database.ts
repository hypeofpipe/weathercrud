import config from 'config';
import { ConnectionOptions, connect } from 'mongoose';

const connectDB = async () => {
  try {
    console.log('Trying to connect to the DB');
    const mongoURI: string = config.get('mongoURI');
    const options: ConnectionOptions = {
      useNewUrlParser: true,
      useCreateIndex: true,
      useUnifiedTopology: true,
      useFindAndModify: true,
    };
    await connect(mongoURI, options);
    console.log('MongoDB Connected...');
  } catch (err) {
    console.error('DB error occured', err.message);
    // Exit process with failure
    process.exit(1);
  }
};

export default connectDB;
