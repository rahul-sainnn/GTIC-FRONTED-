import React, { useEffect, useState } from "react";
import "./TitleInput.css";
import axios from "../../../api/axios";
import SpeakerForm from "./SpeakerForm";
import { useLocation } from "react-router-dom";

const TitleInput = () => {
  // const exData = useLocation()?.state?.speakerEdit;
  // console.log(exData);
  // const speakerEdit = exData?.titleId ? exData.titleId : "";

  const [inputValue, setInputValue] = useState("");
  const [titleId, setTitleId] = useState("");
  const [titles, setTitles] = useState([]);
  const [allTitles, setAllTitles] = useState([]);

  useEffect(() => {
    const fetchTitles = async () => {
      try {
        const response = await axios.get("/titles/get-titles");
        const updatedTitles = response.data.titles.map((res) => res.title);
        setTitles(updatedTitles);
        setAllTitles(response.data.titles);
      } catch (error) {
        console.log(error.response?.data?.error || "An error occurred");
      }
    };
    fetchTitles();
  }, [inputValue]);

  // console.log(allTitles);

  const handleSelectChange = (event) => {
    const selectedValue = event.target.value;
    setInputValue(selectedValue);
    const selectedTitle = allTitles.find(
      (title) => title.title === selectedValue
    );
    setTitleId(selectedTitle ? selectedTitle.titleId : null);
  };

  return (
    <div className="card">
      <select
        value={inputValue}
        onChange={handleSelectChange}
        className="autocomplete-select"
      >
        <option value="" disabled>
          Select a title...
        </option>
        {titles.map((title, index) => (
          <option key={index} value={title}>
            {title}
          </option>
        ))}
      </select>
      <SpeakerForm titleId={titleId} />
    </div>
  );
};

export default TitleInput;
