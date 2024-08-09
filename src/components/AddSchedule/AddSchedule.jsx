import React, { useState, useEffect } from "react";
import "./AddSchedule.css";
import axios from "../../api/axios";
import ScheduleForm from "./ScheduleForm";
import { useLocation } from "react-router-dom";

const AddSchedule = () => {
  const exData = useLocation()?.state?.dateEdit;
  const dateEdit = exData ? exData : {};

  const dateEditData = dateEdit.isDate
    ? dateEdit
    : {
        number: "",
        day: "",
        date: "",
        month: "",
        year: "",
      };

  dateEdit.isDate && delete dateEdit.scheduleList;
  const [formData, setFormData] = useState(dateEditData);

  const [originalContacts, setOriginalContacts] = useState([]);

  useEffect(() => {
    const fetchDates = async () => {
      try {
        const response = await axios.get("/schedule/get-dates");
        setOriginalContacts(response.data.dates);
      } catch (error) {
        console.log(error.response?.data?.error || "An error occurred");
      }
    };
    fetchDates();
  }, []);

  const [filteredNumber, setFilteredNumber] = useState([...originalContacts]);
  const [showOptions, setShowOptions] = useState(false);
  const [showForm, setShowForm] = useState(true);
  const [dateId, setDateId] = useState(null);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));

    // Check if the target input is the "number" input
    if (name === "number") {
      // Filter original contacts based on the input value
      const newFilteredContacts = originalContacts.filter((contact) =>
        contact.number.includes(value)
      );

      // Update the filtered contacts list and show/hide the options container
      setFilteredNumber(newFilteredContacts);
      setShowOptions(newFilteredContacts.length > 0);
    } else {
      // Reset the filtered contacts list and hide the options container for other inputs
      setFilteredNumber([...originalContacts]);
      setShowOptions(false);
    }
  };

  const handleContactInputClick = () => {
    const { name } = event.target;

    if (name === "number") {
      setFilteredNumber(originalContacts);
      setShowOptions(true);
    }
  };

  const handleOptionClick = (d) => {
    setFormData({
      number: d.number,
      day: d.day,
      date: d.date,
      month: d.month,
      year: d.year,
    });

    setFilteredNumber([...originalContacts]);
    setShowOptions(false);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      // Get the token from your authentication system (localStorage, cookies, etc.)
      const token = localStorage.getItem("token");

      // Set the headers with the token
      const headers = {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      };

      // Send data to the backend with the token in the headers
      if (dateEdit.isDate) {
        console.log(formData);
        const response = await axios.put(
          `/schedule/update-date/${dateEdit.dateId}`,
          formData,
          {
            headers,
          }
        );
      } else {
        const response = await axios.post("/schedule/add-date", formData, {
          headers,
        });
        const updatedTitle = response.data.title;

        // Update the state with the returned title
        setOriginalContacts((prevContacts) => [
          ...prevContacts,
          { ...formData, title: updatedTitle },
        ]);

        setShowForm(false);
        setDateId(response.data.dateId);
      }

      // Reset the form and filtered contacts to the original list after submission
      setFormData({
        number: "",
        day: "",
        date: "",
        month: "",
        year: "",
      });
      setFilteredNumber([...originalContacts]);
      setShowOptions(false);
    } catch (error) {
      console.log(error.response?.data?.error || "An error occurred");
    }
  };

  return (
    <>
      {showForm && !dateEdit.isScheduleData ? (
        <div className="add-schedule">
          <form onSubmit={handleSubmit}>
            <label htmlFor="number" className="form-label">
              Number:
            </label>
            {/* Contact input with onClick handler */}
            <input
              type="text"
              id="number"
              name="number"
              value={formData.number}
              onClick={handleContactInputClick}
              onChange={handleInputChange}
              className="form-input"
              required
            />

            {/* Custom options container */}
            {showOptions && (
              <div className="options-container">
                {filteredNumber.map((contact, index) => (
                  <div
                    key={index}
                    onClick={() => handleOptionClick(contact)}
                    className="option"
                  >
                    {contact.number}
                  </div>
                ))}
              </div>
            )}

            <br />
            <label htmlFor="day" className="form-label">
              Day:
            </label>
            <input
              type="text"
              id="day"
              name="day"
              value={formData.day}
              onChange={handleInputChange}
              className="form-input"
              required
            />

            <label htmlFor="date" className="form-label">
              Date:
            </label>
            <input
              type="text"
              id="date"
              name="date"
              value={formData.date}
              onChange={handleInputChange}
              className="form-input"
              required
            />

            <label htmlFor="month" className="form-label">
              Month:
            </label>
            <input
              type="text"
              id="month"
              name="month"
              value={formData.month}
              onChange={handleInputChange}
              className="form-input"
              required
            />

            <label htmlFor="year" className="form-label">
              Year:
            </label>
            <input
              type="text"
              id="year"
              name="year"
              value={formData.year}
              onChange={handleInputChange}
              className="form-input"
              required
            />

            <button type="submit" className="form-button">
              Submit
            </button>
          </form>
        </div>
      ) : (
        <ScheduleForm dateId={dateId} setShowForm={setShowForm} />
      )}
    </>
  );
};

export default AddSchedule;
