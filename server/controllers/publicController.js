import { env } from "../config/env.js";
import { getVehicleCatalog } from "../services/pricingService.js";

export const getPublicConfig = (req, res) => {
  res.json({
    success: true,
    config: {
      stripeEnabled: Boolean(env.stripeSecretKey),
      emailEnabled: Boolean(
        env.emailHost && env.emailUser && env.emailAppPassword,
      ),
      currency: env.paymentCurrency.toUpperCase(),
      vehicles: getVehicleCatalog(),
    },
  });
};
