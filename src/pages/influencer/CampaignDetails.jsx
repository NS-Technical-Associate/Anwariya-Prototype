import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import PageWrapper from "../../components/common/PageWrapper";
import { api } from "../../services/api";

export default function CampaignDetails({ tokens, setTokens }) {
  const { id } = useParams();
  const navigate = useNavigate();

  const [campaign, setCampaign] = useState(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);

  const userId = Number(localStorage.getItem("userId"));

  useEffect(() => {
    if (!userId) {
      navigate("/login");
      return;
    }

    api("/campaigns")
      .then((data) => {
        const found = data.find((c) => c.id === Number(id));
        setCampaign(found);
      })
      .finally(() => setLoading(false));
  }, [id, userId, navigate]);

  if (loading) return <PageWrapper>Loading...</PageWrapper>;
  if (!campaign) return <PageWrapper>Campaign not found</PageWrapper>;

  const vendorId = campaign.vendor_id;
  const paidKey = `paid_${userId}_${campaign.id}`;
  const alreadyPaid = localStorage.getItem(paidKey);

  const handleContact = async () => {
    if (processing) return;
    setProcessing(true);

    const chat = await api("/chats", {
      method: "POST",
      body: JSON.stringify({
        campaign_id: campaign.id,
        vendor_id: vendorId,
        influencer_id: userId,
      }),
    });

    if (!alreadyPaid) {
      const tokenRes = await api(
        `/tokens/deduct?user_id=${userId}&amount=50`,
        { method: "POST" }
      );

      if (tokenRes.error) {
        navigate("/influencer/no-tokens");
        return;
      }

      localStorage.setItem(paidKey, "true");
      setTokens(tokenRes.tokens);
    }

    navigate(`/influencer/chat/${chat.id}`);
  };

  return (
    <PageWrapper>
      {/* PAGE BACKGROUND */}
      <div className="min-h-screen bg-slate-950 px-6 py-12 flex justify-center">

        {/* CARD WITH PERMANENT BLUE GLOW */}
        <div
          className="
            relative
            w-full max-w-3xl
            bg-slate-900
            border border-blue-500/40
            rounded-2xl
            p-8 space-y-8

            shadow-[0_0_30px_rgba(59,130,246,0.35)]
            transition-all duration-500
            animate-fadeIn

            hover:shadow-[0_0_50px_rgba(59,130,246,0.55)]
            hover:-translate-y-1
          "
        >
          {/* PERMANENT BLUE AURA */}
          <div
            className="
              absolute inset-0
              rounded-2xl
              bg-gradient-to-br from-blue-500/10 to-indigo-500/10
              pointer-events-none
            "
          ></div>

          {/* CONTENT */}
          <div className="relative space-y-8">

            {/* HEADER */}
            <div>
              <h1 className="text-2xl font-semibold text-white">
                {campaign.product_name}
              </h1>
              <p className="text-sm text-slate-400 mt-1">
                Campaign ID #{campaign.id}
              </p>
            </div>

            {/* DESCRIPTION */}
            <div>
              <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                About the Campaign
              </h3>
              <p className="text-slate-300 leading-relaxed">
                {campaign.description}
              </p>
            </div>

            {/* STATUS */}
            {alreadyPaid && (
              <div className="flex gap-3 bg-green-500/10 border border-green-500/20 p-4 rounded-xl transition">
                <span className="text-green-400 font-semibold">✔</span>
                <p className="text-green-300 text-sm">
                  You’ve already contacted this vendor.  
                  You can continue the conversation anytime.
                </p>
              </div>
            )}

            {/* ACTION SECTION */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pt-4 border-t border-slate-800">
              <button
                onClick={handleContact}
                disabled={processing}
                className="
                  bg-blue-600 hover:bg-blue-700
                  text-white
                  px-8 py-3
                  rounded-xl
                  font-medium
                  transition-all duration-300
                  hover:scale-[1.04]
                  active:scale-[0.97]
                  disabled:opacity-60
                "
              >
                {processing
                  ? "Opening chat..."
                  : alreadyPaid
                  ? "Open Chat"
                  : "Contact Vendor (50 tokens)"}
              </button>

              {!alreadyPaid && (
                <span className="text-sm text-slate-400">
                  Your balance:{" "}
                  <span className="font-semibold text-slate-200">
                    {tokens} tokens
                  </span>
                </span>
              )}
            </div>

          </div>
        </div>
      </div>
    </PageWrapper>
  );
}
