/**
 * Buyer Dashboard Page
 * Placeholder dashboard until buyer features are implemented.
 */

export function BuyerDashboardPage() {
  return (
    <div className="min-h-screen bg-[#F8F8F4] flex items-center justify-center px-[20px]">
      <div className="w-full max-w-[520px] bg-white border border-[#e0e5f2] rounded-[24px] px-[32px] py-[36px] text-center shadow-sm">
        <p
          className="font-['DM_Sans:Bold',sans-serif] font-bold text-[28px] leading-[36px] text-[#2b3674] tracking-[-0.56px] mb-[10px]"
          style={{ fontVariationSettings: "'opsz' 14" }}
        >
          Buyer Dashboard
        </p>
        <p
          className="font-['DM_Sans:Regular',sans-serif] font-normal text-[14px] leading-[22px] text-[#7b88b2] tracking-[-0.28px]"
          style={{ fontVariationSettings: "'opsz' 14" }}
        >
          We are getting your buyer workspace ready. Check back soon for orders,
          catalogs, and procurement tools.
        </p>
      </div>
    </div>
  );
}
