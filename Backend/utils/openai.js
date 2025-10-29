import dotenv from 'dotenv';

dotenv.config();


const getOpenAiApiResponse = async (message)=>{
    const options = {
        method: "POST",
        headers:{
            "Content-Type": "application/json",
            "Authorization": `Bearer ${process.env.OpenAI_API_Key}`,
        },
        body: JSON.stringify({
            model: "gpt-4o-mini",
            messages:[{
                role: "user",
                content: message,
            }]
        })
    }

    try{
        const response = await fetch("https://api.openai.com/v1/chat/completions", options);
        const data = await response.json();
        return (data.choices[0].message.content);
    }catch(error){
        console.log(error);
    }
}

//! Using npm openai package
// const client = new OpenAI({
//   apiKey: process.env.OpenAI_API_Key,
// });

// const response = await client.responses.create({
//   model: 'gpt-4o-mini',
//   input: 'Joke about a BCA student',
// });

// console.log(response.output_text);

export default getOpenAiApiResponse;