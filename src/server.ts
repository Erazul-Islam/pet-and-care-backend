import mongoose from "mongoose";
import app from "./app";
import config from "./app/config";

async function main () {
    try{
        await mongoose.connect(config.DATABASE_URL as string)
        app.listen(config.port,() => {
            console.log(` Congratulation !! Your server is running on ${config.port} port`)
        })
    }
    catch (err){
        console.log(err)
    }
}

main()