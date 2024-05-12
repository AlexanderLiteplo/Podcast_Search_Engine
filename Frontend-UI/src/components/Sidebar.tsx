/** @format */
"use client";

import Link from "next/link";
import React from "react";
import { BsArchiveFill } from "react-icons/bs";
import { FaEdit } from "react-icons/fa";
import { FiEdit } from "react-icons/fi";
import { FaChevronLeft } from "react-icons/fa";
import { BsThreeDots } from "react-icons/bs";
import { TbMinusVertical } from "react-icons/tb";

import { useState } from "react";
import { cn } from "@/utils/cn";

import { usePathname } from "next/navigation";

type Props = {};

export default function Sidebar({}: Props) {
  const [isSidebar, setSidebar] = useState(true);

  function toggleSidebar() {
    setSidebar(!isSidebar);
  }

  return (
    <div
      className={cn("min-h-screen relative transition-all ", {
        "-translate-x-full": !isSidebar,
        "w-full  max-w-[244px]": isSidebar
      })}
    >
      {isSidebar && (
        <div
          className={cn(
            "min-h-screen w-full pl-4 pr-6 pt-20 dark:bg-[#0D0D0D]   "
          )}
        >
          {/* new chat btn */}
          <div className="absolute top-5 left-0 pl-4 pr-6 w-full ">
            <Link
              href={"/"}
              className="flex  dark:bg-[#0D0D0D] justify-between w-full  items-center p-2 hover:bg-slate-800 rounded-lg transition-all "
            >
              <section className="flex items-center gap-2">
                {/* logo */}
                <div className=" h-7 w-7 bg-white p-1 rounded-full">
                  <img src="/assets/ai-logo.svg" alt="" />
                </div>

                <p className="text-sm">AI Supplements </p>
              </section>
            </Link>
          </div>

          {/* timeles */}
          <div className="w-full flex flex-col gap-5">
          <Link
              href={"/"}
              className="flex  dark:bg-[#0D0D0D] justify-between w-full  items-center p-2 hover:bg-slate-800 rounded-lg transition-all "
            >
              <section className="flex items-center gap-2">
                {/* logo */}

                <p className="text-sm">New Search</p>
              </section>

              <FiEdit className="text-white text-sm" />
            </Link>
            {/* {timelineData.map((d, i) => (
              <Timeline key={i} label={d.label} timelines={d.timelines} />
            ))} */}
          </div>
        </div>
      )}
      <div className=" absolute inset-y-0 right-[-30px]  flex items-center justify-center w-[30px]">
        <button
          onClick={toggleSidebar}
          className=" h-[100px] group  text-gray-500 hover:text-white   w-full flex items-center justify-center  transition-all   "
        >
          {/* <FaChevronLeft /> */}
          <FaChevronLeft className="hidden group-hover:flex  text-xl    delay-500 duration-500 ease-in-out transition-all" />
          <TbMinusVertical className="text-3xl group-hover:hidden   delay-500 duration-500 ease-in-out  transition-all" />
        </button>
      </div>
    </div>
  );
}
