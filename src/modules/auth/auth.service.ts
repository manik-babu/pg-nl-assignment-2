import { pool } from "../../config/db";
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import config from "../../config";


const formValidationError = async (payload: any) => {
    const { name, email, password, phone, role } = payload;

    // input field validation
    if (!name || !email || !password || !phone || !role) {
        return "Required fields cannot be empty"
    }

    // email character validation
    if (/[A-Z]/.test(email)) {
        return "Email cannot contain uppercase character";
    }

    // password length validation
    if (password.length < 6) {
        return "Password can't be less than 6 characters"
    }

    // role validation 'admin' or 'customer'
    if (role != 'admin' && role != 'customer') {
        return "Role can be only 'admin' or 'customer'";
    }

    // Duplicate email validation
    const isExistUser = await pool.query(`SELECT * FROM users WHERE email = $1`, [email]);
    if (isExistUser.rowCount) {
        return "User with this email already exist"
    }

    return null;
}
const createUser = async (payload: any) => {
    const { name, email, password, phone, role } = payload;

    const hashedPassword = await bcrypt.hash(password, 10);

    const result = await pool.query(`INSERT INTO users(name, email, password, phone, role) VALUES($1, $2, $3, $4, $5) RETURNING *`, [name, email, hashedPassword, phone, role]);

    const user = result.rows[0];

    delete user.password;

    return user;
}
const loginUser = async (email: string, password: string) => {
    const result = await pool.query(`SELECT * FROM users WHERE email = $1`, [email]);
    if (result.rowCount == 0) {
        return null;
    }

    const user = result.rows[0];

    const isMatchPassword = await bcrypt.compare(password, user.password);
    if (!isMatchPassword) {
        return null;
    }

    const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, config.jwt_secret!, {
        expiresIn: '30d'
    });

    delete user.password;

    return { token, user };
}


const authService = {
    createUser,
    formValidationError,
    loginUser,
}

export default authService;