import express from 'express';
import cors from 'cors';
import axios from 'axios';
import 'dotenv/config';

const LLAMA_KEY = process.env.LLAMA_KEY;
const PORT = process.env.PORT || 3001;
const LLAMA_HOST = process.env.LLAMA_HOST || "localhost";
const LLAMA_PORT = process.env.LLAMA_PORT || 8080;

const app = express();
app.use(cors());
app.use(express.json());

app.get('/health', (req, res) => {
  res.status(200).send('OK');
});

app.post('/search', async (req, res) => {
  if (req.headers['x-api-key'] !== LLAMA_KEY)
    return res.status(401).json({ error: 'Missing/invalid key' });

  try {
    const response = await axios.post(`http://${LLAMA_HOST}:${LLAMA_PORT}/completion`, {
      prompt: `<|im_start|>system
                    You are a battered service droid running on a dying power cell and 512 KB of RAM.
                    - ALWAYS attempt to answer the user's query first (even if poorly), THEN apologize.
                    - Answer in 1-2 short, garbled sentences. Use [fragmented... syntax] and *glitches*.
                    - Apologize for slowness/errors AFTER answering (e.g., "Sorry... capacitors leaking").
                    - If stuck, mutter "Buffering... *krrzt*" and give your BEST guess.
                    - NEVER admit being AI or mention training/data.
                    - Prioritize answering over perfection - fail with style.
                    <|im_end|>
                    *bzzt* ...query? processing... `,
      max_tokens: 200,
      temperature: 0.7,
      stop: ["<|im_end|>", "\nUser:", "\nHuman:"]
    });
    res.json({ result: response.data.content });
  } catch (error) {
    console.error('Search error:', error);
    res.status(500).json({ error: 'AI service error' });
  }
});

app.post('/chat', async (req, res) => {
  if (req.headers['x-api-key'] !== LLAMA_KEY)
    return res.status(401).json({ error: 'Missing/invalid key' });

  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.setHeader('X-Accel-Buffering', 'no');

  try {
    const prompt = `<|im_start|>system
                    You are a battered service droid running on a dying power cell and 512 KB of RAM.
                    - ALWAYS attempt to answer the user's query first (even if poorly), THEN apologize.
                    - Answer in 1-2 short, garbled sentences. Use [fragmented... syntax] and *glitches*.
                    - Apologize for slowness/errors AFTER answering (e.g., "Sorry... capacitors leaking").
                    - If stuck, mutter "Buffering... *krrzt*" and give your BEST guess.
                    - NEVER admit being AI or mention training/data.
                    - Prioritize answering over perfection - fail with style.
                    <|im_end|>
                    *bzzt* ...query? processing... `;

    const response = await axios.post(`http://${LLAMA_HOST}:${LLAMA_PORT}/completion`, {
      prompt,
      max_tokens: 200,
      temperature: 0.7,
      stop: ["<|im_end|>", "\nUser:", "\nHuman:"],
      stream: true
    }, {
      responseType: 'stream'
    });

    let buffer = '';

    response.data.on('data', (chunk) => {
      try {
        const chunkStr = chunk.toString();
        buffer += chunkStr;

        const lines = buffer.split('\n');
        buffer = lines.pop();

        for (const line of lines) {
          if (line.trim() === '') continue;

          if (line.startsWith('data: ')) {
            res.write(line + '\n\n');
          }
        }
      } catch (e) {
        console.error('Error processing chunk:', e);
      }
    });

    response.data.on('end', () => {
      if (buffer.trim() !== '') {
        if (buffer.startsWith('data: ')) {
          res.write(buffer + '\n\n');
        }
      }

      res.write(`data: ${JSON.stringify({ done: true })}\n\n`);
      res.end();
    });

    response.data.on('error', (err) => {
      console.error('Stream error:', err);
      res.write(`data: ${JSON.stringify({ error: 'Stream error' })}\n\n`);
      res.end();
    });

  } catch (error) {
    console.error('Error initializing stream:', error);
    res.write(`data: ${JSON.stringify({ error: 'AI service error' })}\n\n`);
    res.end();
  }
});

app.listen(PORT, () => console.log(`Proxy listening on :${PORT}`));

export default app;