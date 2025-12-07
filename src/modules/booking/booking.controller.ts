import { Request, Response } from "express";
import bookingService from "./booking.service";
import { pool } from "../../config/db";
import { JwtPayload } from "jsonwebtoken";

const createBooking = async (req: Request, res: Response) => {
    try {
        const formValidationError = await bookingService.formValidationError(req.body);

        // error response
        if (formValidationError) {
            return res.status(400).json({
                success: false,
                message: "Vehicle booking failed",
                errors: formValidationError
            })
        }

        const result = await bookingService.createBooking(req.body);

        // success response
        res.status(201).json({
            success: true,
            message: "Booking created successfully",
            data: result
        });

    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: 'Internal server error!',
            errors: error.message
        });
    }
}
const getAllBookings = async (req: Request, res: Response) => {
    const { id, role } = req.loggedInUser as JwtPayload;
    try {
        console.log({ id, role });
        var result;
        if (role == "admin") {
            result = await bookingService.getAllBookings();
        }
        else {
            result = await bookingService.getUsersBookings(id);
        }

        res.status(200).json({
            success: true,
            message: result.message,
            data: result.data
        });

    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: 'Internal server error!',
            errors: error.message
        });
    }
}
const updateBooking = async (req: Request, res: Response) => {
    const { bookingId } = req.params;
    const { role } = req.loggedInUser as JwtPayload;
    const { status } = req.body;
    try {
        if (role != 'admin' && status == 'returned') {
            return res.status(403).json({
                success: false,
                message: "Booking update failed!",
                errors: "Insufficient permissions! You are not allowed to do this!"
            })
        }

        const isStartTimeOver = await bookingService.isStartTimeOver(bookingId!);
        if (isStartTimeOver == null) {
            return res.status(404).json({
                success: false,
                message: "Booking update failed!",
                errors: `Booking not found for id ${bookingId}`
            })
        }

        if (isStartTimeOver == true) {
            return res.status(400).json({
                success: false,
                message: "Booking update failed!",
                errors: `Booking start time is over`
            })
        }

        const result = await bookingService.updateBooking(bookingId!, status);

        res.status(200).json({
            success: true,
            message: result.message,
            data: result.data
        });

    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: 'Internal server error!',
            errors: error.message
        });
    }
}
const bookingController = {
    createBooking,
    getAllBookings,
    updateBooking,
}
export default bookingController;