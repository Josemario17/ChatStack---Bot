import React, { Fragment, useEffect, useRef, useState } from "react";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { conectGemini, db } from "../../conectar";
import MessageSend from "../Components/MessageSend";
import LoadingComponente from "../Components/Loading";
import MessageRecive from "../Components/MessageRecive";
import { marked, Marked } from "marked";
import { doc, setDoc, addDoc, collection, getDocs } from "firebase/firestore";
import Navbar from "../Components/NavBar";
import NoList from "../Components/NoList";

export default function History() {
  const [name, setName] = useState("")
  const [loading, setLoading] = useState(false);
  const [Conversation, setConversation] = useState([]);
  const [conjuntConversation, setConjuntConversation] = useState([]);
  const messagesEndRef = useRef();

  const genAI = new GoogleGenerativeAI(conectGemini);
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [Conversation]);

  useEffect(() => {
    const loadConversations = async () => {
      setLoading(true);
      const convRef = collection(db, "conversation");
      const arrayList = [];
      await getDocs(convRef)
        .then((snapshot) => {
          snapshot.forEach((doc) => {
            arrayList.push({
              question: doc.data().question,
              newAnswer: doc.data().geminiAnswer,
            });
          });

          setConjuntConversation(arrayList);
          console.log(arrayList);
        })
        .catch((error) => {
          console.log("Erro: ", error);
        });
    };
    setTimeout(() => {
      setLoading(false);
    }, 2000);

    loadConversations();
  }, []);

  return (
    <div className="p-10">
    <Navbar userGeral={setName}></Navbar>
      <div
        className={`w-11/12 mx-auto px-10 py-12 border border-solid border-gray-300 ${loading ? "h-full" : "h-auto"} bg-white/5 rounded-2xl mt-5`}
      >
        <div className="w-3/4 mx-auto h-full overflow-scroll flex flex-col items-start">
          {conjuntConversation.length === 0 && !loading ? (
           <NoList nameProp={name}></NoList>
          ) : (
            false
          )}
          {loading ? (
            <div className="w-full h-full flex flex-wrap justify-center items-center !my-2">
              <LoadingComponente></LoadingComponente>
            </div>
          ) : (
            conjuntConversation.map((item, index) => {
              return (
                <div
                  className="w-full h-full flex flex-col gap-3 !my-2"
                  id={index}
                  ref={messagesEndRef}
                >
                  <div>
                    <MessageSend key={index} text={item.question}></MessageSend>
                    <MessageRecive
                      key={item.id}
                      children={marked(item.newAnswer)}
                    ></MessageRecive>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
