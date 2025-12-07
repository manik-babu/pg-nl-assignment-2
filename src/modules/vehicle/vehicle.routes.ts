import { Router } from "express";
import vehicleController from "./vehicle.controller";
import auth from "../../middleware/auth";


//   /api/v1/vehicles
const router = Router();

router.post('/', auth("admin"), vehicleController.createVehicle);
router.get('/', vehicleController.getAllVehicles);
router.get('/:vehicleId', vehicleController.getAllVehicleById);
router.put('/:vehicleId', auth("admin"), vehicleController.updateVehicleById);
router.delete('/:vehicleId', auth("admin"), vehicleController.deleteVehicleById);


export const vehicleRoute = router;