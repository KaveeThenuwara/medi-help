# MediHelp AI Chatbot - LangChain + RAG Setup Guide (OpenAI)

## Overview
Your chatbot now uses **LangChain** with **Retrieval-Augmented Generation (RAG)** powered by **OpenAI GPT-3.5-turbo**. It retrieves relevant medical knowledge before generating responses using your OpenAI API key.

## Setup Steps

### 1. Get Your OpenAI API Key
- **Sign up**: https://platform.openai.com/signup
- **Get API Key**:
  - Go to https://platform.openai.com/api-keys
  - Click "Create new secret key"
  - Copy the key (save it safely)

### 2. Add API Key to Environment
Open `.env.local` in your project root and replace:
```
OPENAI_API_KEY=your_openai_api_key_here
```
With your actual key:
```
OPENAI_API_KEY=sk_live_xxxxxxxxxxxxxxxxxx
```

### 3. Install Dependencies
```bash
npm install
```

### 4. Run Your App
```bash
npm run dev
```

Visit `http://localhost:3000` and test the chatbot!

---

## How It Works

### 📚 RAG (Retrieval-Augmented Generation)
1. **Medical Knowledge Base**: Built-in medical information covering:
   - Common cold and flu
   - Migraines and headaches
   - Abdominal pain
   - Chest pain (with emergency alerts)
   - Cough, fever, nausea, back pain, etc.

2. **Retrieval**: When user inputs a symptom, the system:
   - Finds relevant medical documents from the knowledge base
   - Extracts the most relevant information

3. **Generation**: LangChain uses:
   - **OpenAI GPT-3.5-turbo** (fast & accurate)
   - The retrieved context
   - Conversation history
   - System prompt (medical assistant personality)

### 🔄 Conversation Flow
```
User: "I have a fever and cough"
  ↓
[Retrieval] → Finds: Cold/Flu symptoms, Fever management, Cough treatment
  ↓
[Generation] → GPT-3.5-turbo generates response using context + history
  ↓
Bot: "You might have a common cold or flu..."
```

---

## Project Structure

```
src/
├── app/
│   ├── api/
│   │   └── chat/
│   │       └── route.js          ← Backend API with LangChain + RAG + OpenAI
│   └── ...other pages
├── components/
│   └── ChatBot.jsx               ← Updated to use new API
└── ...
```

### Key Files

**[src/app/api/chat/route.js](src/app/api/chat/route.js)**
- LangChain + RAG implementation with OpenAI
- Medical knowledge base (500+ lines of medical info)
- Vector store for document retrieval
- OpenAI GPT-3.5-turbo integration

**[src/components/ChatBot.jsx](src/components/ChatBot.jsx)**
- Frontend UI component
- Calls `/api/chat` endpoint
- Real-time streaming responses
- Error handling

---

## Features Implemented

✅ **LangChain Integration** - Professional LLM chain with memory  
✅ **RAG System** - Medical knowledge retrieval system  
✅ **Vector Store** - In-memory document storage & retrieval  
✅ **Conversation Memory** - Maintains chat history for context  
✅ **OpenAI GPT-3.5-turbo** - Fast, accurate, reliable responses  
✅ **Error Handling** - Graceful API error handling  
✅ **Medical Safety** - Alerts for emergency symptoms  

---

## Pricing

OpenAI API is pay-as-you-go:
- **GPT-3.5-turbo**: ~$0.002 per 1K input tokens, $0.002 per 1K output tokens
- Typical chat response: 0.5-2 cents per message
- Free trial credits available when you sign up

---

## Troubleshooting

### "OPENAI_API_KEY is required"
- Make sure `.env.local` file exists in project root
- Check the API key is correctly pasted (without quotes)
- Verify key starts with `sk_live_` or `sk_test_`
- Restart the dev server after adding the key

### "Failed to get response" or "401 Unauthorized"
- Check your OpenAI API key is valid
- Verify your account has credits available
- Check if key has expired
- View server logs for detailed error

### Slow responses
- First response may take 2-5 seconds
- OpenAI is generally faster than free tier models
- This is normal behavior

### Want to reduce costs?
- Use GPT-4 for even better accuracy (higher cost)
- Cache responses for frequently asked questions
- Implement rate limiting for users

---

## Customization

### Add More Medical Knowledge
Edit [src/app/api/chat/route.js](src/app/api/chat/route.js) - add to `medicalKnowledgeBase` string

### Change LLM Model
In [route.js](src/app/api/chat/route.js), change:
```javascript
modelName: "gpt-3.5-turbo"  // ← Change this
```

Other options:
- `gpt-4` - Most powerful, slower, more expensive
- `gpt-4-turbo` - Good balance of power and speed
- `gpt-3.5-turbo` - Fast and cheap (default)

### Implement Better Vector Store
Replace in-memory vector store with:
- **Chroma** - Easy vector DB
- **Pinecone** - Cloud vector DB (has free tier)
- **Weaviate** - Open source vector DB
- **OpenAI Embeddings** - Better semantic search

---

## Next Steps

1. ✅ Get OpenAI API key
2. ✅ Add to `.env.local`
3. ✅ Run `npm install`
4. ✅ Start with `npm run dev`
5. Test the chatbot
6. (Optional) Add more medical knowledge
7. (Optional) Customize the system prompt
8. (Optional) Monitor usage and costs

---

## Support

If you have issues:
1. Check the `.env.local` file exists with valid key
2. View browser console for frontend errors (F12)
3. Check terminal for backend errors
4. Verify OpenAI account has API access enabled
5. Check your account credits/billing at https://platform.openai.com/account/billing

Happy building! 🏥✨

