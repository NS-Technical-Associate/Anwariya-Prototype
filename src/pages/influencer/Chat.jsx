import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import PageWrapper from "../../components/common/PageWrapper";
import { api } from "../../services/api";

export default function Chat({ tokens, setTokens }) {
  const { id } = useParams(); // chatId
  const navigate = useNavigate();

  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

  const userId = Number(localStorage.getItem("userId"));

  useEffect(() => {
    api(`/messages/${id}`).then(setMessages);
  }, [id]);

  const handleSend = async () => {
    if (!input.trim()) return;

    // Free 3 messages
    if (messages.length >= 3) {
      const tokenRes = await api(
        `/tokens/deduct?user_id=${userId}&amount=5`,
        { method: "POST" }
      );

      if (tokenRes.error) {
        navigate("/influencer/no-tokens");
        return;
      }

      setTokens(tokenRes.tokens);
    }

    const msg = await api("/messages", {
      method: "POST",
      body: JSON.stringify({
        chat_id: Number(id),
        sender_id: userId,
        text: input,
      }),
    });

    setMessages([...messages, msg]);
    setInput("");
  };

  return (
    <PageWrapper title="Chat">
      <div className="bg-white rounded-xl shadow h-[70vh] flex flex-col">
        <div className="flex-1 p-4 space-y-2 overflow-y-auto">
          {messages.map((m) => (
            <div
              key={m.id}
              className={`p-2 rounded max-w-xs ${
                m.sender_id === userId
                  ? "bg-blue-100 ml-auto"
                  : "bg-gray-100"
              }`}
            >
              {m.text}
            </div>
          ))}
        </div>

        <div className="border-t p-4 flex gap-2">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="border p-2 flex-1 rounded"
            placeholder="Type a message..."
          />
          <button
            onClick={handleSend}
            className="bg-blue-600 text-white px-4 rounded"
          >
            Send
          </button>
        </div>
      </div>
    </PageWrapper>
  );
}
