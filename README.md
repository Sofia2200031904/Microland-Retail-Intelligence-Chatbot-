# Retail Intelligence Chatbot Platform

Microland case study-ready full-stack starter for a retail chatbot that answers questions about inventory, sales, products, recommendations, charts, and basic customer support.

## 1. System Architecture

### Simple flow

1. User types or speaks a question in the React chat UI.
2. Axios sends the question to the Express backend.
3. The backend detects the intent using keyword rules.
4. The backend reads product and sales data from MongoDB.
5. If MongoDB is not connected yet, the app safely falls back to sample in-memory data.
6. The backend returns a structured response with text, chart data, and recommendations.
7. React renders the answer in the chat window and shows a chart when needed.

### Request flow diagram

```mermaid
flowchart LR
  A["User (Text / Voice)"] --> B["React + Tailwind Chat UI"]
  B --> C["Axios API Service"]
  C --> D["Express /api/chat"]
  D --> E["Intent Detection Service"]
  E --> F["MongoDB / Sample Data"]
  E --> G["Analytics + Recommendation Logic"]
  F --> D
  G --> D
  D --> H["Structured JSON Response"]
  H --> B
  B --> I["Text Reply + Charts + Product Cards"]
```

## 2. Install From Absolute Beginning

### Required tools

1. Install Node.js LTS.
2. Install VS Code.
3. Install MongoDB Community Server locally, or create a MongoDB Atlas cluster.

### Quick setup

```powershell
cd "C:\Users\Challa_Smile _Sofia\Downloads\1"
code .
```

Open two VS Code terminals later: one for `server`, one for `client`.

## 3. Folder Structure

```text
retail-intelligence-chatbot/
├── client/
│   ├── public/
│   ├── src/
│   │   ├── api/
│   │   ├── components/
│   │   ├── data/
│   │   ├── hooks/
│   │   └── utils/
│   ├── .env.example
│   ├── index.html
│   ├── package.json
│   ├── postcss.config.js
│   ├── tailwind.config.js
│   └── vite.config.js
├── server/
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── data/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── services/
│   │   └── utils/
│   ├── .env.example
│   └── package.json
└── README.md
```

## 4. Step-by-Step Build Guide

### Step 1. Setup frontend (React + Tailwind)

Purpose: create the React app shell, Vite config, and Tailwind styling.

Files:

- `client/package.json`
- `client/vite.config.js`
- `client/tailwind.config.js`
- `client/postcss.config.js`
- `client/src/main.jsx`
- `client/src/index.css`

### Step 2. Build chatbot UI

Purpose: create a responsive chat screen with message bubbles, prompt chips, and KPI cards.

Files:

- `client/src/App.jsx`
- `client/src/components/ChatHeader.jsx`
- `client/src/components/ChatMessage.jsx`
- `client/src/components/ChatInput.jsx`
- `client/src/components/KpiCards.jsx`
- `client/src/components/QuickPrompts.jsx`
- `client/src/components/ChartCard.jsx`

### Step 3. Add API service (Axios)

Purpose: isolate all frontend API calls in one place.

Files:

- `client/src/api/chatApi.js`

### Step 4. Setup backend (Express server)

Purpose: create the REST API and bootstrap the Node server.

Files:

- `server/package.json`
- `server/src/app.js`
- `server/src/server.js`

### Step 5. Create MongoDB connection

Purpose: connect to MongoDB but still keep the demo running if MongoDB is not ready yet.

Files:

- `server/src/config/db.js`
- `server/.env.example`

### Step 6. Create database schemas

Purpose: define clean Mongoose models for products, sales, and users.

Files:

- `server/src/models/Product.js`
- `server/src/models/Sale.js`
- `server/src/models/User.js`

### Step 7. Build chatbot API (`/api/chat`)

Purpose: accept user messages and return structured chatbot responses.

Files:

- `server/src/routes/chatRoutes.js`
- `server/src/controllers/chatController.js`
- `server/src/services/chatService.js`

### Step 8. Implement intent detection using keywords

Purpose: keep day-one NLP simple and reliable.

Files:

- `server/src/services/intentService.js`

### Step 9. Add inventory API

Purpose: return inventory summaries and low-stock items.

Files:

- `server/src/routes/inventoryRoutes.js`
- `server/src/controllers/inventoryController.js`
- `server/src/services/dataService.js`

### Step 10. Add sales analytics

Purpose: calculate revenue, orders, units sold, growth, and top products.

Files:

- `server/src/routes/salesRoutes.js`
- `server/src/controllers/salesController.js`
- `server/src/utils/analytics.js`

### Step 11. Add charts using Recharts

Purpose: show chart blocks directly inside the assistant reply.

Files:

- `client/src/components/ChartCard.jsx`
- `server/src/utils/analytics.js`

### Step 12. Add recommendation logic

Purpose: filter products by category, budget, rating, and tags.

Files:

- `server/src/services/recommendationService.js`
- `server/src/routes/productRoutes.js`
- `server/src/controllers/productController.js`

### Step 13. Add customer service responses

Purpose: automate FAQ-style support answers for tracking, shipping, returns, and cancellation.

Files:

- `server/src/services/chatService.js`

### Step 14. Add voice input using Web Speech API

Purpose: let users speak a query on supported browsers.

Files:

- `client/src/hooks/useVoiceInput.js`
- `client/src/components/ChatInput.jsx`

### Step 15. Improve chatbot using OpenAI API (optional)

Purpose: keep rule-based structure, then let OpenAI rewrite responses more naturally.

Files:

- `server/src/services/openaiService.js`
- `server/.env.example`

Note:

- Leave `USE_OPENAI=false` for day-one stability.
- Turn it on only after you set `OPENAI_API_KEY`.

## 5. Sample Dataset

### Products

File:

- `server/src/data/products.js`

Includes:

- Electronics: TV, headphones, smartwatch, gaming laptop, Bluetooth speaker
- Clothing: denim jacket, sneakers, T-shirt, hoodie, oxford shirt

### Sales

File:

- `server/src/data/sales.js`

Includes:

- Multi-day orders
- Mixed channels: online, store, marketplace
- Mixed categories: electronics and clothing

### Users

File:

- `server/src/data/users.js`

## 6. Example User Queries and Expected Responses

| User Query | Expected Bot Behavior |
|---|---|
| `Show me current inventory status` | Summarizes total products, units in stock, and low-stock products |
| `Which products are low in stock?` | Lists items like Smartwatch Active and Gaming Laptop Pro 15 |
| `Give me a sales chart` | Returns a sales summary plus a Recharts line chart |
| `Show revenue share by category` | Returns a pie chart for electronics vs clothing revenue |
| `Recommend electronics under $500` | Returns matching products such as headphones, smartwatch, or speaker |
| `Tell me about the gaming laptop` | Returns price, stock, rating, and description |
| `How can a customer track an order?` | Returns a customer-service FAQ answer |
| `What is the return policy?` | Returns a simple support automation response |

## 7. How To Run Locally

### Backend

```powershell
cd server
Copy-Item .env.example .env
npm install
npm run dev
```

### Frontend

```powershell
cd client
Copy-Item .env.example .env
npm install
npm run dev
```

Frontend runs on:

- `http://localhost:5173`

Backend runs on:

- `http://localhost:5000`

### Optional MongoDB seed

After MongoDB is connected:

```powershell
cd server
npm run seed
```

## 8. How To Connect MongoDB Atlas

1. Create a free cluster in MongoDB Atlas.
2. Create a database user.
3. Add your IP to Network Access.
4. Copy the connection string.
5. Replace `MONGODB_URI` in `server/.env`.

Example:

```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/retail_intelligence
```

## 9. Deployment

### Frontend on Vercel

1. Push the project to GitHub.
2. Import the `client` folder into Vercel.
3. Set build command to `npm run build`.
4. Set output directory to `dist`.
5. Add environment variable:

```env
VITE_API_BASE_URL=https://your-render-api.onrender.com/api
```

### Backend on Render

1. Create a new Web Service.
2. Point Render to the `server` folder.
3. Set build command to `npm install`.
4. Set start command to `npm start`.
5. Add environment variables:

```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
CLIENT_URL=https://your-vercel-app.vercel.app
USE_OPENAI=false
```

## 10. Production-Ready Improvements After Day One

1. Add authentication for admin vs support users.
2. Store chat history in MongoDB.
3. Add proper order and customer collections.
4. Add role-based dashboards.
5. Upgrade keyword intent detection to embeddings or tool-calling.
6. Add automated tests for API routes and UI.

## 11. OpenAI Upgrade Reference

Official docs for the optional step:

- [OpenAI Responses API](https://platform.openai.com/docs/api-reference/responses/object?lang=node.js)
- [Responses migration guide](https://platform.openai.com/docs/guides/migrate-to-responses)
