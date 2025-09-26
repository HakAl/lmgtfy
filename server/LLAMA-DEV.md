## Setting up and Running `llama-server.exe` for Development (Windows PowerShell)

This guide covers the steps to compile `llama.cpp` and run `llama-server.exe` on Windows using PowerShell, specifically addressing common issues like Git ownership, missing dependencies, and correct invocation.

### Prerequisites

*   **Git:** For cloning the repository.
*   **CMake:** For configuring the build.
*   **Visual Studio Build Tools:** Or a full Visual Studio installation (e.g., "Desktop development with C++" workload) to provide the MSVC compiler.
*   **PowerShell:** (Your default terminal)
*   **`curl.exe` (Optional, for testing):** Can be installed via `winget install curl` or `choco install curl`. If not installed, you can use PowerShell's built-in `Invoke-WebRequest`.

### 1. Clone `llama.cpp` and Navigate

First, clone the `llama.cpp` repository and navigate into its directory.

```powershell
git clone https://github.com/ggerganov/llama.cpp.git
Set-Location llama.cpp
```

### 2. Address Git "Dubious Ownership" (if encountered)

If Git warns about "dubious ownership" during `cmake` or `git pull`, it's a security feature. Resolve it by running:

```powershell
git config --global --add safe.directory C:/Users/anyth/MINE/dev/lmgtfy/llama.cpp
```
**(Adjust the path if your `llama.cpp` directory is elsewhere).**

### 3. Clean and Configure the Build

It's best to start with a clean build. We'll also disable `CURL` support during compilation, as its development libraries are not typically available by default on Windows and aren't essential for basic server operation.

```powershell
# Delete any previous build artifacts
Remove-Item -Recurse -Force build

# Configure the build with CMake, disabling CURL support
cmake -B build -DLLAMA_CURL=OFF
```

### 4. Build `llama.cpp`

Now, compile the project. This will generate `llama-server.exe` and `ggml-cpu.dll` (and other components) in the `build\bin\Release` directory.

```powershell
cmake --build build --config Release
```

### 5. Run `llama-server.exe`

Navigate to the directory containing the compiled `llama-server.exe` and start it, pointing to your GGUF model file.

```powershell
# Navigate to the output directory
Set-Location build\bin\Release

# Start the server (replace 'mistral-7b-instruct-v0.2.Q4_K_M.gguf' with your model file)
# The '..\..\..\models\' path assumes your model is in the 'llama.cpp\models' folder
.\llama-server.exe -m ..\..\..\models\mistral-7b-instruct-v0.2.Q4_K_M.gguf
```
*(Keep this PowerShell window open as long as you want the server running.)*

### 6. Test the Server (from a new PowerShell window)

Open a **new PowerShell window** and send a sample inference request to confirm the server is working.

```powershell
Invoke-WebRequest -Uri http://127.0.0.1:8080/completion -Method POST -Headers @{"Content-Type"="application/json"} -Body '{"prompt": "Hello, my name is LLaMA. Please tell me a short story about a brave knight and a wise dragon.", "n_predict": 128, "temperature": 0.7}'
```

You should receive a JSON response containing the model's generated text in the `content` field.

---

.\llama-server.exe -m ..\..\..\models\Mistral-7B-Instruct-v0.3-Q6_K.gguf


---------------------
Continued
--------------------

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