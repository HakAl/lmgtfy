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