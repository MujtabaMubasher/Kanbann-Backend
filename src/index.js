import connectionDB from "./db/index.js";
import dotenv from "dotenv"
import { app } from "./app.js";

dotenv.config()

connectionDB()
.then(() => {
  
    app.on('error', (error)=>{
        console.log(`Enable to get response from Server: ${error} `);
    })
    
    
    app.listen(process.env.PORT || 8000)
    {
        console.log(`⚙️ Server is running at port : ${process.env.PORT}`);
    }
    
}).catch((err) => {

    console.log(`Enable to  connect with MONGODB:  ${err}`);
    
});
