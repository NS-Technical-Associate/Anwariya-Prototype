import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import PageWrapper from "../../components/common/PageWrapper";
import { api } from "../../services/api";

export default function MyChats() {
  const navigate = useNavigate();
  const [chats, setChats] = useState([]);
  const [loading, setLoading] = useState(true);

  const userId = Number(localStorage.getItem("userId"));

  useEffect(() => {
    api(`/chats/user/${userId}`)
      .then(setChats)
      .finally(() => setLoading(false));
  }, [userId]);

  return (
    <PageWrapper title="My Chats">
      {loading ? (
        <div className="text-center text-gray-500">
          Loading chats...
        </div>
      ) : chats.length === 0 ? (
        <div className="bg-white p-10 rounded-xl shadow text-center">
          <h2 className="text-lg font-semibold">
            No chats yet
          </h2>
          <p className="text-gray-500 mt-2">
            Contact a vendor to start chatting.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {chats.map((chat) => (
            <div
              key={chat.id}
              onClick={() =>
                navigate(`/influencer/chat/${chat.id}`)
              }
              className="bg-white p-4 rounded-xl shadow cursor-pointer hover:bg-gray-50"
            >
              <p className="font-medium">
                Campaign ID: {chat.campaign_id}
              </p>
              <p className="text-sm text-gray-500">
                Click to open chat
              </p>
            </div>
          ))}
        </div>
      )}
    </PageWrapper>
  );
}
