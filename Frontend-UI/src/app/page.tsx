/** @format */
"use client";
import { FaChevronDown } from "react-icons/fa";
import { useState } from 'react';

import Image from "next/image";
import { FaArrowUp } from "react-icons/fa6";

export default function Home() {

  const [formData, setFormData] = useState({
    // Initialize your form fields here
    promptdata: '',
  });

  const [apiResult, setApiResult] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('http://guruguru.eba-pjgbgb57.us-west-2.elasticbeanstalk.com/api/prompt', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        //    {
        //     "promptdata": "What does andrew huberman say about getting a cold?"
        //    }
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      // Handle success response
      console.log('Data posted successfully');
      const result = await response.json();
      setApiResult(result);
    } catch (error) {
      console.error('There was a problem with your fetch operation:', error);
    }
  };

  // const [responseData, setResponseData] = useState(null);
  // const [error, setError] = useState(null);

  // const fetchData = async (parameter) => {
  //   try {
  //     const response = await fetch(`guruguru.eba-pjgbgb57.us-west-2.elasticbeanstalk.com/api/searchtranscripts?search_term=${parameter}`);
      
  //     if (!response.ok) {
  //       throw new Error('Network response was not ok');
  //     }

  //     const data = await response.json();
  //     setResponseData(data);
  //   } catch (error) {
  //     setError(error);
  //   }
  // };

  // fetchData(apiResult[1]);

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
        {apiResult && (
          <div>
            <h2>API Result:</h2>
            <pre>{JSON.stringify(apiResult, null, 2)}</pre>
          </div>
        )}
      </section>
    </div>
  );
}