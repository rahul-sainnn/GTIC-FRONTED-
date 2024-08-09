import React, { useState } from "react";
import { Icon } from "@iconify/react";
import axios from "../../../api/axios";
import { useLocation } from "react-router-dom";

const SpeakerForm = ({ titleId }) => {
  const exData = useLocation()?.state?.speakerEdit;
  // console.log(exData);
  const speakerEditData = exData ? {...exData} : {
    name: "",
    address: "",
    sentences: [],
  };

  const imageEditData = exData?.image ? exData.image : null;

  const [speakerData, setSpeakerData] = useState(speakerEditData);
  
  const [imageFile, setImageFile] = useState(imageEditData);
  
  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setSpeakerData({
      ...speakerData,
      [name]: value,
    });
  };

  const handleImageChange = (event) => {
    console.log("Handling image change...");
    const file = event.target.files[0];
    console.log("Selected file:", file);
    file && setImageFile(file);
  };

  const handleSentenceChange = (index, value) => {
    const updatedSentences = [...speakerData.sentences];
    updatedSentences[index] = value;

    setSpeakerData({
      ...speakerData,
      sentences: updatedSentences,
    });
  };

  const handleRemoveSentence = (index) => {
    const updatedSentences = [...speakerData.sentences];
    updatedSentences.splice(index, 1);

    setSpeakerData({
      ...speakerData,
      sentences: updatedSentences,
    });
  };

  const handleAddSentence = () => {
    setSpeakerData({
      ...speakerData,
      sentences: [...speakerData.sentences, ""],
    });
  };

  // console.log(speakerData);

  const handleSubmit = async (event) => {
    event.preventDefault();

    // Basic validation checks
    if (!speakerData.name.trim()) {
      console.error("Name is required.");
      return;
    }

    if (!speakerData.address.trim()) {
      console.error("Address is required.");
      return;
    }

    // console.log("Speaker Data:", speakerData);
    // console.log("Title ID:", titleId);
    // console.log("Image File:", imageFile);

    const formData = new FormData();
    formData.append("image", imageFile);
    formData.append("name", speakerData.name);
    formData.append("address", speakerData.address);
    formData.append("titleId", titleId || speakerData.titleId);
    formData.append("sentences", JSON.stringify(speakerData.sentences));

    try {
      const token = localStorage.getItem("token");

      if (exData) {
        const response = await axios.put(`/speakers/update-speaker/${speakerEditData.speakerId}`, formData, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        });
      } else {
        const response = await axios.post("/speakers/add-speakers", formData, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        });
      }
      
      setSpeakerData({
        name: "",
        address: "",
        sentences: [''],
      });

      setImageFile(null); // Clear the image file after submission
    } catch (error) {
      console.error("Error updating speaker data:", error);
      console.error("Error response:", error.response);
      console.error(speakerData);
    }
  };

  return (
    <div className="form-container">
      <form onSubmit={handleSubmit}>
        <label htmlFor="name" className="form-label">
          Name:
        </label>
        <input
          type="text"
          id="name"
          name="name"
          value={speakerData.name}
          onChange={handleInputChange}
          className="form-input"
          required
        />

        <label htmlFor="address" className="form-label">
          Address:
        </label>
        <input
          type="text"
          id="address"
          name="address"
          value={speakerData.address}
          onChange={handleInputChange}
          className="form-input"
          required
        />

        <label className="form-label">Sentences:</label>
        {speakerData.sentences.map((sentence, index) => (
          <div key={index} className="sentence-item">
            <textarea
              type="text"
              value={sentence}
              onChange={(e) => handleSentenceChange(index, e.target.value)}
              placeholder={`Sentence ${index + 1}`}
              className="sentence-input"
            />
            <div className="close-icon-container">
              <Icon
                icon="entypo:cross"
                color="red"
                height={25}
                onClick={() => handleRemoveSentence(index)}
                className="close-icon"
              />
            </div>
          </div>
        ))}

        <div className="add-sentence-container">
          <button type="button" onClick={handleAddSentence}>
            Add Sentence
          </button>
        </div>

        <label htmlFor="image" className="form-label">
          Image:
        </label>
        <input
          type="file"
          id="image"
          name="image"
          onChange={(e) => handleImageChange(e)}
          className="form-input"
          accept="image/*"
        />

        <div className="log-data-container">
          <button type="submit" className="form-button">
            Log Data
          </button>
        </div>
      </form>
    </div>
  );
};

export default SpeakerForm;
