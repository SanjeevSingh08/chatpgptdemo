import { useState, useEffect, useRef } from "react";
import Head from 'next/head'
import Image from 'next/image'
import { Inter } from 'next/font/google'
import styles from '@/styles/Home.module.css'
import axios from 'axios';
import TypingAnimation from "../components/TypingAnimation";

const inter = Inter({ subsets: ['latin'] })

export default function Home() {
  const [inputValue, setInputValue] = useState('');
  const [chatLog, setChatLog] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // Use a ref to access the chat container element
  const chatContainerRef = useRef(null);

  // Scroll to the bottom of the chat when chatLog changes
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [chatLog]);

  const handleSubmit = (event) => {
    event.preventDefault();

    setChatLog((prevChatLog) => [...prevChatLog, { type: 'user', message: inputValue }]);

    sendMessage(inputValue);

    setInputValue('');
  }

  const sendMessage = (message) => {
    const url = '/api/chat';

    const data = {
      model: "gpt-3.5-turbo-0301",
      messages: [{ "role": "user", "content": message }]
    };

    setIsLoading(true);

    axios.post(url, data).then((response) => {
      console.log(response);
      setChatLog((prevChatLog) => [...prevChatLog, { type: 'bot', message: response.data.choices[0].message.content }]);
      setIsLoading(false);
    }).catch((error) => {
      setIsLoading(false);
      console.log(error);
    })
  }

  return (
    <div className="main-container container mx-auto max-w-[700px]">
      <div className="flex flex-col min-h-screen bg-gray-900">
        {/* Fixed navbar at the top */}
        <nav className="bg-gradient-to-r from-blue-500 to-purple-500 text-transparent bg-clip-text text-left font-bold text-2xl md:text-4xl p-6">
          56765 MTN
        </nav>
        <div className="p-6">
          <h4 className="text-white text-center py-3 text-sm md:text-base">Hi, Welcome to the SMS CHATGPT Service, you can ask questions, and AI will help you</h4>
        </div>
        <div className="flex-grow p-6 chat-section" style={{ overflowY: 'auto' }} ref={chatContainerRef}>
          <div className="flex flex-col space-y-4">
            {chatLog.map((message, index) => (
              <div key={index} className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`${message.type === 'user' ? 'bg-purple-500' : 'bg-gray-800'} rounded-lg p-2 text-white max-w-sm text-sm md:text-base`}>
                  {message.message}
                </div>
              </div>
            ))}
            {isLoading && (
              <div key={chatLog.length} className="flex justify-start">
                <div className="bg-gray-800 rounded-lg p-2 text-white max-w-sm text-sm md:text-base">
                  <TypingAnimation />
                </div>
              </div>
            )}
          </div>
        </div>
        <form onSubmit={handleSubmit} className="flex-none p-6 type-section bg-gray-800">
          <div className="container mx-auto max-w-[700px]">
            <div className="flex rounded-lg border border-gray-700">
              <input
                type="text"
                className="flex-grow px-4 py-2 bg-transparent text-white focus:outline-none text-sm md:text-base"
                placeholder="Type your message..."
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
              />
              <button
                type="submit"
                className="bg-purple-500 rounded-lg px-4 py-2 text-white font-semibold focus:outline-none hover:bg-purple-600 transition-colors duration-300"
              >
                Send
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
