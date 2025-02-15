import { useState, useEffect } from "react";
import { API_EndPoint } from "../utils/constants";

const SearchInput = () => {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (query.length) {
      const fetchData = async () => {
        try {
          const response = await fetch(
            `${API_EndPoint}${encodeURIComponent(query)}`
          );
          if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
          }
          const data = await response.json();
          setSuggestions(data[1]);
          setError(null);
        } catch (err) {
          console.error("Error fetching data:", err);
          setError(
            "Failed to fetch suggestions. Please check your connection and try again."
          );
          setSuggestions([]);
        }
      };

      const timeoutId = setTimeout(fetchData, 300); // Debounce API calls
      return () => clearTimeout(timeoutId);
    } else {
      setSuggestions([]);
      setError(null);
    }
  }, [query]);

  const handleSelect = (suggestion) => {
    setQuery(suggestion);
    setShowDropdown(false);
  };

  return (
    <div className="relative w-64">
      <input
        type="text"
        className="w-full p-2 border border-gray-300 rounded"
        placeholder="Search Wikipedia..."
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
          setShowDropdown(true);
        }}
        onFocus={() => setShowDropdown(true)}
      />
      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
      {showDropdown && suggestions.length > 0 && (
        <ul className="absolute w-full bg-white border border-gray-300 rounded mt-1 max-h-40 overflow-auto">
          {suggestions.map((suggestion, index) => (
            <li
              key={index}
              className="p-2 cursor-pointer hover:bg-gray-200"
              onClick={() => handleSelect(suggestion)}
            >
              {suggestion}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default SearchInput;
