import { useEffect, useState } from "react";
import PageWrapper from "../../components/common/PageWrapper";
import { api } from "../../services/api";

export default function InfluencerProfile() {
  const userId = Number(localStorage.getItem("userId"));

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  const [profile, setProfile] = useState({
    name: "",
    niche: "",
    followers_range: "",
    engagement: "",
    content_types: [],
    bio: "",
    availability: "Open",
  });

  useEffect(() => {
    api(`/profile/${userId}`)
      .then((data) => {
        if (data) {
          setProfile(data);
          setIsSaved(true);
        }
      })
      .finally(() => setLoading(false));
  }, [userId]);

  const handleChange = (field, value) => {
    setProfile({ ...profile, [field]: value });
  };

  const toggleContentType = (type) => {
    setProfile((prev) => ({
      ...prev,
      content_types: prev.content_types.includes(type)
        ? prev.content_types.filter((t) => t !== type)
        : [...prev.content_types, type],
    }));
  };

  const handleSave = async () => {
    setSaving(true);
    await api("/profile", {
      method: "POST",
      body: JSON.stringify({ user_id: userId, ...profile }),
    });
    setSaving(false);
    setIsSaved(true);
  };

  if (loading) {
    return (
      <PageWrapper>
        <div className="min-h-screen bg-slate-950 flex items-center justify-center text-slate-400 animate-pulse">
          Loading profile...
        </div>
      </PageWrapper>
    );
  }

  return (
    <PageWrapper>
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-blue-950 px-6 py-14">

        {/* MAIN PROFILE CONTAINER – ALWAYS GLOWING */}
        <div className="
          max-w-4xl mx-auto
          bg-slate-900/95
          backdrop-blur
          border border-blue-500/40
          rounded-3xl
          p-10
          shadow-[0_0_45px_rgba(59,130,246,0.45)]
          transition-all duration-500
          hover:shadow-[0_0_70px_rgba(59,130,246,0.7)]
          animate-fadeIn
        ">

          {/* HEADER */}
          <div className="mb-10 border-b border-blue-500/30 pb-6">
            <h1 className="text-3xl font-semibold text-blue-400 drop-shadow-[0_0_10px_rgba(96,165,250,0.7)]">
              My Profile
            </h1>
            <p className="text-slate-400 text-sm mt-1">
              This is how vendors see you
            </p>
          </div>

          {isSaved ? (
            /* ================= VIEW MODE ================= */
            <div className="space-y-10">

              {/* NAME SECTION */}
              <section className="
                bg-slate-800/80
                rounded-2xl
                p-6
                border border-blue-500/30
                shadow-[0_0_25px_rgba(59,130,246,0.35)]
                transition-all duration-300
                hover:shadow-[0_0_45px_rgba(59,130,246,0.6)]
              ">
                <h2 className="text-2xl font-bold text-white">
                  {profile.name}
                </h2>
                <p className="text-slate-400 mt-1">
                  {profile.niche} Creator
                </p>
              </section>

              {/* STATS */}
              <section className="grid sm:grid-cols-2 gap-6">
                {[
                  ["Followers", profile.followers_range],
                  ["Engagement", profile.engagement],
                ].map(([label, value]) => (
                  <div
                    key={label}
                    className="
                      bg-slate-800/80
                      rounded-2xl
                      p-5
                      border border-blue-500/30
                      shadow-[0_0_22px_rgba(59,130,246,0.35)]
                      transition-all duration-300
                      hover:shadow-[0_0_40px_rgba(59,130,246,0.6)]
                    "
                  >
                    <p className="text-xs text-slate-400 uppercase">
                      {label}
                    </p>
                    <p className="text-white font-medium mt-1">
                      {value}
                    </p>
                  </div>
                ))}
              </section>

              {/* CONTENT TYPES */}
              <section className="
                bg-slate-800/80
                rounded-2xl
                p-6
                border border-blue-500/30
                shadow-[0_0_25px_rgba(59,130,246,0.35)]
                transition-all duration-300
                hover:shadow-[0_0_45px_rgba(59,130,246,0.6)]
              ">
                <p className="text-slate-300 font-medium mb-3">
                  Content Types
                </p>
                <div className="flex flex-wrap gap-3">
                  {profile.content_types.map((type) => (
                    <span
                      key={type}
                      className="px-4 py-1.5 rounded-full text-sm bg-blue-600/30 text-blue-300 border border-blue-500/40 shadow-md"
                    >
                      {type}
                    </span>
                  ))}
                </div>
              </section>

              {/* ABOUT */}
              <section className="
                bg-slate-800/80
                rounded-2xl
                p-6
                border border-blue-500/30
                shadow-[0_0_25px_rgba(59,130,246,0.35)]
                transition-all duration-300
                hover:shadow-[0_0_45px_rgba(59,130,246,0.6)]
              ">
                <p className="text-slate-300 font-medium mb-2">
                  About
                </p>
                <p className="text-slate-400 text-sm leading-relaxed">
                  {profile.bio || "—"}
                </p>
              </section>

              {/* STATUS */}
              <section className="
                bg-green-600/10
                border border-green-500/40
                rounded-2xl
                p-4
                text-green-300
                text-sm
                shadow-[0_0_18px_rgba(34,197,94,0.4)]
              ">
                Status: {profile.availability}
              </section>

              <button
                onClick={() => setIsSaved(false)}
                className="text-blue-400 hover:text-blue-300 transition text-sm"
              >
                Edit Profile
              </button>
            </div>
          ) : (
            /* ================= EDIT MODE ================= */
            <div className="space-y-8">

              {/* FORM */}
              <section className="
                bg-slate-800/80
                rounded-2xl
                p-6
                border border-blue-500/30
                shadow-[0_0_25px_rgba(59,130,246,0.35)]
                space-y-6
              ">
                <div>
                  <label className="text-slate-300 text-sm mb-1 block">
                    Display Name
                  </label>
                  <input
                    value={profile.name}
                    onChange={(e) => handleChange("name", e.target.value)}
                    className="
                      w-full
                      bg-slate-900
                      border border-blue-500/40
                      p-3
                      rounded-xl
                      text-slate-200
                      shadow-[0_0_15px_rgba(59,130,246,0.35)]
                      focus:ring-2 focus:ring-blue-500/60
                      outline-none
                    "
                  />
                </div>

                {[["Primary Niche","niche",["Lifestyle","Fashion","Fitness","Tech","Beauty"]],
                  ["Followers Range","followers_range",["1k–10k","10k–50k","50k–100k","100k+"]],
                  ["Engagement Level","engagement",["High","Medium","Low"]]
                ].map(([label, field, options]) => (
                  <div key={field}>
                    <label className="text-slate-300 text-sm mb-1 block">
                      {label}
                    </label>
                    <select
                      value={profile[field]}
                      onChange={(e) => handleChange(field, e.target.value)}
                      className="
                        w-full
                        bg-slate-900
                        border border-blue-500/40
                        p-3
                        rounded-xl
                        text-slate-200
                        shadow-[0_0_15px_rgba(59,130,246,0.35)]
                        focus:ring-2 focus:ring-blue-500/60
                        outline-none
                      "
                    >
                      <option value="">Select</option>
                      {options.map((o) => (
                        <option key={o}>{o}</option>
                      ))}
                    </select>
                  </div>
                ))}
              </section>

              {/* CONTENT TYPES EDIT */}
              <section className="
                bg-slate-800/80
                rounded-2xl
                p-6
                border border-blue-500/30
                shadow-[0_0_25px_rgba(59,130,246,0.35)]
              ">
                <p className="text-slate-300 mb-3">Content Types</p>
                <div className="flex flex-wrap gap-3">
                  {["Reels","Shorts","Posts","Stories"].map((type) => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => toggleContentType(type)}
                      className={`px-4 py-2 rounded-xl border transition
                        ${
                          profile.content_types.includes(type)
                            ? "bg-blue-600 text-white border-blue-500 shadow-[0_0_20px_rgba(59,130,246,0.6)]"
                            : "bg-slate-900 text-slate-300 border-slate-600 hover:border-blue-400"
                        }
                      `}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </section>

              {/* BIO */}
              <section className="
                bg-slate-800/80
                rounded-2xl
                p-6
                border border-blue-500/30
                shadow-[0_0_25px_rgba(59,130,246,0.35)]
              ">
                <label className="text-slate-300 text-sm mb-1 block">
                  Short Bio
                </label>
                <textarea
                  value={profile.bio}
                  onChange={(e) => handleChange("bio", e.target.value)}
                  rows={3}
                  className="
                    w-full
                    bg-slate-900
                    border border-blue-500/40
                    p-3
                    rounded-xl
                    text-slate-200
                    shadow-[0_0_15px_rgba(59,130,246,0.35)]
                    focus:ring-2 focus:ring-blue-500/60
                    outline-none
                  "
                />
              </section>

              <button
                onClick={handleSave}
                disabled={saving}
                className="bg-blue-600 hover:bg-blue-700 transition text-white px-8 py-3 rounded-xl font-medium shadow-[0_0_30px_rgba(59,130,246,0.6)] disabled:opacity-60"
              >
                {saving ? "Saving..." : "Save Profile"}
              </button>
            </div>
          )}
        </div>
      </div>
    </PageWrapper>
  );
}
