

export const analyzeImage = async (imageData) => {

  const system_prompt = `You are a helpful assistant that identifies foods in images. 
  You only provide the name of the foods in the image; if there are no foods return "There are no foods in the image". 
  If there are multiple foods in the image listed them seperated by commas.`

  try {
    const API_KEY = process.env.NEXT_PUBLIC_OPEN_ROUTER_API_KEY;

    if (!API_KEY) {
      throw new Error("API Key not available")
    }
  

    const base64Image =  imageData.includes(',') 
      ? imageData.split(',')[1]
      : imageData

    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${API_KEY}`,
          "HTTP-Referer": window.location.origin, // Optional. Site URL for rankings on openrouter.ai.
          "X-Title": "Pantry Tracker", // Optional. Site title for rankings on openrouter.ai.
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          "model": "meta-llama/llama-3.2-11b-vision-instruct:free",
          "messages": [
            {
              "role": "system",
              "content": system_prompt
            },
            {
              "role": "user",
              "content": [
                {
                  "type": "text",
                  "text": "What are the foods in the image?"
                },
                {
                  "type": "image_url",
                  "image_url": {
                    "url": `data:image/jpeg;base64,${base64Image}`
                  }
                }
              ]
            }
          ]
        })
      });

      if (!response.ok) {
        const errorMssg = await response.text();
        throw new Error(`Error with response: ${errorMssg}`)
      }

      const data = await response.json();

      return data.choices[0].message.content;

  } catch (error) {
    console.log(`Error analysis image: ${error}`)
    throw Error
  }
}
