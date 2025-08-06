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

      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-purple-100 px-4 py-8">
        <div
          className="w-full max-w-5xl h-[560px] bg-white rounded-3xl shadow-2xl flex overflow-hidden"
          style={{ borderRadius: 24 }}
        >
          {/* Sidebar */}
          <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
            <div className="flex items-center gap-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-5 border-b border-blue-100">
              <User className="w-6 h-6" />
              <h2 className="text-lg font-semibold tracking-wide">
                {getSidebarTitle()}
              </h2>
            </div>
            <div className="flex-1 overflow-y-auto bg-gray-50 px-4 py-3 space-y-3">
              {users.length === 0 && (
                <p className="text-center text-gray-400">No users available</p>
              )}
              {users.map((user) => (
                <div
                  key={user.id}
                  onClick={() => openChatWithUser(user.id)}
                  className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all ${
                    selectedUser?.id === user.id
                      ? "bg-blue-100 shadow-inner"
                      : "hover:bg-blue-50"
                  }`}
                >
                  <User className="w-5 h-5 text-blue-600" />
                  <div>
                    <p className="text-sm font-medium text-gray-800">
                      {user.first_name || user.email}
                    </p>
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
          <div className="flex-1 flex flex-col bg-gradient-to-br from-white to-blue-50">
            {/* Header */}
            <div className="flex items-center gap-3 bg-gradient-to-r from-blue-500 to-indigo-500 text-white px-6 py-4 border-b border-blue-200">
              <User className="w-6 h-6" />
              <h2 className="text-lg font-semibold">
                {selectedUser
                  ? `Chat with ${selectedUser.first_name || selectedUser.email}`
                  : "Select a user"}
              </h2>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {selectedRoomId ? (
                messages.map((msg) => {
                  const isSender = String(msg.sender) === userId;
                  const isFarmer = msg.is_farmer; // Assuming `is_farmer` is passed in message

                  return (
                    <div
                      key={msg.id}
                      className={`flex ${
                        isSender ? "justify-end" : "justify-start"
                      }`}
                    >
                      <div
                        className={`px-5 py-3 rounded-2xl shadow max-w-[80%] relative ${
                          isFarmer
                            ? isSender
                              ? "bg-blue-600 text-white"
                              : "bg-blue-100 text-gray-900"
                            : isSender
                            ? "bg-gray-800 text-white"
                            : "bg-gray-200 text-gray-900"
                        }`}
                        style={{
                          borderBottomRightRadius: isSender ? 0 : 16,
                          borderBottomLeftRadius: isSender ? 16 : 0,
                        }}
                      >
                        <p className="text-sm">{msg.content}</p>
                        <span
                          className={`text-xs mt-2 block text-right ${
                            isFarmer
                              ? isSender
                                ? "text-blue-200"
                                : "text-blue-600"
                              : isSender
                              ? "text-gray-400"
                              : "text-gray-500"
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
                <div className="text-center text-gray-400 mt-10">
                  Select a {currentUser?.is_farmer ? "buyer" : "farmer"} to
                  start messaging
                </div>
              )}
            </div>

            {/* Input */}
            {selectedRoomId && (
              <div className="p-4 bg-white border-t border-gray-200 flex items-center gap-3">
                <input
                  type="text"
                  value={messageInput}
                  onChange={(e) => setMessageInput(e.target.value)}
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400"
                  placeholder="Type your message..."
                  onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                />
                <button
                  onClick={sendMessage}
                  className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-xl transition"
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
