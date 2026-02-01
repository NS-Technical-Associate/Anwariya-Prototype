import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import PageWrapper from "../../components/common/PageWrapper";
import { api } from "../../services/api";

export default function CampaignDetails({ tokens, setTokens }) {
  const { id } = useParams();
  const navigate = useNavigate();

  const [campaign, setCampaign] = useState(null);
  const [loading, setLoading] = useState(true);

  const userId = Number(localStorage.getItem("userId"));

  useEffect(() => {
    if (!userId) {
      navigate("/login");
      return;
    }

    api("/campaigns")
      .then((data) => {
        const found = data.find(
          (c) => c.id === Number(id)
        );
        setCampaign(found);
      })
      .finally(() => setLoading(false));
  }, [id, userId, navigate]);

  if (loading) return <PageWrapper title="Loading..." />;
  if (!campaign)
    return <PageWrapper title="Campaign not found" />;

  const vendorId = campaign.vendor_id;
  const alreadyPaid = localStorage.getItem(
    `chat_${campaign.id}_paid`
  );

  const handleContact = async () => {
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

      localStorage.setItem(
        `chat_${campaign.id}_paid`,
        "true"
      );
      setTokens(tokenRes.tokens);
    }

    navigate(`/influencer/chat/${chat.id}`);
  };

  return (
    <PageWrapper title="Campaign Details">
      <div className="bg-white p-6 rounded-xl shadow max-w-2xl">
        <h2 className="text-xl font-bold mb-2">
          {campaign.product_name}
        </h2>

        <p className="text-gray-600 mb-4">
          {campaign.description}
        </p>

        <button
          onClick={handleContact}
          className="bg-blue-600 text-white px-6 py-2 rounded"
        >
          {alreadyPaid
            ? "Open Chat"
            : "Contact Vendor (50 tokens)"}
        </button>
      </div>
    </PageWrapper>
  );
}
