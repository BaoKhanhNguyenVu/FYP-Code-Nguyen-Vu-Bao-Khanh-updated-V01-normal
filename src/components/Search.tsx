"use client";

import Image from "./Image"
import { useQuery } from "@tanstack/react-query";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import FollowButton from "./FollowButton";

const Search = () => {
  const [query, setQuery] = useState("");
  const [showResults, setShowResults] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const { data, isLoading } = useQuery({
    queryKey: ["search", query],
    queryFn: async () => {
      if (!query) return { users: [] };
      const res = await fetch(`/api/users/search?q=${query}`);
      return res.json();
    },
    enabled: query.length > 0,
  });

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowResults(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <div className="bg-inputGray py-2 px-4 flex items-center gap-4 rounded-full">
        <Image path="icons/explore.svg" alt="search" w={16} h={16}/>
        <input 
          type="text" 
          placeholder="Search users" 
          className="bg-transparent outline-none placeholder:text-textGray w-full" 
          value={query} 
          onChange={(e) => setQuery(e.target.value)} 
          onFocus={() => setShowResults(true)}
        />
      </div>

      {/* Search Results */}
      {showResults && query && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-black border border-borderGray rounded-xl shadow-lg z-50 max-h-[400px] overflow-y-auto">
          {isLoading ? (
            <div className="p-4 text-center">Loading...</div>
          ) : data?.users?.length > 0 ? (
            <div>
              {data.users.map((user: any) => (
                <div 
                  key={user.id} 
                  className="p-4 hover:bg-[#181818] border-b border-borderGray last:border-b-0"
                >
                  <div className="flex items-center justify-between">
                    <Link 
                      href={`/${user.username}`} 
                      className="flex items-center gap-3 flex-1" 
                      onClick={() => setShowResults(false)}
                    >
                      <div className="w-10 h-10 rounded-full overflow-hidden flex-shrink-0">
                        <Image 
                          path={user.img || "general/noAvatar.png"} 
                          alt={user.username} 
                          w={100} 
                          h={100} 
                          tr={true}
                        />
                      </div>
                      <div className="min-w-0">
                        <h3 className="font-bold truncate">{user.displayName || user.username}</h3>
                        <p className="text-textGray text-sm truncate">@{user.username}</p>
                        {user.bio && (
                          <p className="text-sm mt-1 line-clamp-2 text-textGray">{user.bio}</p>
                        )}
                      </div>
                    </Link>
                    <div className="flex-shrink-0 ml-4">
                      <FollowButton 
                        userId={user.id} 
                        isFollowed={false} 
                        username={user.username}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-4 text-center">No users found</div>
          )}
        </div>
      )}
    </div>
  )
}

export default Search