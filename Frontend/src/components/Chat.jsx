import { useContext, useEffect, useState } from "react";
import { MyContext } from "../MyContext";
import "./Chat.css";
import ReactMarkdown from "react-markdown";
import RehypeHightlight from "rehype-highlight";
import "highlight.js/styles/atom-one-dark.css";

function Chat() {
  const { newChat, prevChats, reply } = useContext(MyContext);
  const [latestReply, setLatestReply] = useState(null);

  useEffect(() => {
    if (reply === null) {
      setLatestReply(null);
      return;
    }
    if (!prevChats?.length) return;

    const content = reply.split(" ");
    let idx = 0;
    const interval = setInterval(() => {
      setLatestReply(content.slice(0, idx + 1).join(" "));
      idx++;
      if (idx >= content.length) {
        return clearInterval(interval);
      }
    }, 80);

    return () => clearInterval(interval);
  }, [prevChats, reply]);

  return (
    <>
      {newChat && (
        <section className="welcome">
          <h1>Welcome to DeltaGPT</h1>
        </section>
      )}

      <div className="chats">
        {prevChats?.slice(0, -1).map((chat, idx) => (
          <div
            className={chat.role === "user" ? "userDiv" : "gptDiv"}
            key={idx}
          >
            {chat.role === "user" ? (
              <p className="userMessage">{chat.content}</p>
            ) : (
              <div className="gptMessage">
                <ReactMarkdown rehypePlugins={[RehypeHightlight]}>
                  {chat.content}
                </ReactMarkdown>
              </div>
            )}
          </div>
        ))}

        {prevChats?.length > 0 && latestReply !== null && (
          <div className="gptDiv">
            <div className="gptMessage">
              <ReactMarkdown rehypePlugins={[RehypeHightlight]}>
                {latestReply}
              </ReactMarkdown>
            </div>
          </div>
        )}

        {prevChats?.length > 0 && latestReply === null && (
          <div className="gptDiv">
            <div className="gptMessage">
              <ReactMarkdown rehypePlugins={[RehypeHightlight]}>
                {prevChats[prevChats.length - 1].content}
              </ReactMarkdown>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default Chat;
