import { useState, useEffect } from "react";
import { createClient } from "utils/supabase/client";
import Link from "next/link"; // Import the Link component from Next.js


const supabase = createClient();

export default function SmartSearchBar() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<{ id: number; meetupname: string; location: string }[]>([]);
  const [offset, setOffset] = useState(0); // Track the offset for pagination
  const [hasMore, setHasMore] = useState(false); // Track if there are more results to load

  // Debounce the search to avoid too many updates
  useEffect(() => {
    if (query.trim() === "") {
      setResults([]); // Clear results if the query is empty
      setOffset(0); // Reset offset
      setHasMore(false); // Reset hasMore
      return;
    }

    const delayDebounceFn = setTimeout(() => {
      fetchPins(query, 0); // Fetch initial results with offset 0
    }, 300); // Adjust the delay as needed

    return () => clearTimeout(delayDebounceFn);
  }, [query]);

  // Function to fetch pins from Supabase
  const fetchPins = async (searchQuery: string, offset: number) => {
    try {
      const limit = 3; // Limit the number of results per request
      const { data, error } = await supabase
      .from("pins")
      .select("*")
      .or(`meetupname.ilike.%${searchQuery}%,location.ilike.%${searchQuery}%`)
      .gte("end_date", new Date().toISOString())  // Filter for future end dates
      .range(offset, offset + limit - 1); // Use range for pagination

      if (error) {
        console.error("Error fetching pins:", error);
        return;
      }

      if (data) {
        if (offset === 0) {
          // If offset is 0, replace the results
          setResults(data);
        } else {
          // If offset > 0, append the new results
          setResults((prevResults) => [...prevResults, ...data]);
        }
        // Check if there are more results to load
        setHasMore(data.length === limit);
      }
    } catch (err) {
      console.error("Unexpected error:", err);
    }
  };

  // Function to load more results
  const loadMore = () => {
    const newOffset = offset + 3; // Increase the offset by 3
    setOffset(newOffset);
    fetchPins(query, newOffset); // Fetch the next set of results
  };

  // Function to collapse results back to the first 3
  const showLess = () => {
    setOffset(0); // Reset offset to 0
    fetchPins(query, 0); // Fetch the first 3 results again
  };

  return (
    <div className="w-full max-w-lg mx-auto p-6">
      {/* Search Input */}
      <div className="w-full max-w-lg mx-auto p-4">
        {/* Search Input and Clear Button */}
        <div className="relative">
          <input
            type="text"
            placeholder="Search for pins by meetup name or location..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full p-4 border border-gray-300 rounded-full shadow-lg bg-white focus:outline-none focus:ring-4 focus:ring-upinGreen focus:border-transparent text-black pr-10 transition duration-300 ease-in-out"
            aria-label="Search for pins"
          />
          
          {/* Clear Button */}
          {query && (
            <button
              onClick={() => {
                setQuery("");
                setResults([]);
                setOffset(0);
                setHasMore(false);
              }}
              className="absolute inset-y-0 right-0 p-3 text-gray-500 hover:text-upinGreen focus:outline-none transition-colors"
              aria-label="Clear search"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          )}
        </div>
  
        {/* Search Results */}
        <div className="mt-6">
          {results.length > 0 ? (
            <>
              {results.map((pin) => (
                <div
                  key={pin.id}
                  className="p-4 border-b border-gray-200 hover:bg-upinGreen transition-colors cursor-pointer rounded-lg shadow-sm"
                >
                  {/* Use Next.js Link for navigation */}
                  <Link href={`/pin/${pin.id}`} passHref>
                    <p className="font-semibold text-upinDark hover:text-white transition-colors">
                      {pin.meetupname}
                    </p>
                  </Link>
                  <p className="text-sm text-slate-400">{pin.location}</p>
                </div>
              ))}
              {hasMore && (
                <div className="flex flex-col gap-4">
                  <button
                    onClick={loadMore}
                    className="w-full mt-4 p-3 flex items-center justify-center text-upinGreen hover:bg-upinLightGreen rounded-lg transition-colors"
                  >
                    <span>Load More</span>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 ml-2"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 3a1 1 0 011 1v10.586l3.293-3.293a1 1 0 111.414 1.414l-5 5a1 1 0 01-1.414 0l-5-5a1 1 0 111.414-1.414L9 14.586V4a1 1 0 011-1z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </button>
                  {offset > 0 && (
                    <button
                      onClick={showLess}
                      className="w-full mt-4 p-3 flex items-center justify-center bg-slate-100 text-slate-800 hover:bg-slate-200 rounded-lg transition-colors shadow-md"
                    >
                      <span className="font-bold">Show Less</span>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 ml-2"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 17a1 1 0 01-1-1V5.414L5.707 9.707a1 1 0 01-1.414-1.414l5-5a1 1 0 011.414 0l5 5a1 1 0 01-1.414 1.414L11 5.414V16a1 1 0 01-1 1z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </button>
                  )}
                </div>
              )}
            </>
          ) : query ? (
            <p className="text-slate-500">Uh Ohh... No results found</p>
          ) : null}
        </div>
      </div>
    </div>
  );
}  