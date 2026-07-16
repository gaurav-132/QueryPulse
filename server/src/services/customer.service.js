import CustomerRepository from "../repositories/customer.repository.js";

const customerRepo = new CustomerRepository();

class CustomerService {
    async activateSubscription(userId) {
        const existing = await customerRepo.findByUserId(userId);
        if (!existing) {
            throw new Error("No customer record found — register first");
        }
        if (existing.isActive) {
            throw new Error("Subscription is already active");
        }
        return customerRepo.activateSubscription(userId);
    }

    async getByUserId(userId) {
        return customerRepo.findByUserId(userId);
    }
}

export default new CustomerService();