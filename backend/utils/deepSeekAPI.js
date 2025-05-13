// utils/deepSeekAPI.js
import fetch from 'node-fetch';
import dotenv from 'dotenv';
dotenv.config();

export const modifyComplaintContent = async ({ userName, deptName, problem, address, phone }, language = "English") => {
  try {
    // **Refined Prompt without Unwanted Notes**
    const prompt = language === "Hindi"
      ? `Convert this complaint into a formal, grammatically correct Hindi application without changing the original meaning. Use clear and concise language, but avoid adding any unnecessary notes or disclaimers. Include only the following details:
User Name: ${userName}
Department Name: ${deptName}
Problem: ${problem}
Address: ${address || 'Not Provided'}
Phone: ${phone || 'Not Provided'}
Original Problem: ${problem}`
      : `Convert this complaint into a formal, grammatically correct English application without changing the original meaning. Use clear and concise language, but avoid adding any unnecessary notes or disclaimers. Include only the following details:
User Name: ${userName}
Department Name: ${deptName}
Problem: ${problem}
Address: ${address || 'Not Provided'}
Phone: ${phone || 'Not Provided'}
Original Problem: ${problem}`;

    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
        "HTTP-Referer": process.env.SITE_URL,
        "X-Title": process.env.SITE_NAME,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        "model": "deepseek/deepseek-r1:free",
        "messages": [{ "role": "user", "content": prompt }]
      })
    });

    const data = await response.json();

    // **Return the cleaned content without trimming**
    return data.choices[0].message.content.replace(/(\*\*नोट:.*|Note:.*)/g, '').trim();
    
  } catch (error) {
    console.error("Error modifying complaint content:", error);
    throw new Error("Failed to modify complaint content");
  }
};
