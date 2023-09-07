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

  const isSmallScreen = window.innerWidth<500; // Check if the screen width is less than 500px

  return (
    <div className="main-container container mx-auto max-w-[700px]">
      <div className="flex flex-col h-screen bg-gray-900">
        <div className={`p-6 ${isSmallScreen ? 'fixed top-0 left-0 right-0 bg-white text-black' : ''}`}>
          <h1 className={`bg-gradient-to-r from-blue-500 to-purple-500 text-transparent bg-clip-text text-left font-bold text-${isSmallScreen ? '2xl' : '4xl'} md:text-6xl`}>56765 MTN</h1>
          <h4 className="text-white text-center py-3 text-sm md:text-base">Hi, Welcome to the SMS CHATGPT Service, you can ask questions, and AI will help you</h4>
        </div>
        <div className={`flex-grow p-6 chat-section ${isSmallScreen ? 'mt-20' : ''}`} style={{ overflowY: 'auto' }} ref={chatContainerRef}>
          <div className="flex flex-col space-y-4">
            {/* ... your chat content */}
          </div>
        </div>
        <form onSubmit={handleSubmit} className={`flex-none p-6 type-section ${isSmallScreen ? 'fixed bottom-0 left-0 right-0' : ''}`}>
          {/* ... your form content */}
        </form>
      </div>
    </div>
  );
}
