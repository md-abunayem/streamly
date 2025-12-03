import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import { Upload, PencilLine, FilePlus } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";

import {setIsCreateTweetAppear} from "../../redux/slices/pageAppear";
const ChannelPopUP = ({ setShowCreateMenu, setCreatePlaylistAppear }) => {
  const dispatch = useDispatch()

  return (
    <div className="absolute right-0 mt-2 w-48 bg-gray-800 rounded-lg shadow-lg overflow-hidden z-20">
      <NavLink
        to={"/upload-video"}
        // relative="path"
        onClick={() => {
          setShowCreateMenu(false);
        }}
        className="w-full flex items-center gap-2 text-left px-4 py-3 hover:bg-gray-700 text-white"
      >
        <Upload size={18} className="text-gray-300" />
        Upload Video
      </NavLink>
      <NavLink
        onClick={() => {
          setShowCreateMenu(false);
          dispatch(setIsCreateTweetAppear(true))
        }}
        className="w-full flex items-center gap-2 text-left px-4 py-3 hover:bg-gray-700 text-white"
      >
        <PencilLine size={18} className="text-gray-300" />
        Create Tweet
      </NavLink>
      <button
        onClick={() => {
          setShowCreateMenu(false);
          setCreatePlaylistAppear(true);
        }}
        className="w-full flex items-center gap-2 text-left px-4 py-3 hover:bg-gray-700 text-white"
      >
        <FilePlus size={18} className="text-gray-300" />
        Create Playlist
      </button>
    </div>
  );
};

export default ChannelPopUP;
