import React, { useState } from "react";
import "./ScheduleForm.css";
import axios from "../../api/axios";
import { useLocation } from "react-router-dom";

const ScheduleForm = ({ dateId, setShowForm }) => {
  const exData = useLocation()?.state?.dateEdit;
  const dateEdit = exData?.isScheduleData ? exData : {};

  const dateEditData = dateEdit.isScheduleData
    ? dateEdit
    : {
        dateId: dateId,
        startTime: "",
        endTime: "",
        amPmStart: "AM",
        amPmEnd: "AM",
        heading: "",
        details: "",
        bgcolor: "",
        isBreak: false,
      };

  const [formData, setFormData] = useState(dateEditData);

  const handleInputChange = (event) => {
    const { name, value, type, checked } = event.target;

    setFormData((prevData) => ({
      ...prevData,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const token = localStorage.getItem("token");

      console.log(formData);

      if (dateEdit.isScheduleData) {
        await axios.put(
          `/schedule/update-schedule/${dateEdit.scheduleId}`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
      } else {
        await axios.post("/schedule/add-schedule", formData, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
      }

      setFormData({
        dateId: "",
        startTime: "",
        endTime: "",
        amPmStart: "AM",
        amPmEnd: "AM",
        heading: "",
        details: "",
        bgcolor: "",
        isBreak: false,
      });

      setShowForm(true);
    } catch (error) {
      console.log(error.response?.data?.error || "error occurred in schedule");
    }
  };

  return (
    <div className="schedule-form-container">
      <form className="schedule-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="startTime" className="schedule-label">
            Start Time:
          </label>
          <input
            type="text"
            id="startTime"
            name="startTime"
            value={formData.startTime}
            onChange={handleInputChange}
            className="schedule-input"
            required
          />

          <select
            name="amPmStart"
            value={formData.amPmStart}
            onChange={handleInputChange}
            className="schedule-select"
          >
            <option value="AM">AM</option>
            <option value="PM">PM</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="endTime" className="schedule-label">
            End Time:
          </label>
          <input
            type="text"
            id="endTime"
            name="endTime"
            value={formData.endTime}
            onChange={handleInputChange}
            className="schedule-input"
            required
          />

          <select
            name="amPmEnd"
            value={formData.amPmEnd}
            onChange={handleInputChange}
            className="schedule-select"
          >
            <option value="AM">AM</option>
            <option value="PM">PM</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="heading" className="schedule-label">
            Heading:
          </label>
          <input
            type="text"
            id="heading"
            name="heading"
            value={formData.heading}
            onChange={handleInputChange}
            className="schedule-input"
          />
        </div>

        <div className="form-group">
          <label htmlFor="details" className="schedule-label">
            Schedule Details:
          </label>
          <textarea
            id="details"
            name="details"
            value={formData.details}
            onChange={handleInputChange}
            className="schedule-textarea"
          />
        </div>

        <div className="form-group">
          <label htmlFor="bgcolor" className="bgcolor-label">
            Background Color:
          </label>
          <input
            id="bgcolor"
            name="bgcolor"
            value={formData.bgcolor}
            onChange={handleInputChange}
            className="bgcolor"
          />
        </div>

        <div style={{ display: "flex", alignItems: "center" }}>
          <label htmlFor="isBreak" className="break-label">
            Is it a Break:
          </label>
          <input
            type="checkbox"
            id="isBreak"
            name="isBreak"
            checked={formData.isBreak}
            onChange={handleInputChange}
            className="schedule-checkbox"
          />
        </div>

        <div className="form-group">
          <button type="submit" className="schedule-button">
            Submit
          </button>
        </div>
      </form>
    </div>
  );
};

export default ScheduleForm;
