# LMGTFY
## ✅ **Project Summary**

Create a **fake AI search assistant** that:

* Takes a search input
* Generates a funny or absurd fabricated story/summary
* Optionally generates humorous or weird AI-generated images
* Displays the result in a fun way (on a React site with no framework)

---

## 🛠️ Tech Stack (All Free/Open Source)

| Feature                      | Tool                                                                          |
| ---------------------------- | ----------------------------------------------------------------------------- |
| Text generation (funny/fake) | **Llama.cpp** with best fit LLM                                               |
| Frontend                     | **React** (No framework, vanilla React + Vite or Parcel is fine)              |
| Backend (optional)           | **Node.js + Express** or just **a local server** to run inference             |
| Deployment (optional)        | Static site with Netlify/Vercel + backend on Railway/Fly.io/etc.              |

---

## TODO

* Don’t expose endpoints to the public without a reverse proxy 

---

## 🚀 Extras / Fun Add-ons

* Add voice generation using TTS like `coqui-ai/XTTS-v2`
* Add chat history to show previous fake searches

---



<!-- todo -->
<!-- todo -->
<!-- todo -->
<!-- todo -->

## Oracle Cloud Setup

### 2.  Lift the quota (1 min)
Console → **Limits, Quotas and Usage** → open a **Service-Limit Increase**  
Request template: **“Always-Free A1 Compute”**  
Set:  
-  **A1 Flex OCPU ≤ 4**  
-  **A1 Flex Memory ≤ 24 GB**  
Approved in **seconds → impossible to create billable VMs** after that.

---

### 3.  Launch the VM (3 min)
Compute → **Instances** → **Create**  
-  **Name**: `ai-free`  
-  **Image**: **Ubuntu 22.04**  
-  **Shape**: **VM.Standard.A1.Flex** → **4 OCPU / 24 GB**  
-  **Boot volume**: 50 GB (free) + add **200 GB block** (also free)  
-  **SSH keys**: generate / save  
-  **Create** → **Running in ≤ 2 min**, **public IPv4 assigned**.

---


### 4.  Lock the spend at **$0**
-  **One VM only** (second VM → pay-as-you-go)  
-  **One public IPv4** only  
-  **≤ 200 GB block** total  
-  **≤ 10 TB egress** / month  
Do **not** upgrade to Pay-As-You-Go unless you **intentionally** exceed those numbers.

---

### 6.  Optional safety net
Compute → **Quotas** → set **A1-OCPU = 4**, **A1-Memory = 24**  
→ Oracle **denies** any create that would cost money.



<!-- todo -->
<!-- todo -->
<!-- todo -->
<!-- todo -->


## 🦙 Complete Setup Guide: llama.cpp + Mistral-7B-Instruct + Express + React

### 🛠️ Prerequisites (PowerShell)

First, let's install the required tools using PowerShell:

```powershell
# Install Chocolatey (if not already installed)
Set-ExecutionPolicy Bypass -Scope Process -Force; [System.Net.ServicePointManager]::SecurityProtocol = [System.Net.ServicePointManager]::SecurityProtocol -bor 3072; iex ((New-Object System.Net.WebClient).DownloadString('https://community.chocolatey.org/install.ps1'))

# Install dependencies
choco install git cmake ninja python -y

# Update Python packages
python -m pip install --upgrade pip setuptools wheel
```

### 📦 Build llama.cpp

```powershell
# Clone llama.cpp repository
git clone https://github.com/ggerganov/llama.cpp.git
cd llama.cpp

# Create build directory
mkdir build
cd build

# Configure build (for Windows)
# use "x64 Native Tools Command Prompt for VS 2022" if c stuff doesn't work in powershell
cmake .. -G Ninja

# Build the project
ninja

# Copy binaries to main directory
cp bin/* ../ -Force
cd ..
```

### 🎯 Download Mistral-7B-Instruct-v0.2 Model

```powershell
# Create models directory
mkdir models
cd models

# Download Mistral-7B-Instruct-v0.2 GGUF model
# You can use huggingface-cli or download directly
pip install huggingface_hub

# Download the model (Q4_K_M is a good balance of quality and size)
python -c "from huggingface_hub import hf_hub_download; hf_hub_download(repo_id='TheBloke/Mistral-7B-Instruct-v0.2-GGUF', filename='mistral-7b-instruct-v0.2.Q4_K_M.gguf', local_dir='.')"
```

### 🚀 Test llama.cpp Server

```powershell
# Start the server
./llama-server -m models/mistral-7b-instruct-v0.2.Q4_K_M.gguf --host 0.0.0.0 --port 8000 --ctx-size 4096 --threads 4
```

Test the server in another PowerShell window:
```powershell
# Test the API
Invoke-RestMethod -Uri "http://localhost:8000/completion" -Method Post -Body (@{
    prompt = "What is the capital of France?"
    max_tokens = 50
    temperature = 0.7
} | ConvertTo-Json) -ContentType "application/json"

||

irm http://localhost:8000/completion -Method Post -Body (@{prompt="What is the capital of France?";max_tokens=50;temperature=0.7}|ConvertTo-Json) -ContentType application/json
```


### 🏃‍♂️Run Everything Together

Open multiple PowerShell windows:

**Window 1 - Start llama.cpp server:**
```powershell
cd llama.cpp
./llama-server -m models/mistral-7b-instruct-v0.2.Q4_K_M.gguf --host 0.0.0.0 --port 8000 --ctx-size 4096 --threads 4
```

**Window 2 - Start Express backend:**
```powershell
cd mistral-express-react/backend
npm run dev
```

**Window 3 - Start React frontend:**
```powershell
cd mistral-express-react/frontend
npm start
```

### 🔧 Optional: GPU Acceleration

If you have an NVIDIA GPU, you can enable CUDA support:

```powershell
# Rebuild llama.cpp with CUDA support
cd llama.cpp
cmake -B build -DGGML_CUDA=ON -DLLAMA_CURL=ON
cmake --build build --config Release -j --clean-first
```

### 📝 Notes & Tips

1. **Model Size**: The Q4_K_M model is ~4GB. Make sure you have enough disk space and RAM.

2. **Performance**: Adjust `--threads` based on your CPU cores. For 8 cores, use `--threads 8`.

3. **Context Size**: The `--ctx-size` parameter controls how much text the model can remember. 4096 is good for most use cases.

4. **Temperature**: Lower values (0.1-0.3) make responses more focused, higher values (0.7-1.0) make them more creative.

5. **PowerShell Execution Policy**: If you encounter issues, run:
   ```powershell
   Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
   ```

### 🐛 Common Issues

1. **Port conflicts**: Make sure ports 8000, 3000, and 3001 are available
2. **CORS issues**: The Express server is configured with CORS, but check browser console for any issues
3. **Memory issues**: If you get out of memory errors, try a smaller model (Q2_K instead of Q4_K_M)




<!-- todo -->



You're right, I apologize for the overload. Here's the quick fix:

### 1. Reset Docker Desktop
- Uninstall Docker Desktop
- Delete these folders:
  - `%USERPROFILE%\AppData\Local\Docker`
  - `%USERPROFILE%\.docker`
- Reboot your PC

### 2. Reinstall Docker
- Download latest Docker Desktop
- Install with "Use WSL 2" enabled
- Wait for full initialization (whale icon stops animating)

### 3. Verify WSL2
In PowerShell (Admin):
```powershell
wsl --list --verbose
```
Should show:
```
docker-desktop         Running    2
docker-desktop-data    Running    2
```

### 4. Run Your Project
```powershell
cd C:\Users\anyth\MINE\dev\lmgtfy
docker-compose up --build
```



docker-compose -f docker-compose.yml -f docker-compose.dev.yml up --build