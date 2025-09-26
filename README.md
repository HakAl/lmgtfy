# LMGTFY v1.0

Coding exercise to learn about AI and Windows dev (oof) with OSS.
Intent was to deploy to Oracle Always Free, but they're out of capacity.
Now researching GCP for deployment since they offer $300 free credits.

## **Project Summary**

Create a **fake AI search assistant** that:

* Takes a search input.
* "Struggles" to answer queries.
* Streams results from /chat in a terminal-like window
---

## Tech Stack (All Free/Open Source)

| Feature                      | Tool                                                                          |
| ---------------------------- | ----------------------------------------------------------------------------- |
| Text generation (funny/fake) | **Llama.cpp** for inference with best fit LLM  (mistral-7b worked for me)     |
| Frontend                     | **React** React + Vite                                                        |
| Backend                      | **Node.js** API interacts with llama server                                   |
| Deployment (WIP)             | Docker, nginx, GCP (WIP- local only atm)                                      |

---

## Windows Setup Guide: llama.cpp + Mistral-7B-Instruct + Express + React

For deeper insight into llama setup, see: server\LLAMA-DEV.md

### Run Everything Together (Manual)

Open multiple PowerShell windows:

**Window 1 - Start llama.cpp server:**
```powershell
cd llama.cpp
./llama-server -m models/mistral-7b-instruct-v0.2.Q4_K_M.gguf --host 0.0.0.0 --port 8000 --ctx-size 4096 --threads 4
```

**Window 2 - Start Node backend:**
```powershell
cd lmgtfy/server
npm run dev
```

**Window 3 - Start React frontend:**
```powershell
cd lmgtfy/client
npm run dev
```

**Docker** 
```
npm run docker:dev
||
docker-compose -f docker-compose.yml -f docker-compose.dev.yml up --build
```


## Deployment -- WIP

**Google Cloud (free trial)**

Google Compute Engine (GCE) - VM Instance

* 1x e2-micro instance per month (720 hours).
* 2 shared vCPUs (but on a bursting schedule, not consistent).
* 1 GB of RAM. This is the main limitation.
* 1 GB of RAM is too small. However, GCP gives you $300 in free credits for new customers for 90 days.

Initial Strategy with $300 Credits:

* Create a custom VM with enough RAM.
* e2-standard-2: 2 vCPUs, 8 GB RAM.
* || if too slow: e2-standard-4: 4 vCPUs, 16 GB RAM.
