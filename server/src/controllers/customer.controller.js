import CustomerService from "../services/customer.service.js";

class CustomerController {
	activateSubscription = async (req, res) => {
		try {
			// req.userId comes from JWT auth middleware — this is a
			// logged-in user action, NOT an API-key action.
			const customer = await CustomerService.activateSubscription(req.userId);
			res.json({
				message: "Subscription activated",
				apiKey: customer.apiKey,
				activatedAt: customer.activatedAt,
			});

		} catch (err) {
			res.status(400).json({ error: err.message });
		}
	};

	getMyCustomerInfo = async (req, res) => {
		const customer = await CustomerService.getByUserId(req.userId);

		if (!customer) return res.status(404).json({ error: "No customer record found" });

		res.json({
			customerName: customer.customerName,
			subscriptionActivated: customer.subscriptionActivated,
			apiKey: customer.subscriptionActivated ? customer.apiKey : null, // never show key if inactive
			activatedAt: customer.activatedAt,
		});
	};
}

export default new CustomerController();