import { Pool } from "pg";
import config from ".";

export const pool = new Pool({
    connectionString: config.connecting_str
})

const initDB = async () => {
    try {
        await pool.query(`
            CREATE TABLE IF NOT EXISTS users(
            id SERIAL PRIMARY KEY,
            name VARCHAR(300) NOT NULL,
            email VARCHAR(300) UNIQUE NOT NULL,
            password TEXT NOT NULL,
            phone VARCHAR(300) NOT NULL,
            role VARCHAR(100) NOT NULL
            )
            `);

        await pool.query(`
            CREATE TABLE IF NOT EXISTS vehicles(
            id SERIAL PRIMARY KEY,
            vehicle_name TEXT NOT NULL,
            type VARCHAR(200) NOT NULL,
            registration_number VARCHAR(200) UNIQUE NOT NULL,
            daily_rent_price INT NOT NULL,
            availability_status VARCHAR(100) NOT NULL
            )
            `);

        await pool.query(`
            CREATE TABLE IF NOT EXISTS bookings(
            id SERIAL PRIMARY KEY,
            customer_id INT REFERENCES users(id) ON DELETE CASCADE,
            vehicle_id INT REFERENCES vehicles(id) ON DELETE CASCADE,
            rent_start_date DATE NOT NULL,
            rent_end_date DATE NOT NULL,
            total_price INT NOT NULL,
            status VARCHAR(100) NOT NULL
            )
            `)
        console.log("Table created!");

    } catch (error: any) {
        console.log(error.message);
    }
}

export default initDB;