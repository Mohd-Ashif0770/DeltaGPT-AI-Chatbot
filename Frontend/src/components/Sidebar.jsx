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
  const [isMobile, setIsMobile] = useState(window.innerWidth < 992);
  const sidebarRef = useRef(null);
  const overlayRef = useRef(null);

  // ✅ Detect mobile/desktop viewport
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 992;
      setIsMobile(mobile);
      // On desktop, always show sidebar; on mobile, close it
      if (!mobile) {
        setIsSidebarOpen(false);
      }
    };

    handleResize(); // Initial check
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

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

  // ✅ Close sidebar function
  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };

  // ✅ Close sidebar when clicking outside or on overlay
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (isMobile && isSidebarOpen) {
        if (
          sidebarRef.current &&
          !sidebarRef.current.contains(e.target) &&
          e.target.closest(".hamburger-menu") === null
        ) {
          closeSidebar();
        }
        // Close when clicking on overlay
        if (overlayRef.current && e.target === overlayRef.current) {
          closeSidebar();
        }
      }
    };

    if (isMobile && isSidebarOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isMobile, isSidebarOpen]);

  // ✅ ESC key handler to close sidebar
  useEffect(() => {
    const handleEscKey = (e) => {
      if (e.key === "Escape" && isMobile && isSidebarOpen) {
        closeSidebar();
      }
    };

    if (isMobile && isSidebarOpen) {
      document.addEventListener("keydown", handleEscKey);
    }

    return () => {
      document.removeEventListener("keydown", handleEscKey);
    };
  }, [isMobile, isSidebarOpen]);

  // ✅ Lock body scroll when sidebar is open on mobile
  useEffect(() => {
    if (isMobile && isSidebarOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [isMobile, isSidebarOpen]);

  const createNewChat = () => {
    setNewChat(true);
    setPrompt("");
    setReply(null);
    setCurrThreadId(uuidv1());
    setPrevChats([]);
    if (isMobile) {
      closeSidebar();
    }
  };

  const changeThread = async (newThreadId) => {
    setCurrThreadId(newThreadId);
    try {
      const response = await fetch(`${serverUrl}/api/thread/${newThreadId}`);
      const data = await response.json();
      setPrevChats(data);
      setNewChat(false);
      setReply(null);
      if (isMobile) {
        closeSidebar();
      }
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
      {/* ✅ Overlay - visible on mobile when sidebar is open */}
      {isMobile && isSidebarOpen && (
        <div
          ref={overlayRef}
          className="sidebar-overlay"
          onClick={closeSidebar}
          aria-hidden="true"
        />
      )}

      {/* ✅ Hamburger icon - visible on mobile when sidebar is closed */}
      {isMobile && !isSidebarOpen && (
        <div className="hamburger-menu" onClick={() => setIsSidebarOpen(true)}>
          <i className="fa-solid fa-bars"></i>
        </div>
      )}

      {/* ✅ Sidebar */}
      <section
        ref={sidebarRef}
        className={`sidebar ${isMobile ? (isSidebarOpen ? "open" : "") : "desktop-open"}`}
      >
        {/* ✅ Close button (X) - visible on mobile */}
        {isMobile && isSidebarOpen && (
          <button
            className="sidebar-close-btn"
            onClick={closeSidebar}
            aria-label="Close sidebar"
          >
            <i className="fa-solid fa-xmark"></i>
          </button>
        )}

        <button onClick={createNewChat} className="new-chat-btn">
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
              <span>{thread.title}</span>
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
