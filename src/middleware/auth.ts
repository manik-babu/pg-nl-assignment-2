import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from 'jsonwebtoken';
import config from "../config";

const auth = (...roles: string[]) => {
    return (req: Request, res: Response, next: NextFunction) => {

        try {
            const token = req.headers.authorization?.split(" ")[1];
            const decodedToken = jwt.verify(token as string, config.jwt_secret as string) as JwtPayload;
            if (!decodedToken) {
                return res.status(401).json({
                    success: false,
                    message: "Vehicle creation failed!",
                    errors: "Missing or invalid authentication token",
                })
            }

            if (!roles.includes(decodedToken.role)) {
                return res.status(403).json({
                    success: false,
                    message: "Vehicle creation failed!",
                    errors: "Insufficient permissions! You are not allowed to do this!"
                })
            }

            req.loggedInUser = decodedToken;
            next();
        } catch (error: any) {
            res.status(500).json({
                success: false,
                message: 'Internal server error!',
                errors: error.message
            });
        }

    }
}

export default auth;