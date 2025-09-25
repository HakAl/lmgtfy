export async function searchLlama({ query, apiKey }) {
  const res = await fetch(`${import.meta.env.VITE_API_URL}/search`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
    },
    body: JSON.stringify({ query }),
  })
  if (!res.ok) {
    const text = await res.text()
    throw new Error(text || 'Server error')
  }
  return res.json()
}

export async function streamChat({ query, apiKey }, onChunk, onComplete, onError) {
  try {
    const res = await fetch(`${import.meta.env.VITE_API_URL}/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
      },
      body: JSON.stringify({ query }),
    })

    if (!res.ok) {
      const text = await res.text()
      throw new Error(text || 'Server error')
    }

    if (!res.body) {
      throw new Error('Response body is missing')
    }

    const reader = res.body.getReader()
    const decoder = new TextDecoder()
    let buffer = ''

    while (true) {
      const { done, value } = await reader.read()
      
      if (done) break

      buffer += decoder.decode(value, { stream: true })
      
      // Split by lines to handle SSE format
      const lines = buffer.split('\n')
      buffer = lines.pop() // Keep the last incomplete line in buffer
      
      for (const line of lines) {
        // Skip empty lines
        if (!line.trim()) continue
        
        // Check if it's an SSE data line
        if (line.startsWith('data: ')) {
          try {
            // Extract the JSON part after "data: "
            const jsonStr = line.substring(6) // Remove "data: " prefix
            const data = JSON.parse(jsonStr)
            
            if (data.content) {
              onChunk(data.content)
            }
            
            if (data.done) {
              onComplete()
              return
            }
            
            if (data.error) {
              throw new Error(data.error)
            }
          } catch (e) {
            console.error('Error parsing SSE data:', e, 'Line:', line)
          }
        }
      }
    }

    // Process any remaining data in buffer
    if (buffer.trim() && buffer.startsWith('data: ')) {
      try {
        const jsonStr = buffer.substring(6)
        const data = JSON.parse(jsonStr)
        
        if (data.content) {
          onChunk(data.content)
        }
        
        if (data.done) {
          onComplete()
        }
      } catch (e) {
        console.error('Error parsing remaining SSE data:', e)
      }
    }
    
    onComplete()
  } catch (error) {
    console.error('Stream chat error:', error)
    onError(error)
  }
}