const { GoogleGenerativeAI } = require("@google/generative-ai");
const genAI = new GoogleGenerativeAI(process.env.API_KEY);
const axios = require("axios");

const textOnly = async (prompt) => {
  // For text-only input, use the gemini-pro model
  const model = genAI.getGenerativeModel({ model: "gemini-pro" });
  const result = await model.generateContent(prompt);
  return result.response.text();
};

const multimodal = async (imageBinary) => {
  // For text-and-image input (multimodal), use the gemini-pro-vision model
  const model = genAI.getGenerativeModel({ model: "gemini-pro-vision" });
  const prompt = "ช่วยดูให้หน่อยว่าพืชในภาพเกิดปัญหาอะไร และต้องแก้ไขยังไงโดยไม่ใช้สารเคมี";
  const mimeType = "image/png";

  // Convert image binary to a GoogleGenerativeAI.Part object.
  const imageParts = [
    {
      inlineData: {
        data: Buffer.from(imageBinary, "binary").toString("base64"),
        mimeType
      }
    }
  ];

  const result = await model.generateContent([prompt, ...imageParts]);
  const text = result.response.text();
  return text;
};

const chat = async (prompt) => {
  // For text-only input, use the gemini-pro model
  
//const response = await axios.get("https://wutthipong.info/info.json");
const response = await require("./porpaeng.json");
//const response = await axios.get("https://github.com/WissarutManu/kha-agri-bot/blob/main/porpaeng.json");

//let information = await response.data;
//let information = JSON.stringify(information);
let information = JSON.stringify(response);

  const model = genAI.getGenerativeModel({ model: "gemini-pro" });
  const chat = model.startChat({
    history: [
      {
        role: "user",
        parts: [{ text: "สวัสดีจ้า" }],
      },
      {
        role: "model",
//        parts: [{ text: "สวัสดีครับ ลุงชื่อพอเพียง ผมเป็นผู้เชี่ยวชาญด้านการเกษตรของ ศูนย์พัฒนาเศรษฐกิจสุขประชา ช่วยตอบคำถามและแบ่งปันความรู้ให้กับเกษตรกรสุขประชา" }],
        parts: [{ text: "Answer the question using the text below and act like you are an old farmer man who friendly and have self-confidence, Respond with the text provided in first priority.\nQuestion: "+ prompt+"\nText: " + information }],

      },
//      {
//        role: "user",
//        parts: [{ text: "ปัจจุบันมี LINE API อะไรบ้างที่ใช้งานได้ในประเทศไทย" }],
//      },
//      {
//        role: "model",
//        parts: [{ text: "ปัจจุบันมีทั้ง Messaging API, LIFF, LINE Login, LINE Beacon, LINE Notify, LINE Pay, และ LINE MINI App ที่สามารถใช้งานในไทยได้ครับ" }],
//      },
    ]
  });

  const result = await chat.sendMessage(prompt);
  return result.response.text();
};

module.exports = { textOnly, multimodal, chat };