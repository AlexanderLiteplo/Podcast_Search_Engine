/** @format */
"use client";
import { FaChevronDown } from "react-icons/fa";
import { useState, useEffect } from 'react';

import Image from "next/image";
import { FaArrowUp } from "react-icons/fa6";
import { Result } from "postcss";

export default function Home() {

  const [formData, setFormData] = useState({
    // Initialize your form fields here
    promptdata: '',
  });
  const [postResult, setPostResult] = useState(null);
  const [getResult, setGetResult] = useState(null);
  const [error, setError] = useState(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();


    try {
      const response = await fetch('http://guruguru.eba-pjgbgb57.us-west-2.elasticbeanstalk.com/api/prompt', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      // Handle success response
      const result = await response.json();
      setPostResult(result);
    } catch (error) {
      setError(error);
    }
  };
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!postResult) return;

        // Construct the URL with parameter from the postResult
        const params = new URLSearchParams({
          search_term: postResult.result[1],
          // Add more parameters as needed
        });
        const url = `http://guruguru.eba-pjgbgb57.us-west-2.elasticbeanstalk.com/api/searchtranscripts?${params.toString()}`;

        const response = await fetch(url);
        
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }

        const data = await response.json();
        setGetResult(data);
      } catch (error) {
        setError(error);
      }
    };

    fetchData();
  }, [postResult]);


  return (
    <div className="h-full flex flex-col justify-between gap-3 pb-5 ">
      {/* nav */}
      <button className="text-lg font-bold flex items-center gap-2  rounded-xl p-2 hover:bg-slate-800 transition-all w-fit ">
        <p>Supplements</p>
      </button>

      {/* main */}
      <main className="flex flex-col items-center text-center justify-center gap-4">
        <div className=" h-10 w-10 bg-white p-1 rounded-full">
          <img src="/assets/ai-logo.svg" alt="" />
        </div>

        <p className="text-2xl font-semibold">What are you looking to buy today?</p>
        <form onSubmit={handleSubmit}>
          <div className="flex relative">
            <input
              type="text"
              name="promptdata"
              placeholder="What is the best supplement for growing muscles?"
              onChange={handleChange}
              className="w-full h-12 bg-inherit rounded-xl border border-gray-500 px-4"
            />
          </div>

          <button type="submit" className="btn btn-blue">Search</button>
        </form>
      </main>
      {/* bottom section */}
      <section className="max-w-3xl mx-auto flex flex-col gap-5">
        {error && <div>Error: {error.message}</div>}
        {postResult && (
          <div>
            <h2>Post Result:</h2>
            <pre>{JSON.stringify(postResult, null, 2)}</pre>
          </div>
        )}
        {getResult && (
          <div>
            <h2>Get Result:</h2>
            <pre>{JSON.stringify(getResult, null, 2)}</pre>
          </div>
        )}
      </section>
    </div>
  );
}