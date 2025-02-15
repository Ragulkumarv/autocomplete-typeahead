import { useState, useEffect, useRef } from "react";
import { API_EndPoint } from "../utils/constants";

const SearchInput = () => {
  const [suggestions, setSuggestions] = useState([]);
  const [query, setQuery] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [error, setError] = useState(null);
  const inputRef = useRef(null);

  const debounce = (func, delay) => {
    let timeoutId;
    return (...args) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        func(...args);
      }, delay);
    };
  };

  const fetchData = debounce(async (searchTerm) => {
    if (searchTerm.length > 0) {
      try {
        const resp = await fetch(
          `${API_EndPoint}${encodeURIComponent(searchTerm)}`
        );
        const data = await resp.json();
        setSuggestions(data[1]);
        setError(null);
      } catch (error) {
        console.error("API error", error);
        setError("API error");
        setSuggestions([]);
      }
    } else {
      setSuggestions([]);
      setError(null);
    }
  }, 300);

  const handleSelect = (suggestion) => {
    setQuery(suggestion);
    setShowDropdown(false);
  };

  const handleClickOutside = (eve) => {
    if (inputRef.current && !inputRef.current.contains(eve.target)) {
      setShowDropdown(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    fetchData(query);
  }, [query]);

  return (
    <div className="relative w-60" ref={inputRef}>
      <input
        type="text"
        className="w-full p-2 rounded border border-gray-300"
        placeholder="Search..."
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
          setShowDropdown(true);
        }}
        onFocus={() => setShowDropdown(true)}
      />
      {!!error && <p className="text-red-500 text-sm">{error}</p>}
      {showDropdown && suggestions.length > 0 && (
        <ul className="absolute w-full max-h-40 border bg-white border-gray-300 overflow-auto">
          {suggestions.map((suggestion, index) => (
            <li
              key={index}
              className="cursor-pointer p-2 hover:bg-gray-200"
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
