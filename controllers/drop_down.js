const express = require("express");
const app = express();
const PORT = process.env.PORT || 3000;

// Sample university data
const UniversityData = {
  GTU: {
    SSIT: {
      BE: ["Computer", "IT", "Electrical", "Civil", "Mechanical"],
      MCA: [],
    },
    MCU: {
      BE: ["Computer", "IT", "Electrical", "Civil", "Mechanical"],
      MCA: [],
    },
  },
  SU: {
    SSIT: {
      BE: [],
      MCA: ["Computer", "IT"],
    },
    MCU: {
      BE: [],
      MCA: ["Computer", "IT"],
    },
  },
};

// API endpoint to get colleges based on selected university
app.get("/api/colleges/:university", (req, res) => {
  const university = req.params.university;
  const colleges = Object.keys(UniversityData[university] || {});
  res.json(colleges);
});

// API endpoint to get degrees based on selected university and college
app.get("/api/degrees/:university/:college", (req, res) => {
  const university = req.params.university;
  const college = req.params.college;
  const degrees = Object.keys(UniversityData[university]?.[college] || {});
  res.json(degrees);
});

// API endpoint to get branches based on selected university, college, and degree
app.get("/api/branches/:university/:college/:degree", (req, res) => {
  const university = req.params.university;
  const college = req.params.college;
  const degree = req.params.degree;
  const branches = UniversityData[university]?.[college]?.[degree] || [];
  res.json(branches);
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
