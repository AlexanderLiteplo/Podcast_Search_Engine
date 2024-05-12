/** @format */
import { FaChevronDown } from "react-icons/fa";

import Image from "next/image";
import { FaArrowUp } from "react-icons/fa6";

export default function Home() {
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
        
        <div className="flex relative">
          <input
            type="text"
            placeholder="What is the best supplement for growing muscles?"
            className="w-full h-12 bg-inherit rounded-xl border border-gray-500 px-4"
          />
        </div>

        <button type="button" className="btn btn-blue">Search</button>
      </main>
      {/* bottom section */}
      <section className="max-w-3xl mx-auto flex flex-col gap-5">
      </section>
    </div>
  );
}