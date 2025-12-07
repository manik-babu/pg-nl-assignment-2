import express, { Request, Response } from "express";
import initDB from "./config/db";
import { authRoute } from "./modules/auth/auth.routes";
import { vehicleRoute } from "./modules/vehicle/vehicle.routes";
import { userRoute } from "./modules/user/user.routes";
import { bookingRoute } from "./modules/booking/booking.routes";

const app = express();
app.use(express.json());
app.use(express.urlencoded());


// initializing database table
initDB();

// routes
app.use("/api/v1/auth", authRoute);
app.use("/api/v1/vehicles", vehicleRoute);
app.use("/api/v1/users", userRoute);
app.use("/api/v1/bookings", bookingRoute);

app.get('/', (req: Request, res: Response) => {
    res.status(200).json({
        success: true,
        message: "Hello world!"
    })
})

app.use((req: Request, res: Response) => {
    res.status(404).json({
        success: false,
        message: "Path not found!",
        errors: `${req.method}: ${req.url}`
    })
})



export default app;