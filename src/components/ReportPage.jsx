import React, { useState } from "react";
import "./ReportPage.css";
import Sidebar from "./Sidebar";

const ReportPage = () => {
  const [report, setReport] = useState({
    subject: "",
    category: "Bug",
    description: "",
    attachment: null,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setReport({ ...report, [name]: value });
  };

  const handleFileChange = (e) => {
    setReport({ ...report, attachment: e.target.files[0] });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle report submission logic here
  };

  return (
    <div>
        <Sidebar>
        <h2 className="documentslist-name">Submit a Report</h2>
    <div className="report-page">
      <form onSubmit={handleSubmit}>
        <label htmlFor="subject">Subject</label>
        <input
          type="text"
          id="subject"
          name="subject"
          value={report.subject}
          onChange={handleChange}
        />

        <label htmlFor="category">Category</label>
        <select
          id="category"
          name="category"
          value={report.category}
          onChange={handleChange}
        >
          <option value="Bug">Bug</option>
          <option value="Feedback">Feedback</option>
          <option value="Feature">Feature Request</option>
        </select>

        <label htmlFor="description">Description</label>
        <textarea
          id="description"
          name="description"
          value={report.description}
          onChange={handleChange}
        ></textarea>

        <label htmlFor="attachment">Attachment (optional)</label>
        <input
          type="file"
          id="attachment"
          name="attachment"
          onChange={handleFileChange}
        />

        <button type="submit">Submit Report</button>
      </form>
     </div>
    </Sidebar>
    </div>
  );
};

export default ReportPage;
