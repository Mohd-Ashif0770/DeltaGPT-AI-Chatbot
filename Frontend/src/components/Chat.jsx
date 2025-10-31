import { useContext, useEffect, useState} from "react"
import { MyContext } from "../MyContext"
import './Chat.css'
import ReactMarkdown from 'react-markdown';
import RehypeHightlight from 'rehype-highlight';
import 'highlight.js/styles/atom-one-dark.css';
// import 'highlight.js/styles/github-dark.css';

function  Chat() {
  const {newChat, prevChats, reply} = useContext(MyContext)
  const [latestReply, setLatestReply] = useState(null)

  useEffect(()=>{
    if(reply === null) {
      setLatestReply(null);
      return;
    }
    //latest reply seprate => create tying effect
    if(!prevChats?.length) return;

    const content = reply.split(" "); //individual words

    let idx =0;    
    const interval = setInterval(()=>{
      setLatestReply(content.slice(0, idx+1).join(" "))
      idx++;
      if(idx >= content.length){
        return clearInterval(interval)
      }
    },80)
    return ()=> clearInterval(interval)

  },[prevChats, reply])
  
  return (
    <>
      {newChat && <h2 id="startnewchat">Start a New Chat</h2>}
      <div className="chats">
        {
           prevChats?.slice(0, -1).map((chat,idx)=>{
            return(
             <div className={chat.role === "user"? "userDiv" : "gptDiv"} key={idx} >
               {
                chat.role === 'user'?
                <p className="userMessage">{chat.content}</p>:
                <ReactMarkdown  rehypePlugins={[RehypeHightlight]}>{chat.content}</ReactMarkdown>
               }

             </div>
            );
           })
        }

        {/* Printing tying effect */}
        {
          prevChats?.length > 0 && latestReply !==null &&
          <div className="gptDiv">
            <ReactMarkdown  rehypePlugins={[RehypeHightlight]}>{latestReply}</ReactMarkdown>
          </div>
        }

        {
          prevChats?.length > 0 && latestReply ===null &&
          <div className="gptDiv">
            <ReactMarkdown  rehypePlugins={[RehypeHightlight]}>{prevChats[prevChats.length-1].content}</ReactMarkdown>
          </div>
        }
      </div>
    </>
  )
}

export default Chat