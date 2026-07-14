import Customer from "../models/customer.model.js";

class CustomerRepository {
    constructor(pool) {
        this.pool = pool;
    }

    async findByApiKey(apiKey) {
        const { rows } = await this.pool.query(
        `SELECT * FROM ${Customer.tableName} WHERE api_key = $1`,
        [apiKey]
        );
        return rows[0] ? new Customer(rows[0]) : null;
    }
}

export default CustomerRepository;