import getTaskFromGroq from "../services/groq.service.js";

export const parseVoiceTask = async (req, res) => {
  try {
    const { text } = req.body;

    if (!text) {
      return res.status(400).json({ error: "Text is required" });
    }

    const groqResponse = await getTaskFromGroq(text);

    let task;
    try {
      task = JSON.parse(groqResponse);
    } catch (err) {
      console.error("Invalid groq JSON:", task);
      return res.status(500).json({ error: "Invalid AI response" });
    }

    const allowedPriorities = [
      "Low Priority",
      "High Priority",
      "Urgent",
      "Critical",
    ];

    if (!allowedPriorities.includes(task.priority)) {
      task.priority = "Low Priority";
    }

    task.status = "To Do";

    res.json({
      success: true,
      task,
    });
  } catch (error) {
    console.error("Voice parse failed:", error);
    res.status(500).json({ error: "Failed to parse voice task" });
  }
};
