let isProduction = true;

const serverUrl = isProduction ? "https://deltagpt-chatbot.onrender.com" : "http://localhost:8080";  

export default serverUrl;