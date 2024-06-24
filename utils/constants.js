export const JOB_TYPE = {
  FULL_TIME: "Full-Time",
  PART_TIME: "Part-Time",
  INTERNSHIP: "Internship",
};

export const STATUS = {
  ACTIVE: "1",
  DEACTIVE: "0",
};

export const SORT_BY = {
  NEWEST_FIRST: "newest",
  OLDEST_FIRST: "oldest",
  ASCENDING: "a-z",
  DESCENDING: "z-a",
};

export const USER = {
  Student: "Student",
  University: "University",
  College: "College",
  TPO: "TPO",
  Company: "Company",
};

// // my use

export const University = {
  GTU: "GTU",
  SU: "SU",
};

export const College = {
  SSIT: "SSIT",
  MCU: "MCU",
};

export const Degree = {
  BE: "B.E",
  MCA: "MCA",
};

export const Branch = {
  Computer: "Computer",
  IT: "IT",
  Electrical: "Electrical",
  Civil: "Civil",
  Mechanical: "Mechanical",
};

// Define the data
// const UniversityData = {
//   GTU: {
//     SSIT: {
//       BE: ["Computer", "IT", "Electrical", "Civil", "Mechanical"],
//       MCA: [],
//     },
//     MCU: {
//       BE: ["Computer", "IT", "Electrical", "Civil", "Mechanical"],
//       MCA: [],
//     },
//   },
//   SU: {
//     SSIT: {
//       BE: [],
//       MCA: ["Computer", "IT"],
//     },
//     MCU: {
//       BE: [],
//       MCA: ["Computer", "IT"],
//     },
//   },
// };

// // Function to populate options based on selections
// function populateOptions(element, options) {
//   element.innerHTML = "";
//   options.forEach((option) => {
//     const optionElement = document.createElement("option");
//     optionElement.value = option;
//     optionElement.textContent = option;
//     element.appendChild(optionElement);
//   });
// }

// // Get elements
// const universitySelect = document.getElementById("university");
// const collegeSelect = document.getElementById("college");
// const degreeSelect = document.getElementById("degree");
// const branchSelect = document.getElementById("branch");

// // Event listeners
// universitySelect.addEventListener("change", function () {
//   const selectedUniversity = universitySelect.value;
//   const colleges = Object.keys(UniversityData[selectedUniversity]);
//   populateOptions(collegeSelect, colleges);
//   // Clear other selects
//   degreeSelect.innerHTML = "";
//   branchSelect.innerHTML = "";
// });

// collegeSelect.addEventListener("change", function () {
//   const selectedUniversity = universitySelect.value;
//   const selectedCollege = collegeSelect.value;
//   const degrees = Object.keys(
//     UniversityData[selectedUniversity][selectedCollege]
//   );
//   populateOptions(degreeSelect, degrees);
//   // Clear branch select
//   branchSelect.innerHTML = "";
// });

// degreeSelect.addEventListener("change", function () {
//   const selectedUniversity = universitySelect.value;
//   const selectedCollege = collegeSelect.value;
//   const selectedDegree = degreeSelect.value;
//   const branches =
//     UniversityData[selectedUniversity][selectedCollege][selectedDegree];
//   populateOptions(branchSelect, branches);
// });
