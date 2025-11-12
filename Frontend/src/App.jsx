import { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import Sidebar from "./components/Sidebar";
import ChatWindow from "./components/ChatWindow";
import Signup from "./components/Signup";
import Login from "./components/Login";
import { MyContext } from "./MyContext";
import { v1 as uuidv1 } from "uuid";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  const [prompt, setPrompt] = useState("");
  const [reply, setReply] = useState(null);
  const [currThreadId, setCurrThreadId] = useState(uuidv1());
  const [prevChats, setPrevChats] = useState([]); // Stores all chats of current thread
  const [newChat, setNewChat] = useState(true);
  const [allThreads, setAllThreads] = useState([]); // Stores all threads

  const providerValues = {
    prompt,
    setPrompt,
    reply,
    setReply,
    currThreadId,
    setCurrThreadId,
    newChat,
    setNewChat,
    prevChats,
    setPrevChats,
    allThreads,
    setAllThreads,
  };

  return (
    <MyContext.Provider value={providerValues}>
      <Router>
        <div className="app">
          <Routes>
            {/* 🔹 Home/Chat Page */}
            <Route
              path="/"
              element={
                <>
                  <Sidebar />
                  <ChatWindow />
                </>
              }
            />

            {/* 🔹 Auth Pages */}
            <Route path="/signup" element={<Signup />} />
            <Route path="/login" element={<Login />} />
          </Routes>
        </div>
      </Router>

       {/* Your app code */}
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        pauseOnHover
        // theme="colored"
      />
    </MyContext.Provider>
  );
}

export default App;
