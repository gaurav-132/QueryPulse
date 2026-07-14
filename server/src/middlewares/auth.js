import CustomerRepository from "../repositories/customer.repository.js";
import UserRepository from "../repositories/user.repository.js";
import jwt from "jsonwebtoken";

const customerRepository = new CustomerRepository();
const userRepository = new UserRepository();
const JWT_SECRET = process.env.JWT_SECRET || "dev-secret";

export async function authMiddleware(req, res, next) {
    // 1) Try Bearer token (user)
    const authHeader = req.header("Authorization");
    if (authHeader && authHeader.startsWith("Bearer ")) {
        const token = authHeader.slice(7);
        try {
            const payload = jwt.verify(token, JWT_SECRET);
            const user = await userRepository.findById(payload.userId);
            if (!user) return res.status(401).json({ error: "Invalid token" });
            req.userId = user.id;
            // if user has customer, attach it
            const customer = await customerRepository.findByUserId(user.id);
            if (customer) req.customerId = customer.id;
            return next();
        } catch (err) {
            return res.status(401).json({ error: "Invalid token" });
        }
    }

    // 2) Fallback to X-Api-Key (customer)
    const apiKey = req.header("X-Api-Key");
    if (!apiKey) return res.status(401).json({ error: "Missing credentials" });

    const customer = await customerRepository.findByApiKey(apiKey);
    if (!customer) return res.status(401).json({ error: "Invalid API key" });

    req.customerId = customer.id;
    next();
}