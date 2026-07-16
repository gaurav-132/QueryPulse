import User from "../models/user.model.js";
import { pool } from "../db/connection.js";

class UserRepository {
    constructor(poolArg = pool) {
        this.pool = poolArg;
    }

    async create(user) {
        const { rows } = await this.pool.query(
            `INSERT INTO users (first_name, last_name, name, email, mobile_no, password_hash)
            VALUES ($1,$2,$3,$4,$5,$6) RETURNING *`,
            [user.firstName, user.lastName, user.name, user.email, user.mobile, user.passwordHash]
        );
        return new User(rows[0]);
    }

    async findByEmail(email) {
        const { rows } = await this.pool.query(`SELECT * FROM users WHERE email = $1`, [email]);
        return rows[0] ? new User(rows[0]) : null;
    }

    async findById(id) {
        const { rows } = await this.pool.query(`SELECT * FROM users WHERE id = $1`, [id]);
        return rows[0] ? new User(rows[0]) : null;
    }
}

export default UserRepository;
