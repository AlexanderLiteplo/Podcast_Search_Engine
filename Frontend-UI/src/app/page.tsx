/** @format */
"use client";
import { useState, useEffect } from "react";
import React from 'react';
import YouTubePlayer from './youtubePlayer'; // Update this path as needed

export default function Home() {
  // Define an interface for the API response data
  interface ApiResponse {
    id: string;
    link: string;
    queryTerm: string;
    timestamps: { start: number; text: string }[];
  }

  const [formData, setFormData] = useState({
    promptdata: "",
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
      const response = await fetch("https://api.askhealth.guru/api/prompt", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
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
    const loadYouTubeAPI = () => {
      if (!window.YT) {
        const tag = document.createElement("script");
        tag.src = "https://www.youtube.com/iframe_api";
        const firstScriptTag = document.getElementsByTagName("script")[0];''
        firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag);
      }
    };

    loadYouTubeAPI();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!postResult) return;

        setLoadingGet(true);

        // Split the postResult.result string and get the first word
        const searchTerm = postResult.result.split(",")[0].trim();

        // Construct the URL with parameter from the postResult
        const params = new URLSearchParams({
          search_term: searchTerm,
          // Add more parameters as needed
        });
        const url = `https://api.askhealth.guru/api/searchtranscripts?${params.toString()}`;

        const response = await fetch(url);

        if (!response.ok) {
          throw new Error("Network response was not ok");
        }

        const data = await response.json();
        // for all of the start times, turn them into integers
        data.forEach((item: any) => {
          item.start = parseInt(item.start.toString());
        });
        // log the length of the data
        console.log("Old length of the data" + data.length);
        // Group the results by the video ID
        const getResults = data.reduce((acc: any, item: any) => {
          const id = item.link.split("v=")[1].split("&")[0];
          const existing = acc.find((result: any) => result.id === id);

          if (existing) {
            existing.timestamps.push({ start: item.start, text: item.text });
          } else {
            acc.push({
              id: id,
              link: item.link,
              queryTerm: searchTerm,
              timestamps: [{ start: item.start, text: item.text }],
            });
          }

          return acc;
        }, []);
        
        setGetResult(getResults);
        // log the new length of the data
        console.log("New length" + getResults.length);
        // console.log(getResults);
      } catch (error) {
        // setError(error);
      } finally {
        setLoadingGet(false);
      }
    };

    fetchData();
  }, [postResult]);


  interface ErrorBoundaryProps {
    children: React.ReactNode;
  }
  
  interface ErrorBoundaryState {
    hasError: boolean;
  }
  
  class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
    constructor(props: ErrorBoundaryProps) {
      super(props);
      this.state = { hasError: false };
    }
  
    static getDerivedStateFromError(error: any) {
      return { hasError: true };
    }
  
    componentDidCatch(error: any, errorInfo: any) {
      // Log error information to an error reporting service
      console.error("Error in component: ", error, errorInfo);
    }
  
    render() {
      if (this.state.hasError) {
        return <h1>Something went wrong.</h1>;
      }
  
      return this.props.children;
    }
  }

  const renderYouTubeVideo = (item: ApiResponse) => {
    const buttons = item.timestamps.map((timestamp) => ({
      text: timestamp.text,
      start: timestamp.start,
    }));

    //log all info for debugging
    console.log("In Page.tsx: Rendering YouTube Video");
    console.log(item.id);
    console.log(item.queryTerm);
    console.log('buttons: ', buttons);

    return (
      <div key={item.id}>
        <ErrorBoundary>
          <YouTubePlayer vidId={item.id} queryTerm={item.queryTerm} buttons={buttons} />
        </ErrorBoundary>
      </div>
    );
  };

  return (
    <div className="flex flex-col h-screen">
      {/* Results section */}
      <section className="flex-grow overflow-y-auto">
        <div className="max-w-3xl mx-auto flex flex-col gap-5 py-4">
          {loadingPost && (
            <div className="bg-dark shadow-md rounded-lg p-6 mb-4 w-96 animate-pulse">
              <div className="h-4 bg-gray-200 mb-3 rounded w-3/4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            </div>
          )}

          {postResult && (
            <div className="flex flex-col justify-center w-full">
              <div className="bg-dark shadow-md rounded-lg p-6 mb-4 w-96 mx-auto">
                <h2 className="text-lg font-semibold mb-4">
                  Searching podcast for:
                </h2>
                <ul className="list-disc ml-6 text-left">
                  {postResult.result.split(", ").map((item, index) => (
                    <li key={index}>{item}</li>
                  ))}
                </ul>
              </div>
            </div>
          )}
          {loadingGet && (
            <div className="bg-dark shadow-md rounded-lg p-6 mb-4 w-96 animate-pulse">
              <div className="h-4 bg-gray-200 mb-3 rounded w-3/4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            </div>
          )}
          <div className="flex flex-wrap justify-center">
            {getResult && getResult.map(renderYouTubeVideo)}
          </div>
        </div>
      </section>

      {/* Search bar section */}
      <main className="bg-white shadow-lg p-4 sticky bottom-0">
        <div className="flex flex-col items-center text-center justify-center gap-4">
          <div className="h-10 w-10 bg-white p-1 rounded-full">
            <img src="/assets/ai-logo.svg" alt="AI Logo" />
          </div>
          <p className="text-2xl font-semibold">
            Search the Huberman Lab podcast for information.
          </p>
          <form onSubmit={handleSubmit} className="w-full max-w-sm m-auto">
            <div className="flex relative">
              <input
                type="text"
                name="promptdata"
                placeholder="Where does Andrew talk about Sauna?"
                onChange={handleChange}
                className="w-full h-12 bg-inherit rounded-xl border border-gray-500 px-4"
              />
              <button
                type="submit"
                className="text-lg font-bold flex items-center gap-2 rounded-xl p-2 hover:bg-blue-500 transition-all w-fit m-auto"
              >
                Search
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}
