import { useEffect, useState } from "react";
import { Icon } from "@iconify/react";
import axios from "./../../api/axios";
import "./AddSpeakers.css";
import { useNavigate } from "react-router-dom";

const colors = ["#7533b7", "#04439f", "#421d68", "#2f154c", "#0a6dff"];

const AddSpeakers = () => {
  const [combinedData, setCombinedData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const navigate = useNavigate();

  const handleNavigation = (eve) => {
    navigate("/add-speakers", {
      state: { speakerEdit: eve },
    });
  };

  const fetchCombinedData = async () => {
    try {
      const token = localStorage.getItem("token");

      // Fetch titles data
      const titlesResponse = await axios.get("/titles/get-titles", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const titlesData = titlesResponse.data.titles;

      // Fetch speakers data
      const speakersResponse = await axios.get("/speakers/get-speakers", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const speakersData = speakersResponse.data.speakers;

      // console.log(speakersData[4].sentences);
      // console.log(speakersData);

      // Combine titles and speakers data
      const combinedData = titlesData.map((title) => ({
        ...title,
        speakers: speakersData.filter(
          (speaker) => speaker.titleId === title.titleId
        ),
      }));

      setCombinedData(combinedData);
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching combined data:", error);
    }
  };

  useEffect(() => {
    fetchCombinedData();
  }, []);

  const handleDeleteSpeaker = async (speakerId) => {
    try {
      const token = localStorage.getItem("token");

      // Ask for confirmation using window.confirm
      const confirmed = window.confirm(
        "Are you sure you want to delete this speaker?"
      );

      if (!confirmed) {
        return; // If the user cancels, do nothing
      }

      // Send DELETE request to delete the speaker
      await axios.delete(`/speakers/delete-speaker/${speakerId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // Fetch updated combined data after deletion
      fetchCombinedData();
      window.location.reload()
    } catch (error) {
      console.error("Error deleting speaker:", error);
    }
  };

  const speakersPerRow = 4;

  const groupSpeakersIntoRows = (speakers) => {
    const rows = [];
    for (let i = 0; i < speakers.length; i += speakersPerRow) {
      rows.push(speakers.slice(i, i + speakersPerRow));
    }
    return rows;
  };

  return (
    <div className="speaker-container">
      <div className="speakers">
        <h1>SPEAKERS</h1>
      </div>

      {isLoading ? (
        <p style={{textAlign: 'center'}}>Loading...</p>
      ) : combinedData.map((sp, i) => (
        <div key={i}>
          <h4>{sp.title}</h4>
          <div className="image-accordion">
            {sp.speakers && Array.isArray(sp.speakers) ? (
              groupSpeakersIntoRows(sp.speakers, sp.id).map((row, rowIndex) => (
                <div className="image-row" key={rowIndex}>
                  {row.map((speaker, index) => (
                    <div
                      key={index}
                      className="image-item"
                      style={{
                        backgroundColor: colors[index % 5],
                        backgroundImage: `url(${speaker.image})`,
                      }}
                    >
                      <div className="card-header">
                        <div className="del-container">
                          <Icon
                            icon="fluent:delete-28-filled"
                            className="del-icon"
                            onClick={() =>
                              handleDeleteSpeaker(speaker.speakerId)
                            }
                            height={25}
                          />
                        </div>
                        <Icon
                          height={30}
                          className="edit-icon"
                          icon="bx:edit"
                          onClick={() => handleNavigation(speaker)}
                        />
                        <h3>{speaker.name}</h3>
                      </div>
                      <div className="speaker-details">
                        {/* {console.log(speaker)} */}
                        <ul>
                          {speaker.sentences.map((point, ind) => (
                            <li key={ind}>{point}</li>
                          ))}
                        </ul>
                        <span>
                          <Icon
                            icon="humbleicons:location"
                            color="#ee6d4e"
                            height={18}
                          />{" "}
                          {speaker.address}{" "}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ))
            ) : (
              <p>No speakers available</p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default AddSpeakers;
