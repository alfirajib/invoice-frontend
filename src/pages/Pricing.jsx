// frontend/src/pages/Pricing.jsx
import React, { useState } from "react";
import { Check, Zap } from "lucide-react";
import { paymentAPI } from "../services/api";
import { formatCurrency } from "../utils/helpers";

const Pricing = () => {
  const [billingCycle, setBillingCycle] = useState("monthly");
  const [loading, setLoading] = useState(null);

  const plans = [
    {
      id: "free",
      name: "Free",
      price: 0,
      yearlyPrice: 0,
      description: "Perfect for getting started",
      features: [
        "5 invoices per month",
        "Basic invoice templates",
        "Email notifications",
        "Basic analytics",
        "Community support",
      ],
      cta: "Current Plan",
      highlighted: false,
    },
    {
      id: "starter",
      name: "Starter",
      price: 99000,
      yearlyPrice: 950000,
      description: "For small businesses",
      features: [
        "50 invoices per month",
        "Custom invoice templates",
        "Payment reminders",
        "Advanced analytics",
        "Email support",
        "Multiple currencies",
        "Tax calculations",
      ],
      cta: "Upgrade to Starter",
      highlighted: true,
    },
    {
      id: "business",
      name: "Business",
      price: 299000,
      yearlyPrice: 2870000,
      description: "For growing companies",
      features: [
        "Unlimited invoices",
        "All Starter features",
        "Recurring invoices",
        "Client portal",
        "API access",
        "Priority support",
        "Custom branding",
        "Team collaboration (5 users)",
        "Advanced reporting",
      ],
      cta: "Upgrade to Business",
      highlighted: false,
    },
    {
      id: "enterprise",
      name: "Enterprise",
      price: 999000,
      yearlyPrice: 9590000,
      description: "For large organizations",
      features: [
        "Everything in Business",
        "Unlimited team members",
        "White-label solution",
        "Dedicated account manager",
        "Custom integrations",
        "SLA guarantee",
        "Advanced security",
        "Training & onboarding",
        "Custom workflows",
      ],
      cta: "Upgrade to Enterprise",
      highlighted: false,
    },
  ];

  const handleUpgrade = async (planId) => {
    if (planId === "free") return;

    setLoading(planId);

    try {
      const response = await paymentAPI.createSubscriptionPayment({
        plan: planId,
        billingCycle,
      });

      // Open Midtrans Snap
      window.snap.pay(response.data.token, {
        onSuccess: () => {
          alert("Subscription upgraded successfully!");
          window.location.reload();
        },
        onPending: () => {
          alert("Payment pending");
        },
        onError: () => {
          alert("Payment failed");
        },
        onClose: () => {
          setLoading(null);
        },
      });
    } catch (error) {
      alert("Failed to process upgrade");
      setLoading(null);
    }
  };

  const getPrice = (plan) => {
    if (plan.price === 0) return "Free";
    const price = billingCycle === "monthly" ? plan.price : plan.yearlyPrice;
    return formatCurrency(price);
  };

  const getPeriod = () => {
    return billingCycle === "monthly" ? "/bulan" : "/tahun";
  };

  return (
    <div className="p-6 mx-auto max-w-7xl">
      <div className="mb-12 text-center">
        <h1 className="mb-4 text-4xl font-bold">Choose Your Plan</h1>
        <p className="mb-8 text-xl text-gray-600">
          Mulai gratis, upgrade kapan saja
        </p>

        {/* Billing Toggle */}
        <div className="inline-flex items-center gap-3 p-1 bg-gray-100 rounded-lg">
          <button
            onClick={() => setBillingCycle("monthly")}
            className={`px-6 py-2 rounded-lg font-semibold transition ${
              billingCycle === "monthly"
                ? "bg-white shadow-sm"
                : "text-gray-600"
            }`}
          >
            Monthly
          </button>
          <button
            onClick={() => setBillingCycle("yearly")}
            className={`px-6 py-2 rounded-lg font-semibold transition ${
              billingCycle === "yearly" ? "bg-white shadow-sm" : "text-gray-600"
            }`}
          >
            Yearly
            <span className="px-2 py-1 ml-2 text-xs text-green-800 bg-green-100 rounded-full">
              Save 20%
            </span>
          </button>
        </div>
      </div>

      {/* Plans Grid */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        {plans.map((plan) => (
          <div
            key={plan.id}
            className={`
              bg-white rounded-2xl shadow-lg overflow-hidden
              ${plan.highlighted ? "ring-2 ring-blue-600 relative" : ""}
            `}
          >
            {plan.highlighted && (
              <div className="absolute top-0 right-0 px-3 py-1 text-xs font-bold text-white bg-blue-600 rounded-bl-lg">
                POPULAR
              </div>
            )}

            <div className="p-8">
              <h3 className="mb-2 text-2xl font-bold">{plan.name}</h3>
              <p className="mb-6 text-sm text-gray-600">{plan.description}</p>

              <div className="mb-6">
                <span className="text-4xl font-bold">{getPrice(plan)}</span>
                {plan.price > 0 && (
                  <span className="text-sm text-gray-600">{getPeriod()}</span>
                )}
              </div>

              <button
                onClick={() => handleUpgrade(plan.id)}
                disabled={loading === plan.id || plan.id === "free"}
                className={`
                  w-full py-3 rounded-lg font-semibold transition
                  ${
                    plan.highlighted
                      ? "bg-blue-600 text-white hover:bg-blue-700"
                      : "bg-gray-100 text-gray-800 hover:bg-gray-200"
                  }
                  disabled:opacity-50 disabled:cursor-not-allowed
                `}
              >
                {loading === plan.id ? "Processing..." : plan.cta}
              </button>

              <div className="mt-8 space-y-3">
                {plan.features.map((feature, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <Check
                      size={20}
                      className="text-green-600 flex-shrink-0 mt-0.5"
                    />
                    <span className="text-sm text-gray-700">{feature}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* FAQ Section */}
      <div className="mt-20">
        <h2 className="mb-10 text-3xl font-bold text-center">
          Frequently Asked Questions
        </h2>

        <div className="max-w-3xl mx-auto space-y-6">
          <FAQItem
            question="Apakah saya bisa upgrade atau downgrade kapan saja?"
            answer="Ya, Anda bisa upgrade atau downgrade plan kapan saja. Perubahan akan berlaku di billing cycle berikutnya."
          />
          <FAQItem
            question="Bagaimana cara pembayaran?"
            answer="Kami menerima pembayaran melalui Midtrans: kartu kredit, transfer bank, e-wallet (GoPay, OVO, Dana), dan virtual account."
          />
          <FAQItem
            question="Apakah ada trial period?"
            answer="Plan Free tersedia selamanya tanpa perlu kartu kredit. Anda bisa mencoba semua fitur dasar sebelum upgrade."
          />
          <FAQItem
            question="Bagaimana jika saya melebihi limit invoice?"
            answer="Anda akan mendapat notifikasi saat mendekati limit. Untuk membuat invoice lebih banyak, Anda perlu upgrade plan."
          />
        </div>
      </div>
    </div>
  );
};

const FAQItem = ({ question, answer }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="p-6 bg-white rounded-lg shadow">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between w-full text-left"
      >
        <h3 className="text-lg font-semibold">{question}</h3>
        <span className="text-2xl">{isOpen ? "−" : "+"}</span>
      </button>
      {isOpen && <p className="mt-4 text-gray-600">{answer}</p>}
    </div>
  );
};

export default Pricing;
