"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { User } from "lucide-react";

// Helper: Get messages for a chatroom
const getMessages = async (chatroomId: number, token: string | null) => {
  try {
    const res = await axios.get(
      `http://localhost:8000/api/chatrooms/${chatroomId}/messages/`,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return res.data;
  } catch (error) {
    console.error("Failed to get messages:", error);
    return [];
  }
};

// Helper: Send a message to a chatroom
const sendChatMessage = async (
  chatroomId: number,
  content: string,
  token: string | null
) => {
  try {
    const res = await axios.post(
      `http://localhost:8000/api/chatrooms/${chatroomId}/messages/`,
      { content },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return res.data;
  } catch (error) {
    console.error("Failed to send message:", error);
    return null;
  }
};

export default function UserChat() {
  const [token, setToken] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [users, setUsers] = useState<any[]>([]);
  const [selectedRoomId, setSelectedRoomId] = useState<number | null>(null);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [messageInput, setMessageInput] = useState("");

  // Load token, userId, and current user from localStorage
  useEffect(() => {
    const access =
      typeof window !== "undefined" ? localStorage.getItem("access") : null;
    const id =
      typeof window !== "undefined" ? localStorage.getItem("user_id") : null;
    const userInfo =
      typeof window !== "undefined" ? localStorage.getItem("user") : null;

    setToken(access);
    setUserId(id);

    if (userInfo) {
      try {
        setCurrentUser(JSON.parse(userInfo));
      } catch (error) {
        console.error("Failed to parse user info from localStorage:", error);
      }
    }
  }, []);

  // Load users list based on current user's role
  useEffect(() => {
    if (!token || !currentUser) return;

    axios
      .get("http://localhost:8000/api/users/", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setUsers(res.data))
      .catch((err) => console.error("Failed to load users", err));
  }, [token, currentUser]);

  // Load messages when chatroom is selected
  useEffect(() => {
    if (!selectedRoomId || !token) return;
    getMessages(selectedRoomId, token).then(setMessages);
  }, [selectedRoomId, token]);

  const openChatWithUser = async (userId: number) => {
    const user = users.find((u) => u.id === userId);
    setSelectedUser(user);

    try {
      const res = await axios.post(
        "http://localhost:8000/api/chatrooms/",
        { other_user_id: userId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setSelectedRoomId(res.data.id);
    } catch (error: any) {
      if (
        error.response &&
        error.response.data &&
        error.response.data.detail === "Chatroom already exists"
      ) {
        try {
          const existing = await axios.get(
            "http://localhost:8000/api/chatrooms/",
            { headers: { Authorization: `Bearer ${token}` } }
          );
          const found = existing.data.find(
            (room: any) => room.farmer === userId || room.buyer === userId
          );
          if (found) setSelectedRoomId(found.id);
        } catch (err) {
          console.error("Failed to fetch existing chatroom", err);
        }
      } else {
        console.error("Chatroom error:", error.response?.data || error);
      }
    }
  };

  const sendMessage = async () => {
    if (!messageInput.trim() || !token || !selectedRoomId) return;

    try {
      await sendChatMessage(selectedRoomId, messageInput, token);
      setMessageInput("");
      const msgs = await getMessages(selectedRoomId, token);
      setMessages(msgs);
    } catch (err) {
      console.error("Send or fetch error", err);
    }
  };

  // Get the appropriate title based on user role
  const getSidebarTitle = () => {
    if (!currentUser) return "Loading...";
    return currentUser.is_farmer
      ? "Buyers who messaged you"
      : "Available Farmers";
  };

  return (
    <>
      <Navbar />

      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 px-4 py-8">
        {/* Chat Container */}
        <div className="w-full max-w-5xl h-[500px] bg-white rounded-xl shadow-xl flex overflow-hidden">
          {/* Sidebar */}
          <div className="w-1/3 bg-gray-50 border-r overflow-y-auto p-4">
            <h2 className="text-xl font-semibold text-gray-700 mb-4">
              {getSidebarTitle()}
            </h2>

            <div className="space-y-2">
              {users.map((user) => (
                <div
                  key={user.id}
                  onClick={() => openChatWithUser(user.id)}
                  className="flex items-center gap-2 p-3 rounded-lg cursor-pointer hover:bg-blue-100 transition"
                >
                  <User className="w-5 h-5 text-blue-600 fill-blue-100" />
                  <div className="flex-1">
                    <span className="text-sm font-medium text-gray-700">
                      {user.first_name || user.email}
                    </span>
                    {user.last_message && (
                      <p className="text-xs text-gray-500 truncate">
                        {user.last_message}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Chat Area */}
          <div className="w-2/3 flex flex-col">
            {/* Chat Header */}
            {selectedUser && (
              <div className="border-b px-4 py-2 bg-blue-50 text-gray-800 font-medium">
                Chatting with: {selectedUser.first_name || selectedUser.email}
              </div>
            )}

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {selectedRoomId ? (
                messages.map((msg) => {
                  const isSender = msg.sender == userId;
                  return (
                    <div
                      key={msg.id}
                      className={`flex ${
                        isSender ? "justify-end" : "justify-start"
                      }`}
                    >
                      <div
                        className={`max-w-xs lg:max-w-md px-4 py-2 rounded-2xl shadow
              ${
                isSender
                  ? "bg-blue-500 text-white rounded-br-none self-end"
                  : "bg-gray-200 text-gray-800 rounded-bl-none self-start"
              }`}
                        style={{
                          borderBottomRightRadius: isSender ? 0 : undefined,
                          borderBottomLeftRadius: !isSender ? 0 : undefined,
                        }}
                      >
                        <p className="text-sm">{msg.content}</p>
                        <span
                          className={`text-xs block mt-1 ${
                            isSender ? "text-blue-100" : "text-gray-500"
                          }`}
                        >
                          {new Date(msg.timestamp).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                      </div>
                    </div>
                  );
                })
              ) : (
                <p className="text-center text-gray-400 mt-10">
                  Select a {currentUser?.is_farmer ? "buyer" : "farmer"} to
                  start messaging
                </p>
              )}
            </div>
            {/* Input */}
            {selectedRoomId && (
              <div className="p-4 border-t flex items-center gap-2">
                <input
                  type="text"
                  value={messageInput}
                  onChange={(e) => setMessageInput(e.target.value)}
                  className="flex-1 border rounded p-2"
                  placeholder="Type your message..."
                  onKeyPress={(e) => e.key === "Enter" && sendMessage()}
                />
                <button
                  onClick={sendMessage}
                  className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
                >
                  Send
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
}
