import { pool } from "../../config/db";
const formValidationError = async (payload: any) => {
    const { vehicle_name, type, registration_number, daily_rent_price, availability_status } = payload;

    if (!vehicle_name || !type || !registration_number || !daily_rent_price || !availability_status) {
        return "Required fields cannot be empty";
    }
    if (daily_rent_price < 0) {
        return "Daily rent price cannot be negative";
    }
    if (availability_status != "available" && availability_status != "booked") {
        return "Available status can be only 'available' or 'booked'";
    }
    const vehicleTypes = ['car', 'bike', 'van', 'SUV']
    if (!vehicleTypes.includes(type)) {
        return "Vehicle type can be only 'car', 'bike', 'van' or 'SUV'";
    }

    const isRegistrationNumberExist = await pool.query(`SELECT * FROM vehicles WHERE registration_number = $1`, [registration_number]);
    if (isRegistrationNumberExist.rowCount != 0) {
        return "Vehicle with this registration number already exists";
    }


    return null;
}
const createVehicle = async (payload: any) => {
    const { vehicle_name, type, registration_number, daily_rent_price, availability_status } = payload;

    const result = await pool.query(`INSERT INTO vehicles(vehicle_name, type, registration_number, daily_rent_price, availability_status) VALUES($1, $2, $3, $4, $5) RETURNING *`, [vehicle_name, type, registration_number, daily_rent_price, availability_status]);

    return result.rows[0];
}
const getAllVehicles = async () => {
    const result = await pool.query(`SELECT * FROM vehicles`);
    if (result.rowCount == 0) {
        return {
            message: "No vehicles found",
            data: []
        };
    }

    return {
        message: "Vehicles retrieved successfully",
        data: result.rows
    };
}
const getAllVehicleById = async (vehicleId: string) => {
    const result = await pool.query(`SELECT * FROM vehicles WHERE id = $1`, [vehicleId]);
    if (result.rowCount == 0) {
        return null;
    }

    return result.rows[0];
}
const updateVehicleById = async (vehicleId: string, data: any) => {

    const existingVehicle = await pool.query(`SELECT * FROM vehicles WHERE id = $1`, [vehicleId]);
    if (existingVehicle.rowCount == 0) {
        return null;
    }

    const updatedVehicle = {
        ...existingVehicle.rows[0],
        ...data
    };
    const tableInputs = [updatedVehicle.vehicle_name, updatedVehicle.type, updatedVehicle.registration_number, updatedVehicle.daily_rent_price, updatedVehicle.availability_status, vehicleId];
    const result = await pool.query(`UPDATE vehicles SET vehicle_name = $1, type = $2, registration_number = $3, daily_rent_price = $4, availability_status = $5 WHERE id = $6 RETURNING *`, tableInputs);
    return result.rows[0];
}
const deleteVehicleById = async (vehicleId: string) => {
    const result = await pool.query(`DELETE FROM vehicles WHERE id = $1 RETURNING *`, [vehicleId]);
    return result;
}

const vehicleService = {
    formValidationError,
    createVehicle,
    getAllVehicles,
    getAllVehicleById,
    updateVehicleById,
    deleteVehicleById,
}
export default vehicleService;