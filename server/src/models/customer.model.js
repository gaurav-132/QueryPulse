class Customer {
    static tableName = "customers";

    constructor(row = {}) {
        this.id = row.id;
        this.userId = row.user_id || row.userId || null;
        this.apiKey = row.api_key || row.apiKey || null;
        this.customerName = row.customer_name || row.customerName || null;
        this.name = row.name || this.customerName;
        this.createdAt = row.created_at || row.createdAt || null;
    }
}

export default Customer;