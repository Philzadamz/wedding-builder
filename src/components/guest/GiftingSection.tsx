import type { Couple, GiftMethod, GiftMethodType } from "@/lib/types";

interface Props {
  couple: Couple;
  giftMethods: GiftMethod[];
  label: string;
}

const METHOD_ICON: Record<GiftMethodType, string> = {
  bank_transfer: "🏦",
  flutterwave: "⚡",
  paystack: "💳",
  amazon: "📦",
};

const METHOD_LABEL: Record<GiftMethodType, string> = {
  bank_transfer: "Bank Transfer",
  flutterwave: "Flutterwave",
  paystack: "Paystack",
  amazon: "Amazon Wishlist",
};

export function GiftingSection({ couple, giftMethods, label }: Props) {
  return (
    <section id="gifting" className="py-24 px-6 md:px-16 bg-[var(--color-ink)] text-white">
      <div className="max-w-7xl mx-auto">
        <div className="editorial-grid">
          {/* Left */}
          <div>
            <h2 className="heading-section text-white">{label.toUpperCase()}</h2>
          </div>

          {/* Right */}
          <div className="flex flex-col gap-6">
            {couple.gift_message && (
              <p className="text-sm text-white/60 leading-relaxed italic font-display text-lg">
                &ldquo;{couple.gift_message}&rdquo;
              </p>
            )}

            {giftMethods.map((method) => (
              <GiftCard key={method.id} method={method} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function GiftCard({ method }: { method: GiftMethod }) {
  if (method.type === "bank_transfer") {
    return (
      <div className="border border-white/10 p-6 flex flex-col gap-3">
        <div className="flex items-center gap-2">
          <span>{METHOD_ICON[method.type]}</span>
          <p className="text-xs tracking-widest uppercase text-white/50">{METHOD_LABEL[method.type]}</p>
          {method.currency && (
            <span className="ml-auto text-xs text-white/30">{method.currency}</span>
          )}
        </div>
        {method.bank_name && (
          <p className="text-sm text-white/60">Bank: <span className="text-white">{method.bank_name}</span></p>
        )}
        {method.account_number && (
          <p className="text-sm text-white/60">Account: <span className="text-white font-mono">{method.account_number}</span></p>
        )}
        {method.account_name && (
          <p className="text-sm text-white/60">Name: <span className="text-white">{method.account_name}</span></p>
        )}
      </div>
    );
  }

  return (
    <a
      href={method.link_url ?? "#"}
      target="_blank"
      rel="noreferrer"
      className="border border-white/10 p-6 flex items-center justify-between hover:border-white/30 transition-colors group"
    >
      <div className="flex items-center gap-3">
        <span>{METHOD_ICON[method.type]}</span>
        <p className="text-sm tracking-widest uppercase">{METHOD_LABEL[method.type]}</p>
      </div>
      <span className="text-xs tracking-widest uppercase text-white/40 group-hover:text-white/80 transition-colors">
        Open →
      </span>
    </a>
  );
}