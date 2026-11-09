# TalentBridge

**A Transparent Recruitment & Applicant Tracking System (MERN Stack)**

TalentBridge is a full-stack web application designed to fix two major problems in the hiring industry: **Candidate Ghosting** and **Resume Overload**. 

Instead of a "black box" application process, TalentBridge provides a shared view where applicants can track their progress in real-time, and recruiters can manage candidates efficiently using a Kanban board and an automated skill-matching algorithm.

🔗 **Live Demo:** [https://talentbridge-two-nu.vercel.app](https://talentbridge-two-nu.vercel.app)


## Core Features

### For Applicants
*   **Smart Onboarding:** A beautiful profile setup flow with professional headlines, bios, and dynamic skill tags.
*   **Image Uploads:** Upload profile and cover photos (saved securely via Base64).
*   **Job Board:** Browse all available jobs and view detailed descriptions.
*   **Resume Upload:** Apply for jobs by uploading a PDF/Word resume.
*   **Application Tracking:** Track your application status (Applied, Interviewing, Hired, Rejected).
*   **Rejection Feedback:** Receive actionable feedback from recruiters if rejected, closing the feedback loop.

### For Recruiters
*   **Recruiter Dashboard:** Post new jobs with required skills, salaries, and descriptions.
*   **Applicant Tracking System (ATS):** A visual 4-column Kanban board (Applied, Interviewing, Hired, Rejected) to manage candidates.
*   **Smart Match Algorithm:** Automatically calculates a match percentage based on the applicant's skills vs. the job's required skills.
*   **PDF Viewer:** Open applicant resumes directly in a new browser tab.
*   **Feedback Loop:** Leave specific feedback when rejecting a candidate.


## Technology Stack

*   **Frontend:** React 19, Vite, Custom CSS (Glassmorphism, Animations), Inline SVG Icons.
*   **Backend:** Node.js, Express.js, Bcrypt (Password Hashing), Multer (File Handling), Connect-Mongo (Session Storage).
*   **Database:** MongoDB Atlas, Mongoose (ODM).
*   **Deployment:** Vercel (Frontend & Backend deployed as separate services) + MongoDB Atlas.


## Architecture

The application follows a standard **Three-Tier Architecture**:
1.  **Presentation:** React SPA handling all UI and state.
2.  **Application:** Express REST API handling authentication, business logic, and file processing.
3.  **Data:** MongoDB Atlas handling persistent storage.

### Database Schema (ERD)
*   **User:** `_id`, `name`, `email`, `password` (hashed), `role`, `skills`, `headline`, `bio`, `profileImage`, `coverImage`, `profileComplete`.
*   **Job:** `_id`, `title`, `company`, `location`, `salary`, `skills`, `employerId` (FK).
*   **Application:** `_id`, `jobId` (FK), `applicantId` (FK), `resume` (Base64), `status`, `feedback`.

