import express from "express";
import Thread from "../models/Thread.js";
import getOpenAiApiResponse from "../utils/openai.js"

const router = express.Router();

//test
router.post("/test", async (req, res) => {
  try {
    const thread = new Thread({
      threadId: "2123AI",
      title: "Future of Web Dev",
    });
    const response = await thread.save();
    res.send(response);
  } catch (err) {
    console.log(`Error to saving data ${err}`);
    res.status(500).json({
      error: "Failed to save in db",
    });
  }
});

//!Get all threads
router.get("/thread", async (req, res) => {
  try {
    const threads = await Thread.find({}).sort({ updatedAt: -1 }); //desending order for updatedAt...most recent data on top
    res.json(threads);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Failed to fatch threads" });
  }
});

//!Get individual thread
router.get("/thread/:threadId", async (req, res) => {
    const {threadId} = req.params;
  try {
    const thread = await Thread.findOne({threadId});
    if(!thread){
        res.status(404).json({message:"Thread not found"})

    }
    res.json(thread.messages);

  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Failed to fatch chat" });
  }
});

//! Delete thread
router.delete("/thread/:threadId", async (req, res) => {
    const {threadId} = req.params;
  try {
    const deletedThread = await Thread.findOneAndDelete({threadId});
    if(!deletedThread){
        res.status(404).json({message:"Thread not found"})

    }
    res.status(200).json({success:"Thread deleted successfully"});

  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Failed to delete thread" });
  }
});

//! Chat route (Important)
router.post("/chat", async (req, res)=>{
  const {threadId, message} = req.body;

  if(!threadId || !message){
    return res.status(400).json({error: "Missing required fields"})
  }
  try{
    let thread = await Thread.findOne({threadId});

    if(!thread){
      //create new thread
        thread = new Thread({
        threadId,
        title:message,
        messages:[{role:"user", content:message}]
      })
    }else{
      thread.messages.push({role:"user", content:message})
    }

    const assistantReply = await getOpenAiApiResponse(message)
    thread.messages.push({role:"assistant", content: assistantReply});

    thread.updatedAt= new Date();
    await thread.save();
    res.json({reply:assistantReply});

  }catch(err){
    console.log(err);
    res.status(500).json({ error: "Something went wrong" });

  }
})
export default router;
