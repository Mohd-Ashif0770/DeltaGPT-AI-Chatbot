import "./Sidebar.css";
import { MyContext } from '../MyContext';
import { useContext, useEffect} from 'react';
import {v1 as uuidv1} from 'uuid';

function Sidebar() {
  const {allThreads, setAllThreads, currThreadId, setNewChat, setPrompt, setReply, setCurrThreadId, setPrevChats} = useContext(MyContext);

  const getAllThreads = async()=>{
    try{
      const response = await fetch("http://localhost:8080/api/thread");
      const data = await response.json();
      const filteredData = data.map(thread=>({threadId:thread.threadId, title: thread.title}));
      // console.log(filteredData);
      setAllThreads(filteredData);
    }catch(err){
      console.log(err);
    }
  }

  useEffect(()=>{
    getAllThreads();
  }, [currThreadId])

  const createNewChat = ()=>{
    setNewChat(true);
    setPrompt("");
    setReply(null);
    setCurrThreadId(uuidv1());
    setPrevChats([]);

  }

  const changeThread = async (newThreadId)=>{
    setCurrThreadId(newThreadId);

    try{
      const response = await fetch(`http://localhost:8080/api/thread/${newThreadId}`);
      const data = await response.json();
      console.log(data);
      setPrevChats(data);
      setNewChat(false);
      setReply(null);

    }catch(err){
      console.log(err);
    }

  }

  const deleteThread = async(ThreadId)=>{
    try{
      const response = await fetch(`http://localhost:8080/api/thread/${ThreadId}`, {method:"DELETE"});
      const data = await response.json();
      console.log(data);
      setCurrThreadId(uuidv1());
      setPrevChats([]);
      setNewChat(true);
      setReply(null);
      getAllThreads();

    }catch(err){
      console.log(err);
    }
  }

  return (
    <section className="sidebar">
      {/* new chat button */}
      <button onClick={createNewChat}>
        <img src="src/assets/gpt-logo.png" alt="gpt logo" className="logo" />
        <span>
          <i className="fa-solid fa-pen-to-square"></i>
        </span>
      </button>

      {/* thread history */}
      <ul className="thread">
        {
          allThreads?.map((thread, idx)=>(
            <li key={idx} onClick={(e)=> changeThread(thread.threadId)}
            className={currThreadId===thread.threadId ? "active":"random"}

            > {thread.title}
            <i className="fa-solid fa-trash" onClick={(e)=>{
              e.stopPropagation();
              deleteThread(thread.threadId);
            }}></i>
            </li>
            
          ))
        }
      </ul>

      {/* extra info */}
      <div className="sign">
        <p>Developed by Mohd Asif &hearts;</p>
      </div>
    </section>
  );
}

export default Sidebar;
