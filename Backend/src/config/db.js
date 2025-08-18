import mongoose from 'mongoose';

const mongoDB = async () => {
    mongoose.connection.on('connected',()=> console.log('Mongodb connected'));
    await mongoose.connect(`${process.env.MONGO_URI}/mern-auth`);
}

export default mongoDB;