# Universal Bridge AI

A production-ready, ultra-lightweight web application designed to convert messy, unstructured real-world input into structured, actionable JSON workflows using the Gemini API. 

## At a Glance
- **Framework-Free Client**: Vite + Vanilla HTML/CSS/JS for minimal bundle footprint (`size << 9 MB`).
- **Serverless Backend**: Minimal Express framework ready to be deployed natively on Vercel serverless.
- **Multimodal Inputs**: Text, Voice (Web Speech API), Image Uploads (Simulated Contextual Data).
- **Core Insights**: Intents, Key Entities, Actionable Steps, and Urgency Triage.
- **Micro-features**: Local response caching & dark mode.

## Installation & Setup 

### 1. Configure the Environment
Clone the repository, and make sure to copy over the configuration template:
```bash
cp .env.example .env
```
Add your `GEMINI_API_KEY` to the `.env` file. You can generate a free Gemini key in Google AI Studio.

### 2. Install Minimal Dependencies
```bash
npm install
```

### 3. Run Locally
We uniquely designed this build to concurrently boot the minimal backend locally and the blazing fast Vite hot-module replacement server for UI.
```bash
npm run dev
```
Navigate to localhost (`http://localhost:5173`) via the link shown in Vite.

## Deployment Instructions (Vercel)
This repository uses an incredibly clean and optimized `vercel.json` architecture.

1. Create a new project in the [Vercel Dashboard](https://vercel.com/dashboard).
2. Import this repository.
3. Vercel automatically detects **Vite** as a Frontend framework. Confirm it.
4. Go to Settings > Environment Variables in Vercel before you build, and add:
   - Name: `GEMINI_API_KEY` 
   - Value: `your_api_key_here`
5. Click **Deploy**. Vercel will build `/client` utilizing Vite natively, and expose the `/api/index.js` Express backend dynamically out-of-the-box as an optimized serverless function handler.

## Example Usage
- **Input**: "my dad chest pain since morning"
- **Output**: ⚠️ HIGH Urgency, Intent: Medical Emergency, Actions: Setup immediate transport, contact ER.

*Developed as a robust system focused purely on lightweight functional intelligence & structural conversion without bloat.*
