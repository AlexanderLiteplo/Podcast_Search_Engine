/** @format */
"use client";
import { useState, useEffect } from 'react';

export default function Home() {

  // Define an interface for the API response data
  interface ApiResponse {
    id: number;
    link: string;
    start: number;
    text: string;
  }

  const [formData, setFormData] = useState({
    promptdata: '',
  });
  const [postResult, setPostResult] = useState<{ result: string } | null>(null);
  const [getResult, setGetResult] = useState<ApiResponse[] | null>(null);
  const [error, setError] = useState(null);
  const [loadingPost, setLoadingPost] = useState(false);
  const [loadingGet, setLoadingGet] = useState(false);

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
      setLoadingPost(true);
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
      //setError(error as Error);
    } finally {
      setLoadingPost(false);
    }
  };
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!postResult) return;

        setLoadingGet(true);

        // Split the postResult.result string and get the first word
        const searchTerm = postResult.result.split(',')[0].trim();

        // Construct the URL with parameter from the postResult
        const params = new URLSearchParams({
          search_term: searchTerm,
          // Add more parameters as needed
        });
        const url = `http://guruguru.eba-pjgbgb57.us-west-2.elasticbeanstalk.com/api/searchtranscripts?${params.toString()}`;

        const response = await fetch(url);
        
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }

        const data = await response.json();
        setGetResult(data);
        console.log(data);
      } catch (error) {
        // setError(error);
      } finally {
        setLoadingGet(false);
      }
    };

    fetchData();
  }, [postResult]);


  return (
    <div className="h-full flex flex-col justify-between">
      {/* nav */}
      <button className="text-lg font-bold flex items-center gap-2 rounded-xl p-2 hover:bg-blue-500 transition-all w-fit m-auto">
        <p>Supplements</p>
      </button>

      {/* main */}
      <main className="flex flex-col items-center text-center justify-center gap-4">
        <div className="h-10 w-10 bg-white p-1 rounded-full">
          <img src="/assets/ai-logo.svg" alt="" />
        </div>

        <p className="text-2xl font-semibold">What are you looking to buy today?</p>
        <form onSubmit={handleSubmit} className="w-full max-w-sm m-auto">
          <div className="flex relative">
            <input
              type="text"
              name="promptdata"
              placeholder="What is the best supplement for growing muscles?"
              onChange={handleChange}
              className="w-full h-12 bg-inherit rounded-xl border border-gray-500 px-4"
            />
          </div>

          <button type="submit" className="text-lg font-bold flex items-center gap-2 rounded-xl p-2 hover:bg-blue-500 transition-all w-fit m-auto">Search</button>
        </form>
      </main>
      {/* bottom section */}
      <section className="max-w-3xl mx-auto flex flex-col gap-5">
      {loadingPost && (
        <div className="bg-dark shadow-md rounded-lg p-6 mb-4 w-96 animate-pulse">
          <div className="h-4 bg-gray-200 mb-3 rounded w-3/4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        </div>
      )}

      {postResult && (
        <div className="bg-dark shadow-md rounded-lg p-6 mb-4 w-96">
          <h2 className="text-lg font-semibold mb-4">Supplements or Proteins</h2>
          <ul className="list-disc ml-6">
            {postResult.result.split(', ').map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
        </div>
      )}

      {loadingGet && (
        <div className="bg-dark shadow-md rounded-lg p-6 mb-4 w-96 animate-pulse">
          <div className="h-4 bg-gray-200 mb-3 rounded w-3/4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        </div>
      )}

      <div className="flex flex-wrap justify-center">
        {getResult && getResult.slice(0, 3).map((item) => (
          <div key={item.id} className="bg-dark shadow-md rounded-lg p-6 mb-4 mx-4 w-96">
            <a href={item.link+"&t="+item.start} target="_blank" rel="noopener noreferrer">
              <iframe
                width="100%"
                height="315"
                src={item.link+"&t="+item.start}
                title={item.text}
                frameBorder="0"
                allowFullScreen
                className="mb-4"
              ></iframe>
            </a>
            <a href={item.link+"&t="+item.start} target="_blank" rel="noopener noreferrer" className='text-lg font-bold flex items-center gap-2 rounded-xl p-2 hover:bg-blue-500 transition-all w-fit m-auto'>View Video</a>
            <h2 className="text-lg font-semibold mb-2">{item.text}</h2>
          </div>
        ))}
      </div>

      {/* {error && (
        <div className="bg-red-200 text-red-900 shadow-md rounded-lg p-4 mb-4 w-96">
          Error: {error.message}
        </div>
      )} */}
      </section>
    </div>
  );
}
