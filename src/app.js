import express from "express"
import cookieParser from "cookie-parser";
import cors from 'cors'


const app = express()

app.use(cors({
    origin: "http://localhost:5173",
    credentials: true,
}))

app.use(cookieParser())
app.use(express.json({limit: "16kb"}))
app.use(express.urlencoded({extended:true, limit:"16kb"}))
app.use(express.static('public'))


// import Routes

import userRouter from "./routes/user.routes.js";
import todoRouter from "./routes/todo.routes.js";

//routes Declaration

app.use('/api/v1/users', userRouter )
app.use('/api/v1/todos', todoRouter )


export {app}