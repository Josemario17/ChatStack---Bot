import React, { useEffect, useRef, useState } from "react";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { API_KEY } from "../../conectar";
import MessageSend from "../Components/MessageSend";
import LoadingComponente from "../Components/Loading";
import MessageRecive from "../Components/MessageRecive";

export default function ChatBotStack() {
  const [loading, setLoading] = useState(false);
  const [prompt, setPrompt] = useState("");
  const [Conversation, setConversation] = useState([]);
  const [PromptConjunt, setPromptConjunt] = useState([]);
  const messagesEndRef = useRef();

  const genAI = new GoogleGenerativeAI(API_KEY);
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  async function handleTextPrompt(e) {
    setLoading(true);
    e.preventDefault();
    setConversation([]);

    const result = await model.generateContent(prompt);
    const response = result.response;
    const textResult = response.text();
    setConversation((prevConversations) => [
      {
        id: prevConversations.length + 1,
        question: prompt,
        newAnswer: textResult,
      },
    ]);

    setPrompt("");
    setTimeout(() => {
      setLoading(false);
    }, 1200);
  }
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [Conversation]);

  return (
    <div className="w-11/12 mx-auto px-10 border border-solid border-gray-300 h-full bg-white/5 rounded-2xl mt-5 overflow-hidden max-h-[600px]">
      <div className="w-11/12 mx-auto h-full overflow-hidden min-h-[600px] pt-6">
        <div className="w-3/4 mx-auto h-[76%] p-4 max-h-[500px] overflow-y-scroll flex flex-col items-end">
          {loading ? (
            <div className="w-full h-full flex flex-wrap min-h-auto min-h-[300px] gap-3 !my-2">
              <LoadingComponente></LoadingComponente>
            </div>
          ) : (
            Conversation.map((item, index) => {
              return (
                <div
                  className="w-full h-full flex flex-wrap min-h-auto min-h-[300px] gap-3 !my-2"
                  id={index}
                  ref={messagesEndRef}
                >
                  <div>
                    <MessageSend text={item.question}></MessageSend>
                    <MessageRecive text={item.newAnswer}></MessageRecive>
                  </div>
                </div>
              );
            })
          )}
        </div>
        <div className="w-3/4 mx-auto p-4 h-1/5 flex items-end pt-6">
          <form
            action="#"
            onSubmit={(e) => {
              setLoading(true);
              handleTextPrompt(e);
            }}
            className="w-full h-full flex items-start justify-between"
          >
            <input
              name="textSearch"
              id="textS"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              className="w-11/12 h-auto rounded-xl border-2 border-solid border-primary bg-secondary p-4 text-wrap overflow-scroll focus:outline-1"
              required
              placeholder="escreva aqui a sua pesquisa ou erro..."
            ></input>
            <button
              type={loading ? "button" : "submit"}
              className={`size-12 flex items-center justify-center rounded-full ${loading ? "bg-gray-500" : "bg-primary hover:bg-gray-500 duration-200"} hover:stroke-white`}
            >
              {loading ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="size-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M14.25 9v6m-4.5 0V9M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                  />
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="#f0ede8"
                  className="size-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5"
                  />
                </svg>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}