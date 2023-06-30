import mongoose from "mongoose";

const database = () => {
    mongoose.set('strictQuery', true);
    mongoose.connect(process.env.DB_URL).then(
        (data)=>{
            console.log(`Connected with server successfully on the port : ${data.connection.host}`);
        }
    )
    .catch((error)=> console.log(`${error} : error did not conneect`));
}
export default database;