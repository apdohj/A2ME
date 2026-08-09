import { Shield, Zap, Handshake, Globe } from "lucide-react";

const FEATURES = [
  {
    icon: Shield,
    title: "100% Secure",
    subtitle: "Buyer & Seller Protection",
  },
  {
    icon: Zap,
    title: "Instant Delivery",
    subtitle: "Get Your Account Fast",
  },
  {
    icon: Handshake,
    title: "Trusted Platform",
    subtitle: "Safe Transactions",
  },
  {
    icon: Globe,
    title: "MENA Focused",
    subtitle: "Best Deals in Your Region",
  },
];

export default function TrustFeatures() {
  return (
    <section className="bg-a2-bg border-y border-a2-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {FEATURES.map((f) => {
            const Icon = f.icon;
            return (
              <div
                key={f.title}
                className="a2-card p-4 sm:p-5 flex items-start gap-3 sm:gap-4 h-full min-w-0 hover:border-a2-gold/40 transition-colors"
              >
                <span className="w-9 h-9 sm:w-11 sm:h-11 rounded-xl bg-a2-gold/10 border border-a2-gold/25 flex items-center justify-center shrink-0">
                  <Icon className="w-4 h-4 sm:w-5 sm:h-5 text-a2-gold" />
                </span>
                <div className="min-w-0">
                  <div className="font-semibold text-white text-sm sm:text-base leading-tight">
                    {f.title}
                  </div>
                  <div className="text-xs sm:text-sm text-a2-light/60 mt-0.5 leading-snug">
                    {f.subtitle}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
