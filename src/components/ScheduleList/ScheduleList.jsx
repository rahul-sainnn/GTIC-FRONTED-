import React, { useEffect, useState } from "react";
import "./ScheduleList.css";
import axios from "../../api/axios";
import DateCard from "./DateCard";
import { Icon } from "@iconify/react";
import { useNavigate } from "react-router-dom";

const Schedule = () => {
  const [eve, setEvent] = useState(0);
  const [combinedData, setCombinedData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const navigate = useNavigate();

  const fetchCombinedData = async () => {
    try {
      const dateResponse = await axios.get("/schedule/get-dates");
      const datesData = dateResponse.data.dates;

      const scheduleResponse = await axios.get("/schedule/get-schedule");
      const scheduleData = scheduleResponse.data.schedule;

      const combine = datesData.map((date) => ({
        ...date,
        scheduleList: scheduleData.filter(
          (schedule) => schedule.dateId === date.dateId
        ),
      }));

      let count = 1;

      const newCombine = combine.map((comb) => ({
        ...comb,
        scheduleList: comb.scheduleList.map((slsc) => ({
          ...slsc,
          sessionCount: slsc.isBreak ? null : count++,
        })),
      }));

      setCombinedData(newCombine);
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching combined data:", error);
    }
  };

  useEffect(() => {
    fetchCombinedData();
  }, []);

  const goToSlide = (index) => {
    setEvent(index);
  };

  const handleNavigation = (eve) => {
    navigate("/add-schedule", {
      state: { dateEdit: { ...combinedData[eve], isDate: true } },
    });
  };

  const handleDeleteSpeaker = async (dateId) => {
    try {
      const token = localStorage.getItem("token");

      const confirmed = window.confirm(
        "Are you sure you want to delete this speaker?"
      );

      if (!confirmed) {
        return; // If the user cancels, do nothing
      }

      // Send DELETE request to delete the speaker
      await axios.delete(`/schedule/delete-date/${dateId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      window.location.reload();
    } catch (error) {
      console.error("Error deleting speaker:", error);
    } 
  };

  return (
    <div className="schedule">
      <h1>DRAFT AGENDA</h1>
      {isLoading ? (
        <p>Loading...</p>
      ) : combinedData.length === 0 ? (
        <p>No data to display</p>
      ) : (
        <>
          <ul className="schedule-list">
            {combinedData.map((_, index) => (
              <li
                key={index}
                className={`${index === eve ? "act" : ""}`}
                onClick={() => goToSlide(index)}
              >
                <span>{combinedData[index].number}</span>
                <Icon
                  height={20}
                  // color="blue"
                  icon="bx:edit"
                  onClick={() => handleNavigation(eve)}
                />
                <Icon
                  icon="fluent:delete-28-filled"
                  color="red"
                  onClick={() => handleDeleteSpeaker(combinedData[index].dateId)}
                  height={20}
                />
              </li>
            ))}
          </ul>
          <div className="schedule-container">
            <div className="schedule-content">
              {combinedData[eve].scheduleList.map((pts, index) => {
                return <DateCard pts={pts} key={index} ind={index} />;
              })}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Schedule;
