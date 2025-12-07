import { Request, Response } from "express"
import userService from "./user.service";
import { JwtPayload } from "jsonwebtoken";

const getAllUsers = async (req: Request, res: Response) => {

    try {
        const result = await userService.getAllUsers();

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
const updateUser = async (req: Request, res: Response) => {
    const { userId } = req.params;
    try {

        const permissionError = userService.permissionError(userId!, req.loggedInUser, req.body);

        // failed response
        if (permissionError) {
            return res.status(403).json({
                success: false,
                message: "User update failed!",
                errors: permissionError
            });
        }

        if (!!req.body.email && /[A-Z]/.test(req.body.email)) {
            return res.status(400).json({
                success: false,
                message: "User update failed!",
                errors: "Email cannot contain uppercase character"
            })
        }

        const result = await userService.updateUser(userId!, req.body);

        // user not found response
        if (!result) {
            return res.status(404).json({
                success: false,
                message: "User update failed!",
                errors: `User not found for id ${userId}`
            });
        }

        // success response
        res.status(200).json({
            success: true,
            message: "User updated successfully",
            data: result
        })


    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: 'Internal server error!',
            errors: error.message
        });
    }
}
const deleteUser = async (req: Request, res: Response) => {
    const { userId } = req.params;
    try {
        const isBooking = await userService.existBookingByUser(userId!);
        if (isBooking) {
            return res.status(400).json({
                success: false,
                message: "User deletion failed",
                errors: "User have one or more bookings"
            })
        }

        const result = await userService.deleteUser(userId!);

        // user not found response
        if (!result) {
            return res.status(404).json({
                success: false,
                message: "User deletion failed",
                errors: `User not found for id ${userId}`
            })
        }

        // success response
        res.status(200).json({
            success: true,
            message: "User deleted successfully"
        })



    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: 'Internal server error!',
            errors: error.message
        });
    }
}

const userController = {
    getAllUsers,
    updateUser,
    deleteUser,
}
export default userController;