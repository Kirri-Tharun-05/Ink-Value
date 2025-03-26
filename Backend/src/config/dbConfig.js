const mongoose= require('mongoose');
const connectDB= async()=>{
    try{
        await mongoose.connect(process.env.MONGO_URL);
        console.log('Mongo DB connected Successfully');
    }
    catch(err){
        console.error('Mongo DB Connection Error : ',err);
        process.exit(1);
    }
};
module.exports=connectDB;