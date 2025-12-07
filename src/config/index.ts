import dotenv from 'dotenv';
import path from 'path';
dotenv.config({ path: path.join(process.cwd(), '.env') });


const config = {
    port: process.env.PORT,
    connecting_str: process.env.CONNECTING_STR,
    jwt_secret: process.env.JWT_SECRET,
}

export default config;