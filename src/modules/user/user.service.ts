import { pool } from "../../config/db";

const getAllUsers = async () => {
    const result = await pool.query(`SELECT id, name, email, phone, role FROM users`);
    if (result.rowCount == 0) {
        return {
            message: "No users found",
            data: []
        }
    }

    return {
        message: "Users retrieved successfully",
        data: result.rows
    }
}
const permissionError = (userId: string, loggedInUser: any, data: any) => {
    if (loggedInUser.id != userId && loggedInUser.role != 'admin') {
        return "Insufficient permissions! You are not allowed to do this!";
    }
    if (loggedInUser.id == userId && !!data.role) {
        return "Only admin can change customers role";
    }
    return null;
}
const updateUser = async (userId: string, data: any) => {
    const result = await pool.query(`SELECT * FROM users WHERE id = $1`, [userId]);

    // returning null if not found any user
    if (result.rowCount == 0) {
        return null;
    }

    const updatedUser = {
        ...result.rows[0],
        ...data
    }
    const tableInputs = [updatedUser.name, updatedUser.email, updatedUser.phone, updatedUser.role, userId];
    const user = await pool.query(`UPDATE users SET name = $1, email = $2, phone = $3, role = $4 WHERE id = $5 RETURNING *`, tableInputs);

    return user.rows[0];

}

const existBookingByUser = async (userId: string) => {
    const result = await pool.query(`SELECT * FROM bookings WHERE customer_id = $1`, [userId]);
    if (result.rowCount != 0)
        return true;
    else
        return false;
}
const deleteUser = async (userId: string) => {
    const result = await pool.query(`DELETE FROM users WHERE id = $1 RETURNING *`, [userId]);
    if (result.rowCount == 0) {
        return null;
    }

    return result.rows[0];
}

const userService = {
    getAllUsers,
    permissionError,
    updateUser,
    existBookingByUser,
    deleteUser,
}
export default userService;