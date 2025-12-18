import { Request, Response } from "express";
import authService from "./auth.service";


const signup = async (req: Request, res: Response) => {
    try {
        // check form validations
        const validationError = await authService.formValidationError(req.body);
        if (validationError) {
            return res.status(400).json({
                success: false,
                message: "Accound creation faild!",
                errors: validationError
            });
        }

        // user creation
        const user = await authService.createUser(req.body);

        // success response
        res.status(201).json({
            success: true,
            message: "User registered successfully",
            data: user
        });
    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: 'Internal server error!',
            errors: error.message
        });
    }
}
const signin = async (req: Request, res: Response) => {
    const { email, password } = req.body;
    try {
        // form validation
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "Login faild!",
                errors: "Required fields cannot be empty"
            });
        }

        // user login
        const result = await authService.loginUser(email, password);

        if (!result) {
            return res.status(400).json({
                success: false,
                message: "Login faild!",
                errors: "Username or password incorrect!"
            });
        }

        // success response
        res.status(200).json({
            success: true,
            message: "Login successful",
            data: result,
        })

    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: 'Internal server error!',
            errors: error.message
        });
    }
}



const authController = {
    signup,
    signin,
}
export default authController;