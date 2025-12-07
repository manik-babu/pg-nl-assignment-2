import { Request, Response } from "express";
import vehicleService from "./vehicle.service";

const createVehicle = async (req: Request, res: Response) => {
    try {
        const formValidationError = await vehicleService.formValidationError(req.body);
        // Error response
        if (formValidationError) {
            return res.status(400).json({
                success: false,
                message: "Vehicle creation faild!",
                errors: formValidationError
            })
        }

        // vehicle creation
        const vehicle = await vehicleService.createVehicle(req.body);

        // success response
        res.status(201).json({
            success: true,
            message: "Vehicle created successfully",
            data: vehicle
        });

    } catch (error: any) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: 'Internal server error!',
            errors: error.message
        });
    }
}
const getAllVehicles = async (req: Request, res: Response) => {
    try {
        const result = await vehicleService.getAllVehicles();

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
const getAllVehicleById = async (req: Request, res: Response) => {
    const { vehicleId } = req.params;
    try {
        const vehicle = await vehicleService.getAllVehicleById(vehicleId!);

        // not found response
        if (!vehicle) {
            return res.status(404).json({
                success: false,
                message: "Vehicle retrieve failed",
                errors: `Vehicle not found for id ${vehicleId}`
            })
        }

        // success response
        res.status(200).json({
            success: true,
            message: "Vehicle retrieved successfully",
            data: vehicle
        })

    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: 'Internal server error!',
            errors: error.message
        });
    }
}
const updateVehicleById = async (req: Request, res: Response) => {
    const { vehicleId } = req.params;
    try {
        const result = await vehicleService.updateVehicleById(vehicleId!, req.body);

        // not found response
        if (!result) {
            return res.status(404).json({
                success: false,
                message: "Vehicle update failed",
                errors: `Vehicle not found for id ${vehicleId}`
            })
        }

        // success response
        res.status(200).json({
            success: true,
            message: "Vehicle updated successfully",
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
const deleteVehicleById = async (req: Request, res: Response) => {
    const { vehicleId } = req.params;
    try {
        const result = await vehicleService.deleteVehicleById(vehicleId!);

        // not found response
        if (result.rowCount == 0) {
            return res.status(404).json({
                success: false,
                message: "Vehicle deletion failed",
                errors: `Vehicle not found for id ${vehicleId}`
            })
        }

        // success response 
        res.status(200).json({
            success: true,
            message: "Vehicle deleted successfully"
        })

    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: 'Internal server error!',
            errors: error.message
        });
    }
}

const vehicleController = {
    createVehicle,
    getAllVehicles,
    getAllVehicleById,
    updateVehicleById,
    deleteVehicleById,
};
export default vehicleController;