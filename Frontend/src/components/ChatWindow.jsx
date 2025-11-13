import "./ChatWindow.css";
import Chat from "./Chat";
import { MyContext } from "../MyContext";
import { useContext, useState, useEffect } from "react";
import { ScaleLoader } from "react-spinners";
import serverUrl from "../environment.js";
import { toast } from "react-toastify";

function ChatWindow() {
  const {
    prompt,
    setPrompt,
    reply,
    setReply,
    currThreadId,
    prevChats,
    setPrevChats,
    setNewChat,
  } = useContext(MyContext);

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loader, setLoader] = useState(false);
  const [isOpen, setIsOpen] = useState(false); // Profile dropdown visibility

  // 🔹 Check login state on mount
  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token); // true if token exists
  }, []);

  // 🔹 Handle chat send
  const getReply = async () => {
    // ✅ Check login before sending message
    const token = localStorage.getItem("token");
    if (!token) {
      toast.warning("Please login to chat with DeltaGPT.");
      return;
    }

    setLoader(true);
    setNewChat(false);

    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        message: prompt,
        threadId: currThreadId,
      }),
    };

    try {
      const response = await fetch(`${serverUrl}/api/chat`, options);
      const res = await response.json();
      console.log(res.reply);
      setReply(res.reply);
    } catch (err) {
      console.log(err);
    }
    setLoader(false);
  };

  // 🔹 Append new chats to prevChats when reply changes
  useEffect(() => {
    if (prompt && reply) {
      setPrevChats((prev) => [
        ...prev,
        { role: "user", content: prompt },
        { role: "assistant", content: reply },
      ]);
    }
    setPrompt("");
  }, [reply]);

  // 🔹 Handle logout
  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    setIsOpen(false);
    window.location.reload(); // Refresh UI
  };

  return (
    <div className="chatWindow">
      <div className="chatWindow__accent" aria-hidden="true"></div>
      <div className="navbar d-flex justify-content-between align-items-center px-3">
        <div className="brand">
          <span className="brandBadge">
            <i className="fa-solid fa-bolt"></i>
          </span>
          <div className="brandCopy">
            <span className="fw-bold appName">
              DeltaGPT <i className="fa-solid fa-chevron-down"></i>
            </span>
            <span className="appTagline">
              Conversations that accelerate ideas
            </span>
          </div>
        </div>

        <div className="navActions">
          {isLoggedIn ? (
            // 🔸 Logged-in view → Profile icon
            <span className="userIcon" onClick={() => setIsOpen(!isOpen)}>
              <i className="fa-solid fa-user"></i>
            </span>
          ) : (
            // 🔸 Not logged in → Show Login / Register buttons
            <div className="authButtons" id="loginRegisterBtns">
              <a href="/login" className="ghostButton">
                Login
              </a>
              <a href="/signup" className="primaryButton">
                Get Started
              </a>
            </div>
          )}
        </div>
      </div>

      {/* 🔹 Profile Dropdown (only visible if logged in) */}
      {isLoggedIn && isOpen && (
        <div className="dropDown">
          <div className="dropDownItem">
            <i className="fa-solid fa-cloud-arrow-up"></i> Upgrade Plan
          </div>
          <div className="dropDownItem">
            <i className="fa-solid fa-gear"></i> Settings
          </div>
          <div className="dropDownItem" onClick={handleLogout}>
            <i className="fa-solid fa-right-from-bracket"></i> Log Out
          </div>
        </div>
      )}

      {/* 🔹 Chat Section */}
      <Chat />
      {loader && (
        <div className="chatLoader">
          <ScaleLoader color="#86ffda" loading={loader} />
        </div>
      )}

      {/* 🔹 Input Box */}
      <div className="chatInput">
        <div className="inputBox">
          <input
            id="chatPromptInput"
            type="text"
            placeholder="Ask anything..."
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={(e) => (e.key === "Enter" ? getReply() : null)}
          />
          <div id="submit" onClick={getReply}>
            <i className="fa-solid fa-paper-plane"></i>
          </div>
        </div>
        <div className="info">
          <p className="mt-1 smallDescription">
            DeltaGPT can make mistakes. Check important info. See Cookie
            Preferences.
          </p>
        </div>
      </div>
    </div>
  );
}

export default ChatWindow;
