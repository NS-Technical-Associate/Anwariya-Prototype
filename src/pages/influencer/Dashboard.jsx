import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import PageWrapper from "../../components/common/PageWrapper";
import { api } from "../../services/api";

export default function InfluencerDashboard() {
  const navigate = useNavigate();
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api("/campaigns")
      .then((data) => setCampaigns(data))
      .finally(() => setLoading(false));
  }, []);

  return (
    <PageWrapper>
      {/* THEME WRAPPER */}
      <div className="min-h-screen rounded-3xl p-8 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">

        {/* HEADER */}
        <div className="mb-10">
          <h1 className="text-4xl font-extrabold tracking-wide bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-indigo-400">
            Available Campaigns
          </h1>
          <p className="text-gray-400 mt-2">
            Collaborate with top brands and grow your influence
          </p>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-24 text-lg text-gray-400">
            Loading campaigns...
          </div>
        ) : campaigns.length === 0 ? (
          <div className="bg-slate-800 border border-slate-700 p-12 rounded-2xl text-center max-w-lg mx-auto">
            <h3 className="text-xl font-semibold text-white mb-2">
              No campaigns available
            </h3>
            <p className="text-gray-400">
              New brand opportunities will appear here soon.
            </p>
          </div>
        ) : (
          <div className="grid gap-8 sm:grid-cols-2 xl:grid-cols-3">
            {campaigns.map((campaign) => (
              <div
                key={campaign.id}
                className="
                  group
                  relative
                  rounded-2xl
                  overflow-hidden
                  border border-blue-500/40
                  bg-slate-800
                  transition-all duration-300
                  shadow-[0_0_28px_rgba(59,130,246,0.35)]

                  hover:border-blue-400
                  hover:shadow-[0_0_48px_rgba(59,130,246,0.55)]
                "
              >
                {/* PERMANENT BLUE AURA */}
                <div className="
                  absolute inset-0
                  bg-gradient-to-br from-blue-500/10 to-indigo-500/10
                  pointer-events-none
                "></div>

                {/* CARD HEADER */}
                <div className="relative p-5 bg-gradient-to-r from-indigo-600 to-blue-600">
                  <h3 className="text-xl font-bold text-white">
                    {campaign.product_name}
                  </h3>
                  <p className="text-xs text-indigo-100 mt-1">
                    Campaign #{campaign.id}
                  </p>
                </div>

                {/* CARD BODY */}
                <div className="relative p-6 flex flex-col gap-4">
                  <p className="text-gray-300 text-sm leading-relaxed">
                    {campaign.description}
                  </p>

                  <span className="w-fit text-xs font-semibold bg-indigo-500/10 text-indigo-400 px-3 py-1 rounded-full">
                    NEW CAMPAIGN
                  </span>

                  <button
                    onClick={() =>
                      navigate(`/influencer/campaign/${campaign.id}`)
                    }
                    className="mt-4 w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-xl font-semibold transition"
                  >
                    View Campaign
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
