import CustomerRepository from "../repositories/customer.repository.js";

const customerRepo = new CustomerRepository();

export async function apiKeyAuth(req, res, next) {
    const apiKey = req.header("X-Api-Key");
    if (!apiKey) return res.status(401).json({ error: "Missing X-Api-Key header" });

    const customer = await customerRepo.findByApiKey(apiKey); // already filters is_active = true
    if (!customer) return res.status(401).json({ error: "Invalid or inactive API key" });

    req.customerId = customer.id;
    next();
}