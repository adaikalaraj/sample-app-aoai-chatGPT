# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Azure OpenAI chat sample app — a full-stack application with a Python/Quart async backend and React/TypeScript frontend. Supports RAG via Azure AI Search, conversation history via CosmosDB, and multiple data source integrations (Elasticsearch, Pinecone, MongoDB, etc.).

## Common Commands

### Frontend (run from `frontend/`)
- `npm install` — install dependencies
- `npm run dev` — Vite dev server
- `npm run build` — production build (tsc + vite build)
- `npm test` — run Jest tests

### Backend
- `pip install -r requirements.txt` — install Python dependencies
- `python app.py` — run dev server (port 5050)

### Full Stack
- `start.sh` / `start.cmd` — builds frontend then starts backend on port 5050
- Docker: `docker build -f WebApp.Dockerfile -t chatapp .` then expose port 80

### Deployment
- `azd up` — deploy via Azure Developer CLI (see `azure.yaml`)
- ARM template in `infrastructure/deployment.json`

## Architecture

### Backend (`app.py` — single large file, ~1400 lines)
The main Quart app handles all API routes:
- `/conversation` — chat completions via Azure OpenAI (streaming supported)
- `/frontend_settings` — returns UI configuration to frontend
- `/history/*` — CRUD for conversation history (CosmosDB)
- Supports multiple data source types configured via env vars: Azure AI Search, Elasticsearch, Pinecone, MongoDB, CosmosDB

Key backend modules:
- `backend/auth/` — authentication utilities (AAD token handling)
- `backend/history/cosmosdbservice.py` — CosmosDB conversation persistence
- `backend/utils.py` — response formatting, Azure Search helpers, token encoding

### Frontend (`frontend/src/`)
React 18 app using Fluent UI components:
- `pages/Chat.tsx` — main chat interface with streaming response support
- `pages/Layout.tsx` — app shell with header, history panel
- `components/Answer/` — renders AI responses with citations
- `components/ChatHistory/` — conversation history sidebar
- `api/api.ts` — REST client calling backend endpoints
- `api/models.ts` — TypeScript types matching backend response shapes

### Data Flow
Frontend → REST API → `app.py` routes → Azure OpenAI (with optional data sources) → streamed/non-streamed response → frontend renders with citations

### Production
- Gunicorn with UvicornWorker (`gunicorn.conf.py`), workers = `(cpu_count * 2) + 1`, timeout 230s
- Multi-stage Docker build: Node 20 (frontend) → Python 3.11-alpine (backend)

## Configuration

All configuration is via environment variables (see `.env.sample` for full list). Key ones:
- `AZURE_OPENAI_RESOURCE`, `AZURE_OPENAI_MODEL`, `AZURE_OPENAI_KEY` — OpenAI connection
- `AZURE_SEARCH_SERVICE`, `AZURE_SEARCH_INDEX` — RAG data source
- `AZURE_COSMOSDB_ACCOUNT` — conversation history
- `DATASOURCE_TYPE` — selects data source integration (AzureCognitiveSearch, Elasticsearch, etc.)
