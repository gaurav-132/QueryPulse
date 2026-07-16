// models/customer.model.js
class Customer {
    static tableName = "customers";

    constructor(row = {}) {
        this.id = row.id;
        this.userId = row.user_id || row.userId || null;
        this.apiKey = row.api_key || row.apiKey || null;
        this.subscriptionActivated = row.subscription_activated ?? row.subscriptionActivated ?? false;
        this.createdAt = row.created_at || row.createdAt || null;
    }
}

export default Customer;