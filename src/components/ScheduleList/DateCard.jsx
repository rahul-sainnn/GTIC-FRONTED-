import React, { useEffect } from "react";
import "./DateCard.css";
import { Icon } from "@iconify/react";
import Container from "react-bootstrap/Container";
import { useNavigate } from "react-router-dom";
import axios from "./../../api/axios";

const DateCard = ({ pts, ind }) => {
  const navigate = useNavigate();

  const handleNavigation = () => {
    navigate("/add-schedule", {
      state: { dateEdit: { ...pts, isScheduleData: true } },
    });
  };

  const handleDeleteSpeaker = async (scheduleId) => {
    try {
      const token = localStorage.getItem("token");

      const confirmed = window.confirm(
        "Are you sure you want to delete this speaker?"
      );

      if (!confirmed) {
        return; // If the user cancels, do nothing
      }

      // Send DELETE request to delete the speaker
      await axios.delete(`/schedule/delete-schedule/${scheduleId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    } catch (error) {
      console.error("Error deleting speaker:", error);
    }
  };

  return (
    <div
      className="date-card"
      style={{
        backgroundColor: `${pts.bgcolor || (pts.isBreak && "#d2e4f3")}`,
      }}
    >
      <div className="schedule-time">
        <span>
          <Icon
            icon="akar-icons:clock"
            color="#2759a8"
            height={18}
            style={{ marginRight: "5px" }}
          />
          {pts.startTime +
            " " +
            pts.startZone +
            " - " +
            pts.endTime +
            pts.endZone}
        </span>
      </div>
      <div sm={6} className="schedule-head">
        {!pts.isBreak && <p>Session {pts.sessionCount}</p>}
        <h5>{pts.heading}</h5>
      </div>
      <div sm={3} className="schedule-details">
        <div>
          <p>{pts.details}</p>
          <Icon
            icon="bx:edit"
            height={20}
            color="blue"
            onClick={() => handleNavigation(ind)}
          />
          <Icon
            icon="fluent:delete-28-filled"
            color="red"
            onClick={() => handleDeleteSpeaker(pts.scheduleId)}
            height={20}
          />
        </div>
      </div>
    </div>
  );
};

export default DateCard;
