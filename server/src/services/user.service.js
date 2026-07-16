import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import UserRepository from "../repositories/user.repository.js";
import CustomerRepository from "../repositories/customer.repository.js";

const userRepo = new UserRepository();
const customerRepo = new CustomerRepository();
const JWT_SECRET = process.env.JWT_SECRET || "dev-secret";

class UserService {
    async register(payload) {
        const existing = await userRepo.findByEmail(payload.email);
        if (existing) throw new Error("Email already registered");

        const passwordHash = await bcrypt.hash(payload.password, 10);
        const user = await userRepo.create({
            firstName: payload.firstName,
            lastName: payload.lastName,
            name: `${payload.firstName} ${payload.lastName}`.trim(),
            email: payload.email,
            mobile: payload.mobile,
            passwordHash,
        });

        await customerRepo.createForUser(user.id, user.name);

        return { user }; // no apiKey returned here anymore
    }

    async login(email, password) {
        const user = await userRepo.findByEmail(email);
        if (!user) throw new Error("Invalid credentials");
        const ok = await bcrypt.compare(password, user.passwordHash);
        if (!ok) throw new Error("Invalid credentials");
        const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: "7d" });
        return { user, token };
    }
}

export default new UserService();