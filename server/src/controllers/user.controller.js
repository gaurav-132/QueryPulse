import UserService from "../services/user.service.js";

class UserController {
    register = async (req, res) => {
        console.log(req.body)
        try {
            const { firstName, lastName, email, mobile, password } = req.body;
            if (!firstName || !lastName || !email || !password) {
                return res.status(400).json({ error: "Missing required fields" });
            }
            const { user, apiKey } = await UserService.register({ firstName, lastName, email, mobile, password });
            res.status(201).json({ user: { id: user.id, email: user.email, name: user.name }, apiKey });
        } catch (err) {
            res.status(400).json({ error: err.message });
        }
    };

    login = async (req, res) => {
        try {
        const { email, password } = req.body;
            if (!email || !password) return res.status(400).json({ error: "Missing email or password" });
        const { user, token } = await UserService.login(email, password);
            res.json({
                data:  {
                    token, 
                    user: {  email: user.email, name: user.name }
                },
                statusCode: 200,
                message: "Login successful", 
            });
        } catch (err) {
            res.status(401).json({ error: err.message });
        }
    };
}

export default new UserController();
