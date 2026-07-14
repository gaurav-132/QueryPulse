
import Customer from "../models/customer.model.js";
import { pool } from "../db/connection.js";

class CustomerRepository {
	constructor(poolArg = pool) {
		this.pool = poolArg;
	}

	async findByApiKey(apiKey) {
		const { rows } = await this.pool.query(
			`SELECT * FROM ${Customer.tableName} WHERE api_key = $1`,
			[apiKey]
		);
		return rows[0] ? new Customer(rows[0]) : null;
	}

	async createForUser(userId, customerName) {
		const apiKey = require("crypto").randomBytes(24).toString("hex");
		const { rows } = await this.pool.query(
			`INSERT INTO ${Customer.tableName} (user_id, customer_name, name, api_key, created_at)
			 VALUES ($1,$2,$3,$4,current_timestamp) RETURNING *`,
			[userId, customerName, customerName, apiKey]
		);
		return rows[0].api_key;
	}

	async findByUserId(userId) {
		const { rows } = await this.pool.query(
			`SELECT * FROM ${Customer.tableName} WHERE user_id = $1`,
			[userId]
		);
		return rows[0] ? new Customer(rows[0]) : null;
	}
}

export default CustomerRepository;