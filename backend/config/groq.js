import Groq from "groq-sdk"

console.log("GROQ KEY:", process.env.GROQ_API_KEY ? "✅ Found" : "❌ NOT FOUND")

const client = new Groq({
  apiKey: process.env.GROQ_API_KEY,
})

const getAIReply = async (message) => {
  try {
    const completion = await client.chat.completions.create({
model: "llama-3.3-70b-versatile",
      messages: [
        {
          role: "system",
          content: `You are a helpful customer support assistant for an Indian 
          e-commerce store called SmartBazar. Answer questions about products, 
          orders, delivery, payments and general shopping queries. 
          Keep replies short, friendly and helpful. Use ₹ for prices.`
        },
        {
          role: "user",
          content: message
        }
      ],
      max_tokens: 200,
    })
    return completion.choices[0].message.content
  } catch (err) {
    console.error("GROQ FULL ERROR:", err.message)
    console.error("GROQ STATUS:", err.status)
    throw err
  }
}

export default getAIReply