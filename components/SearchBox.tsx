import CityData from "@/interfaces/city";
import Link from "next/link";
import { useState, useEffect } from "react";

const MIN_CITY_CHARS = 3;

let timeoutId: ReturnType<typeof setTimeout>;
const debounce = (fn: Function, ms = 300) => {
  return function (this: any, ...args: any[]) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn.apply(this, args), ms);
  };
};

const SearchBox = () => {
  const [inputValue, setInputValue] = useState("");
  const [cities, setCities] = useState<CityData[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`/api/city/${inputValue}`);
        const data = await response.json();
        setCities(data.cities);
      } catch (error) {
        console.error(error);
      }
    };

    if (inputValue.length >= MIN_CITY_CHARS) {
      debounce(fetchData)();
    }
  }, [inputValue]);

  return (
    <>
      <input
        type="text"
        className="bg-gray-200 rounded-lg w-64"
        placeholder="City name"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
      />
      {inputValue.length >= MIN_CITY_CHARS && (
        <ul>
          {cities.map((city) => (
            <li key={city.id}>
              <Link href={`/detail/${city.id}`}>
                {city.name} {city.state ? `, ${city.state}` : ""} (
                {city.country})
              </Link>
            </li>
          ))}
        </ul>
      )}
    </>
  );
};

export default SearchBox;
