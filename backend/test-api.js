const { GoogleGenerativeAI } = require("@google/generative-ai");
require('dotenv').config();

async function testModels() {
  try {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    
    // Latest working models as of 2026
    const modelsToTest = [
      "gemini-2.5-flash-preview",
      "gemini-2.5-pro-preview", 
      "gemini-2.0-flash"
    ];
    
    console.log("🧪 Testing Gemini Models:\n");
    
    for (const modelName of modelsToTest) {
      try {
        const model = genAI.getGenerativeModel({ model: modelName });
        const result = await model.generateContent("Say 'working' in one word");
        const response = await result.response;
        console.log(`✅ ${modelName}: WORKING`);
      } catch (error) {
        console.log(`❌ ${modelName}: ${error.message}`);
      }
    }
  } catch (error) {
    console.error("Error:", error.message);
  }
}

testModels();