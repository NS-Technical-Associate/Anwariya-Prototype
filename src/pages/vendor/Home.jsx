import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import PageWrapper from "../../components/common/PageWrapper";
import { api } from "../../services/api";

export default function VendorHome() {
  const navigate = useNavigate();
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);

  const vendorId = Number(localStorage.getItem("userId"));

  useEffect(() => {
    api("/campaigns")
      .then((data) => {
        const myCampaigns = data.filter(
          (c) => c.vendor_id === vendorId
        );
        setCampaigns(myCampaigns);
      })
      .finally(() => setLoading(false));
  }, [vendorId]);

  return (
    <PageWrapper title="My Campaigns">
      <div className="min-h-screen rounded-3xl p-8 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">

        {/* HEADER */}
        <div className="mb-10">
          <h1 className="text-4xl font-extrabold tracking-wide bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-indigo-400">
            My Campaigns
          </h1>
          <p className="text-gray-400 mt-2">
            Create, monitor, and manage influencer collaborations
          </p>
        </div>

        

        {/* CONTENT */}
        {loading ? (
          <div className="flex justify-center items-center py-24 text-lg text-gray-400">
            Loading campaigns...
          </div>
        ) : campaigns.length === 0 ? (
          <div className="bg-slate-800 border border-slate-700 p-12 rounded-2xl text-center max-w-lg mx-auto">
            <h3 className="text-xl font-semibold text-white mb-2">
              No campaigns yet
            </h3>
            <p className="text-gray-400 mb-6">
              Start your first influencer marketing campaign to reach creators.
            </p>
            <button
              onClick={() => navigate("/vendor/create")}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl transition"
            >
              Create Campaign
            </button>
          </div>
        ) : (
          <div className="grid gap-8 sm:grid-cols-2 xl:grid-cols-3">
            {campaigns.map((campaign) => (
              <div
                key={campaign.id}
                className="group rounded-2xl overflow-hidden border border-slate-700 bg-slate-800 hover:border-blue-500 transition-all duration-300 shadow-lg hover:shadow-blue-500/20"
              >
                {/* CARD HEADER */}
                <div className="p-5 bg-gradient-to-r from-blue-600 to-indigo-600">
                  <h3 className="text-xl font-bold text-white">
                    {campaign.product_name}
                  </h3>
                  <p className="text-xs text-blue-100 mt-1">
                    Campaign #{campaign.id}
                  </p>
                </div>

                {/* CARD BODY */}
                <div className="p-6 flex flex-col gap-4">
                  <p className="text-gray-300 text-sm leading-relaxed">
                    {campaign.description}
                  </p>

                  <span className="w-fit text-xs font-semibold bg-blue-500/10 text-blue-400 px-3 py-1 rounded-full">
                    Active
                  </span>

                  <button
                    onClick={() =>
                      navigate(`/vendor/chat/${campaign.id}`)
                    }
                    className="mt-4 w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-semibold transition"
                  >
                    View Chats
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </PageWrapper>
  );
}