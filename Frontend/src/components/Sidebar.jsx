import "./Sidebar.css";
import { MyContext } from "../MyContext";
import { useContext, useEffect, useState, useRef } from "react";
import { v1 as uuidv1 } from "uuid";
import serverUrl from "../environment";

function Sidebar() {
  const {
    allThreads,
    setAllThreads,
    currThreadId,
    setNewChat,
    setPrompt,
    setReply,
    setCurrThreadId,
    setPrevChats,
  } = useContext(MyContext);

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const sidebarRef = useRef(null);

  // ✅ Fetch all threads
  const getAllThreads = async () => {
    try {
      const response = await fetch(`${serverUrl}/api/thread`);
      const data = await response.json();
      const filteredData = data.map((thread) => ({
        threadId: thread.threadId,
        title: thread.title,
      }));
      setAllThreads(filteredData);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    getAllThreads();
  }, [currThreadId]);

  // ✅ Close sidebar when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        sidebarRef.current &&
        !sidebarRef.current.contains(e.target) &&
        e.target.closest(".hamburger-menu") === null
      ) {
        setIsSidebarOpen(false);
      }
    };

    if (isSidebarOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isSidebarOpen]);

  const createNewChat = () => {
    setNewChat(true);
    setPrompt("");
    setReply(null);
    setCurrThreadId(uuidv1());
    setPrevChats([]);
    setIsSidebarOpen(false);
  };

  const changeThread = async (newThreadId) => {
    setCurrThreadId(newThreadId);
    try {
      const response = await fetch(`${serverUrl}/api/thread/${newThreadId}`);
      const data = await response.json();
      setPrevChats(data);
      setNewChat(false);
      setReply(null);
      setIsSidebarOpen(false);
    } catch (err) {
      console.log(err);
    }
  };

  const deleteThread = async (ThreadId) => {
    try {
      const response = await fetch(`${serverUrl}/api/thread/${ThreadId}`, {
        method: "DELETE",
      });
      await response.json();
      setCurrThreadId(uuidv1());
      setPrevChats([]);
      setNewChat(true);
      setReply(null);
      getAllThreads();
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <>
      {/* ✅ Hamburger icon - visible only when sidebar closed */}
      {!isSidebarOpen && (
        <div className="hamburger-menu" onClick={() => setIsSidebarOpen(true)}>
          <i className="fa-solid fa-bars"></i>
        </div>
      )}

      {/* ✅ Sidebar */}
      <section
        ref={sidebarRef}
        className={`sidebar ${isSidebarOpen ? "open" : ""}`}
      >
        <button onClick={createNewChat}>
          <img src="/gpt-logo.png" alt="GPT logo" className="logo" />
          <span>
            <i className="fa-solid fa-pen-to-square"></i>
          </span>
        </button>

        <ul className="thread">
          {allThreads?.map((thread, idx) => (
            <li
              key={idx}
              onClick={() => changeThread(thread.threadId)}
              className={currThreadId === thread.threadId ? "active" : ""}
            >
              {thread.title}
              <i
                className="fa-solid fa-trash"
                onClick={(e) => {
                  e.stopPropagation();
                  deleteThread(thread.threadId);
                }}
              ></i>
            </li>
          ))}
        </ul>

        <div className="sign">
          <p>Developed by Mohd Asif &hearts;</p>
        </div>
      </section>
    </>
  );
}

export default Sidebar;
