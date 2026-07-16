import crypto from "crypto"; // fixed: proper ESM import, not require()
import Customer from "../models/customer.model.js";
import { pool } from "../db/connection.js";

class CustomerRepository {
	constructor(poolArg = pool) {
		this.pool = poolArg;
	}

	async findByApiKey(apiKey) {
		const { rows } = await this.pool.query(
			`SELECT * FROM ${Customer.tableName} WHERE api_key = $1 AND subscription_activated = true`,
			[apiKey]
		);
		return rows[0] ? new Customer(rows[0]) : null;
	}

	async findByUserId(userId) {
		const { rows } = await this.pool.query(
			`SELECT * FROM ${Customer.tableName} WHERE user_id = $1`,
			[userId]
		);
		return rows[0] ? new Customer(rows[0]) : null;
	}

  /**
   * Called at registration. Creates an INACTIVE customer record —
   * no API key yet. api_key stays NULL until activateSubscription runs.
   */
	async createForUser(userId) {
		const { rows } = await this.pool.query(
			`INSERT INTO ${Customer.tableName} (user_id, subscription_activated, created_at)
			VALUES ($1, false, current_timestamp) RETURNING *`,
			[userId]
		);
		return new Customer(rows[0]);
	}

 
	async activateSubscription(userId) {
		const apiKey = crypto.randomBytes(24).toString("hex");
		const { rows } = await this.pool.query(
			`UPDATE ${Customer.tableName}
			SET api_key = $1, subscription_activated = true
			WHERE user_id = $2
			RETURNING *`,
			[apiKey, userId]
		);
		if (rows.length === 0) {
			throw new Error("No customer record found for this user");
		}
		return new Customer(rows[0]);
		}
}

export default CustomerRepository;