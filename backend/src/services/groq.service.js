import Groq from "groq-sdk";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export async function getTaskFromGroq(text) {
  const chatCompletion = await getGroqChatCompletion(text);
  return chatCompletion.choices[0]?.message?.content;
}

export async function getGroqChatCompletion(text) {
  return groq.chat.completions.create({
    messages: [
      {
        role: "user",
        content: `Extract a task from the text and return ONLY JSON.
        Fields:
        - title
        - description
        - priority: "Low Priority" | "High Priority" | "Urgent" | "Critical"
        - status: always "To Do"
        - dueDate: ISO datetime [YYYY-MM-DDTHH:mm]
        Text:
        "${text}"
        `,
      },
    ],
    model: "openai/gpt-oss-20b",
  });
}
export default getTaskFromGroq;
