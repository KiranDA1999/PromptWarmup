import express from 'express';
import cors from 'cors';
import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || 'MISSING_KEY');

const promptTemplate = `
Convert the following messy real-world input into structured JSON with:
- intent (category like medical, emergency, travel, admin, etc.)
- entities (array of string key entities extracted)
- urgency (low, medium, high)
- actions (array of string recommended step-by-step actions)

Ensure the output is strictly valid JSON matching this exact structure:
{
  "intent": "string",
  "entities": ["string"],
  "urgency": "low|medium|high",
  "actions": ["string"]
}

Input: {INPUT}
`;

app.post('/api/process', async (req, res) => {
  try {
    const { input } = req.body;
    if (!input) {
      return res.status(400).json({ error: 'Input is required' });
    }

    if (!process.env.GEMINI_API_KEY) {
      return res.status(500).json({ error: 'GEMINI_API_KEY is not configured on the server.' });
    }

    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-lite" });
    const prompt = promptTemplate.replace('{INPUT}', input);
    
    const result = await model.generateContent(prompt);
    const response = await result.response;
    let text = response.text();
    
    // Clean markdown JSON formatting if present
    text = text.replace(/\`\`\`json/g, '').replace(/\`\`\`/g, '').trim();
    
    // Parse JSON
    const structuredData = JSON.parse(text);
    res.json(structuredData);

  } catch (error) {
    console.error("Error processing input:", error);
    res.status(500).json({ error: 'Failed to process input.', details: error.message });
  }
});

if (process.env.NODE_ENV !== 'production') {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`Universal Bridge Backend is running on port ${PORT}`);
  });
}

export default app;
