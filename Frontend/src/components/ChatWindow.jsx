import './ChatWindow.css'
import Chat from "./Chat";
import { MyContext } from '../MyContext';
import { useContext, useState, useEffect} from 'react';
import {ScaleLoader} from 'react-spinners'
import serverUrl from '../environment.js';


function ChatWindow() {
  const {prompt, setPrompt, reply, setReply, currThreadId, prevChats, setPrevChats , setNewChat} = useContext(MyContext);
  const [loader, setLoader] = useState(false);
  const [isOpen, setIsOpen] = useState(false); //Keep it false by default
  const getReply = async ()=>{
    setLoader(true);
    setNewChat(false);
    const options={
      method:"POST",
      headers:{
        "Content-Type": "application/json"
      },
      body:JSON.stringify({
        message:prompt,
        threadId:currThreadId
      })
    };

    try{
      const response = await fetch(`${serverUrl}/api/chat`, options);
      const res = await response.json();
      console.log(res.reply);
      setReply(res.reply);

    }catch(err){
      console.log(err);
    }
    setLoader(false)

  }

  // Append new chats to prevChats
  useEffect(()=>{
    if(prompt && reply){
      setPrevChats(prevChats=>(
        [...prevChats, {
          role:"user",
          content:prompt
        },{
          role:"assistant",
          content:reply
        }]
      ));
    }

    setPrompt("");

  },[reply])



  return (
    <div className="chatWindow">
      <div className="navbar">
        <span>
          DeltaGPT <i className="fa-solid fa-chevron-down"></i>
        </span>
        <div className="userIconDiv" onClick={()=> setIsOpen(!isOpen)}>
          <span className='userIcon'><i className="fa-solid fa-user"></i></span>
        </div>
      </div>

      {/* Profile Dropdwon */}
      {
        isOpen &&
        <div className="dropDown">
          <div className="dropDownItem"><i class="fa-solid fa-cloud-arrow-up"></i>Upgrade Plan</div>
          <div className="dropDownItem"><i class="fa-solid fa-gear"></i>Settings</div>
          <div className="dropDownItem"><i class="fa-solid fa-right-from-bracket"></i>LogOut</div>
        </div>
      }
      <Chat></Chat>
      <ScaleLoader color='#fff' loading={loader}></ScaleLoader>
      <div className="chatInput">
        <div className="inputBox">
          <input type="text" placeholder="Ask anything"
              value={prompt}
              onChange={(e)=> setPrompt(e.target.value)} 
              onKeyDown={(e)=> e.key === 'Enter'? getReply(): ""}
          />
          <div id="submit" onClick={getReply}><i className="fa-solid fa-paper-plane"></i></div>
        </div>
        <div className="info">
          <p>DeltaGPT can make mistakes. Check important info. See Cookie Preferences.</p>
        </div>
      </div>
    </div>
  );
}

export default ChatWindow;
