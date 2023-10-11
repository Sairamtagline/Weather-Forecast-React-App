import React from "react";
import { useNavigate } from "react-router-dom";

import AsyncSelect from "react-select/async";
import { debounce } from "../utils/helpers";

const selectStyles = {
  option: (provided, state) => ({
    ...provided,
    fontSize: "0.875rem",
    color: "rgb(var(--text-heading))",
    paddingLeft: 16,
    paddingRight: 16,
    paddingTop: 12,
    paddingBottom: 12,
    cursor: "pointer",
    borderBottom: "1px solid #E5E7EB",
    backgroundColor: state.isSelected
      ? "#efefef"
      : state.isFocused
      ? "#F9FAFB"
      : "#ffffff",
  }),
  control: (_, state) => ({
    width: state.selectProps.width,
    display: "flex",
    alignItems: "center",
    minHeight: !state.selectProps.isMinimal ? 50 : 0,
    backgroundColor: "transparent",
    borderBottom: !state.selectProps.isMinimal ? "1px solid #F1F1F1" : "none",
    borderColor: state.isFocused ? "rgb(var(--color-gray-500))" : "#F1F1F1",
  }),
  clearIndicator: (provided, state) => ({
    ...provided,
    color: state.isFocused ? "#ffff" : "#ffff",
    padding: 0,
    cursor: "pointer",

    "&:hover": {
      color: "#9CA3AF",
    },
  }),
  input: (provided) => ({
    ...provided,
    color: "#fff",
  }),
  menu: (provided, state) => ({
    ...provided,
    width: "100%",
    borderRadius: 5,
    backgroundColor: "rgba(255, 265, 274)",
    boxShadow: "none",
    color: "#000",
    overflow: "hidden",
  }),
  menuList: (provided) => ({
    ...provided,
    paddingTop: 0,
    paddingBottom: 0,
    color: "#000",
  }),
  valueContainer: (provided, state) => ({
    ...provided,
    paddingLeft: 0,
    paddingRight: state.selectProps.isMinimal ? 0 : state.isRtl ? 16 : 4,
  }),
  singleValue: (provided, _) => ({
    ...provided,
    fontSize: "0.875rem",
    fontWeight: 600,
    color: "#fff",
  }),
  multiValue: (provided, _) => ({
    ...provided,
    borderRadius: 9999,
    overflow: "hidden",
    boxShadow:
      "0 0px 3px 0 rgba(0, 0, 0, 0.1), 0 0px 2px 0 rgba(0, 0, 0, 0.06)",
  }),
  multiValueLabel: (provided, _) => ({
    ...provided,
    paddingLeft: 10,
    fontSize: "0.875rem",
    color: "#ffffff",
  }),
  multiValueRemove: (provided, _) => ({
    ...provided,
    paddingLeft: 0,
    paddingRight: 8,
    color: "#ffffff",
    cursor: "pointer",

    "&:hover": {
      backgroundColor: "rgb(var(--color-accent-300))",
      color: "#F3F4F6",
    },
  }),
  indicatorSeparator: () => ({
    display: "none",
  }),
  dropdownIndicator: (provided, state) => ({
    ...provided,
    display: "none",
  }),
  placeholder: (provided, _) => ({
    ...provided,
    fontSize: "14px",
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
    color: "rgba(255, 255, 255, 0.7)",
  }),
  noOptionsMessage: (provided, _) => ({
    ...provided,
    fontSize: "0.875rem",
    color: "#000",
  }),
};

const getWeatherForecast = async (q) => {
  try {
    const res = await fetch(
      `${process.env.REACT_APP_API_BASE_URL}/search.json?q=${q}&key=${process.env.REACT_APP_API_KEY}`
    );
    const data = await res.json();
    if (!res.ok) throw new Error(data?.error?.message);
    return data;
  } catch (error) {
    alert(error?.message || "Could not get the weather forecast");
  }
};

// Load search options based on the search value
const loadOptions = async (inputValue, callback) => {
  const data = inputValue ? await getWeatherForecast(inputValue) : [];
  const options = data.map(({ name, url }) => ({ label: name, value: url }));
  callback(options);
};

const debouncedLoadOptions = debounce(loadOptions, 300);

const SearchBar = () => {
  const navigate = useNavigate();

  return (
    <AsyncSelect
      cacheOptions
      loadOptions={debouncedLoadOptions}
      defaultOptions
      placeholder="Search city name, US Zipcode, UK Postcode, Canada Postalcode, IP address or Latitude/Longitude (decimal degree)..."
      onChange={({ value }) => {
        navigate(`/weather/${value}`);
      }}
      styles={selectStyles}
    />
  );
};

export default SearchBar;
