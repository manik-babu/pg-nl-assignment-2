import { pool } from "../../config/db";
import nodeCron from "node-cron";

nodeCron.schedule("0 0 * * *", async () => {
    try {
        await pool.query(`
      UPDATE vehicles
      SET status = 'returned'
      WHERE rent_end_date < NOW()
      AND status <> 'returned';
    `);
    } catch (error: any) {
        console.error("Cron error:", error);
    }
});

const formValidationError = async (payload: any) => {
    const { customer_id, vehicle_id, rent_start_date, rent_end_date } = payload;

    if (!customer_id || !vehicle_id || !rent_start_date || !rent_end_date) {
        return "Required fields cannot be empty";
    }

    const start_date = new Date(rent_start_date);
    const end_date = new Date(rent_end_date);
    if (end_date < start_date) {
        return "Rent end date must be after rent start date";
    }

    // checking availability
    const result = await pool.query(`SELECT * FROM vehicles WHERE id = $1`, [vehicle_id]);

    if (result.rowCount == 0) {
        return `Vehicle not found for id ${vehicle_id}`;
    }

    if (result.rows[0].availability_status == 'booked') {
        return "Vehicle is already booked";
    }

    return null;
}

const totalCost = async (vehicle_id: string, rent_start_date: string, rent_end_date: string) => {
    const vehicle = await pool.query(`SELECT * FROM vehicles WHERE id = $1`, [vehicle_id]);

    const start_date = new Date(rent_start_date).getTime();
    const end_date = new Date(rent_end_date).getTime();
    const rent_days = (end_date - start_date) / (1000 * 60 * 60 * 24);
    const total_cost = rent_days * vehicle.rows[0].daily_rent_price;

    return total_cost;
}
const createBooking = async (payload: any) => {
    const { customer_id, vehicle_id, rent_start_date, rent_end_date } = payload;

    const total_cost = await totalCost(vehicle_id, rent_start_date, rent_end_date);

    const tableInputs = [customer_id, vehicle_id, rent_start_date, rent_end_date, total_cost, "active"];
    const result = await pool.query(`INSERT INTO bookings(customer_id, vehicle_id, rent_start_date, rent_end_date, total_price, status) VALUES($1, $2, $3, $4, $5, $6) RETURNING *`, tableInputs);

    const updateVehicle = await pool.query(`UPDATE vehicles SET availability_status = $1 WHERE id = $2 RETURNING *`, ['booked', vehicle_id]);

    const data = {
        ...result.rows[0],
        vehicle: {
            vehicle_name: updateVehicle.rows[0].vehicle_name,
            daily_rent_price: updateVehicle.rows[0].daily_rent_price
        }
    }
    return data;
}
const getAllBookings = async () => {
    const result = await pool.query(`
            SELECT bookings.id AS booking_id, * FROM bookings
            JOIN users ON bookings.customer_id = users.id
            JOIN vehicles ON bookings.vehicle_id = vehicles.id
            `);

    if (result.rowCount == 0) {
        return {
            message: "No bookings found",
            data: []
        }
    }


    const bookings = result.rows;

    const formatedBookings = bookings.map((booking: any) => {
        return {
            id: booking.booking_id,
            customer_id: booking.customer_id,
            vehicle_id: booking.vehicle_id,
            rent_start_date: booking.rent_start_date,
            rent_end_date: booking.rent_end_date,
            total_price: booking.total_price,
            status: booking.status,
            customer: {
                name: booking.name,
                email: booking.email
            },
            vehicle: {
                vehicle_name: booking.vehicle_name,
                registration_number: booking.registration_number
            }
        }
    });

    return {
        message: "Bookings retrieved successfully",
        data: formatedBookings
    };
}

const getUsersBookings = async (userId: string) => {
    const result = await pool.query(`
            SELECT bookings.id AS booking_id, * FROM bookings  
            JOIN vehicles ON bookings.vehicle_id = vehicles.id
            WHERE bookings.customer_id = $1
            `, [userId]);
    if (result.rowCount == 0) {
        return {
            message: "No bookings found",
            data: []
        }
    }
    const bookings = result.rows;
    const formatedBookings = bookings.map((booking: any) => {
        return {
            id: booking.booking_id,
            vehicle_id: booking.vehicle_id,
            rent_start_date: booking.rent_start_date,
            rent_end_date: booking.rent_end_date,
            total_price: booking.total_price,
            status: booking.status,
            vehicle: {
                vehicle_name: booking.vehicle_name,
                registration_number: booking.registration_number,
                type: booking.type
            }
        }
    })
    return {
        message: "Bookings retrieved successfully",
        data: formatedBookings
    }
}

const isStartTimeOver = async (bookingId: string) => {
    const result = await pool.query(`SELECT * FROM bookings WHERE id = $1`, [bookingId]);

    if (result.rowCount == 0) {
        return null;
    }
    const booking = result.rows[0];
    const start_time = new Date(booking.rent_start_date).getTime();
    const currentTime = Date.now();
    if (start_time < currentTime) {
        return true;
    }
    else {
        return false;
    }
}
const updateBooking = async (bookingId: string, status: string) => {
    const result = await pool.query(`UPDATE bookings SET status = $1 WHERE id = $2 RETURNING *`, [status, bookingId]);
    const booking = result.rows[0];

    const vehicles = await pool.query(`UPDATE vehicles SET availability_status = $1 WHERE id = $2 RETURNING *`, ['available', booking.vehicle_id]);
    const vehicle = vehicles.rows[0];

    if (status == 'cancelled') {
        return {
            message: "Booking cancelled successfully",
            data: booking
        };
    }
    else {
        return {
            message: "Booking marked as returned. Vehicle is now available",
            data: {
                ...booking,
                vehicle: {
                    availability_status: vehicle.availability_status
                }
            }
        }
    }
}



const bookingService = {
    formValidationError,
    createBooking,
    getAllBookings,
    getUsersBookings,
    updateBooking,
    isStartTimeOver,
}
export default bookingService;