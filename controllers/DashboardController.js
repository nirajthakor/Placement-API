import tbl_jobpost from "../model/JobModel.js";
import tbl_university from "../model/UniversityMode.js";
import tbl_college from "../model/CollegeModel.js";
import tbl_company from "../model/CompanyModel.js";
import tbl_student from "../model/StudentModel.js";
import tbl_jobcollege from "../model/JobCollegeModel.js";
import tbl_tpo from "../model/TPOModel.js";
import tbl_apply from "../model/ApplicationModel.js";
import { StatusCodes } from "http-status-codes";
import mongoose from "mongoose";
import day from "dayjs";

export const showStats = async (req, res) => {
  // Count total universities
  const totalUniversities = await tbl_university.countDocuments();
  // Count total college
  const totalCollege = await tbl_college.countDocuments();
  // Count total company
  const totalCompany = await tbl_company.countDocuments();
  // Count total college for universities
  const totalCollegeUni = await tbl_college.countDocuments({
    college_university_id: req.user.userId,
  });
  // Count total student for universities
  const totalStudentUni = await tbl_student.countDocuments({
    university_id: req.user.userId,
  });
  // Count total student for college
  const totalStudentClg = await tbl_student.countDocuments({
    college_id: req.user.userId,
  });
  let TPOData = {};
  const tpo = await tbl_tpo.findById(req.user.userId);
  // let totalStudentTPO = 0;
  // let totalJobsTPO = 0;
  if (tpo) {
    // Count total student for TPO
    const totalStudentTPO = await tbl_student.countDocuments({
      college_id: tpo.tpo_college_id,
    });
    // Count total jobs for TPO
    const totalJobsTPO = await tbl_jobcollege.countDocuments({
      job_college_id: tpo.tpo_college_id,
    });
    TPOData = {
      studentTPO: totalStudentTPO || 0,
      jobTPO: totalJobsTPO || 0,
    };
  }
  // Count total jobs
  const totalJobs = await tbl_jobcollege.countDocuments({
    job_college_id: req.user.userId,
  });
  // Count total jobs for company
  const totalJob = await tbl_jobpost.countDocuments({
    job_company_id: req.user.userId,
  });
  // Count total student for company
  const totalStudent = await tbl_student.countDocuments({});

  let studentData = {};
  const student = await tbl_student.findById(req.user.userId);
  // let totaljobsOpe = 0;
  if (student) {
    // Count total job openings for Student
    const totaljobsOpe = await tbl_jobcollege.countDocuments({
      job_college_id: student.college_id,
    });
    studentData = {
      jobsOpe: totaljobsOpe || 0,
    };
  }
  // Count total apply
  const totalJobsApply = await tbl_apply.countDocuments({
    student_id: req.user.userId,
  });
  // Count total apply and approved
  const JobsApproved = await tbl_apply.countDocuments({
    student_id: req.user.userId,
    application_current_status: 1,
  });
  // total job for student
  const JobAll = await tbl_jobpost.countDocuments({});

  const defaultStats = {
    university: totalUniversities || 0,
    college: totalCollege || 0,
    collegeUni: totalCollegeUni || 0,
    company: totalCompany || 0,
    studentUni: totalStudentUni || 0,
    studentClg: totalStudentClg || 0,
    job: totalJobs || 0,
    jobs: totalJob || 0,
    student: totalStudent || 0,
    JobsApply: totalJobsApply || 0,
    JobAll: JobAll || 0,
    JobsApproved: JobsApproved || 0,
    // studentTPO: totalStudentTPO || 0,
    // jobTPO: totalJobsTPO || 0,
    // jobsOpe: totaljobsOpe || 0,
    ...studentData,
    ...TPOData,
  };

  let monthlyApplications = await tbl_jobpost.aggregate([
    {
      $group: {
        _id: { year: { $year: "$createdAt" }, month: { $month: "$createdAt" } },
        count: { $sum: 1 },
      },
    },
    { $sort: { "_id.year": -1, "_id.month": -1 } },
    { $limit: 6 },
  ]);
  monthlyApplications = monthlyApplications
    .map((item) => {
      const {
        _id: { year, month },
        count,
      } = item;

      const date = day()
        .month(month - 1)
        .year(year)
        .format("MMM YY");
      return { date, count };
    })
    .reverse();

  res.status(StatusCodes.OK).json({ defaultStats, monthlyApplications });
};
