import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import PageWrapper from "../../components/common/PageWrapper";
import { api } from "../../services/api";

export default function VendorChat() {
  const { id } = useParams(); // chatId
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

  const vendorId = Number(localStorage.getItem("userId"));

  useEffect(() => {
    api(`/messages/${id}`).then(setMessages);
  }, [id]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const msg = await api("/messages", {
      method: "POST",
      body: JSON.stringify({
        chat_id: Number(id),
        sender_id: vendorId,
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
                m.sender_id === vendorId
                  ? "bg-purple-100 ml-auto"
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
            className="bg-purple-600 text-white px-4 rounded"
          >
            Send
          </button>
        </div>
      </div>
    </PageWrapper>
  );
}
