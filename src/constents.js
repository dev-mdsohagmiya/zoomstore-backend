export const DB_NAME = "chai";

// Stripe Configuration
export const STRIPE_CONFIG = {
  SECRET_KEY:
    process.env.STRIPE_SECRET_KEY || "sk_test_BQokikJOvBiI2HlWgH4olfQ2",
  PUBLISHABLE_KEY:
    process.env.STRIPE_PUBLISHABLE_KEY || "pk_test_TYooMQauvdEDq54NiTphI7jx",
  WEBHOOK_SECRET:
    process.env.STRIPE_WEBHOOK_SECRET || "whsec_test_1234567890abcdef",
  CURRENCY: "usd",
  MIN_AMOUNT: 50, // $0.50 in cents
};
