# PROJECT DOCUMENT: SmartAdmi

## 1. Project Title
**SmartAdmi** – Intelligent College Admission & Verification System

---

## 2. Project Objective
Traditional college admission processes are manual, slow, and prone to document fraud or human error. **SmartAdmi** solves this by automating and securing the admission pipeline. It utilizes artificial intelligence (AI) to verify student certificates, detect inconsistencies between student-entered data and document text (fraud detection), and recommend personalized courses based on student merit and interests.

---

## 3. Project Overview
SmartAdmi is a full-stack web application designed for students and college administrators. 
- **Students** can easily register, explore academic options, fill out a comprehensive admission form, upload supporting documents, and receive real-time AI-based course recommendations and status updates.
- **Administrators** have access to a secure dashboard where they can see incoming applications, review an AI-generated **"Authenticity Score"** (comparing form entries with uploaded documents), and instantly approve or reject applications.

---

## 4. Main Features
- **Comprehensive Admission Form**: A structured, step-by-step form capturing personal, academic (10th/12th), entrance exam (EAMCET), and career details.
- **Secure Document Upload**: Integrated upload system for academic marksheets and identity proofs directly within the admission form.
- **AI-Powered Fraud Detection**: Instantly compares user-entered details (like marks and names) with the text extracted from uploaded documents to identify mismatches.
- **AI Course Recommendation**: Analyzes academic scores and career interests to suggest the top 3 best-fit engineering or degree courses.
- **Interactive Admission Assistant**: A built-in AI chatbot helping students with queries about courses, deadlines, and requirements.
- **Admin Review Panel**: A dedicated administrative dashboard providing status filters, overall application analytics, and manual override controls.

---

## 5. Technologies Used
- **React (with TypeScript)**: A frontend library used to build a highly responsive and interactive user interface.
- **Vite**: A modern build tool that makes development extremely fast.
- **Tailwind CSS**: A utility-first CSS framework used for clean, modern, and professional visual styling.
- **Firebase Authentication**: Manages secure user login, registration, and logout sessions.
- **Cloud Firestore**: A flexible, real-time NoSQL database used to store application details and system settings securely.
- **Google Gemini API (`@google/genai`)**: The AI engine used for OCR (extracting text from certificates), fraud verification, course recommendation, and the interactive chatbot.
- **Motion (framer-motion)**: An animation library used to create smooth, elegant transitions and page load effects.
- **Lucide React**: A modern vector icon library providing UI symbols.

---

## 6. Project Structure
The project is modularly organized to separate user-interface code from system configuration:
- `src/components/`: Reusable interface blocks (e.g., `Navbar.tsx` for navigation, `Footer.tsx`).
- `src/pages/`: Page-specific interfaces, split by user roles:
  - `student/`: Student dashboards, admission forms, and status trackers.
  - `admin/`: Admin tables and application review panels.
  - `auth/`: Login and sign-up screen flows.
- `src/lib/`: Backend connections and core API clients:
  - `firebase.ts`: Configuration details for Firestore and Authentication databases.
  - `gemini.ts`: Direct AI methods (fraud analysis, recommendations, and chat).
- `src/index.css`: Global styles containing Tailwind directives and customized font pairings.

---

## 7. Workflow
```
[Student Registration] ➔ [Fills Admission Form & Uploads Files] 
                                    ⬇
                     [AI Extracts & Compares Data] 
                                    ⬇
    [AI Generates Fraud Score & Recommends Best-Fit Courses] 
                                    ⬇
              [Admin Approves/Rejects on Dashboard] 
                                    ⬇
             [Student Receives Final Notification]
```

1. **Sign Up**: The user creates an account as a Student.
2. **Admission Submission**: The student inputs their academic records, lists their career interests, uploads certificate images, and submits.
3. **AI Analysis (Automated)**:
   - **OCR (Optical Character Recognition)**: Gemini extracts written marks and names from the uploaded certificate images.
   - **Verification**: Gemini compares form values to the OCR values, generating an Authenticity percentage.
   - **Recommendation**: Gemini suggests courses based on the student's profile.
4. **Admin Review**: Administrators review the processed applications, inspect fraud reports, and make the final decision.
5. **Real-time Status**: The student views their step-by-step progress through an interactive timeline.

---

## 8. Important Components
- `AdmissionForm.tsx`: A robust, tabbed multi-step form handles state management and coordinate validation for student entry and local document uploads.
- `Status.tsx`: Houses the student status pipeline. It runs the OCR-to-Form fraud evaluation using Gemini on-demand and updates Firestore with results.
- `AdminDashboard.tsx`: Displays high-level analytics (Total Applications, Average Authenticity Score) and houses actions to approve or reject submissions in real-time.
- `gemini.ts`: Contains core integrations with the Google Gemini API. It handles structured JSON outputs for decision metrics, course lists, and the conversational assistant.

---

## 9. How to Run the Project
To run this project locally, follow these simple steps:

1. **Install Node.js**: Ensure you have Node.js (version 18+) installed on your machine.
2. **Install Dependencies**: Open your terminal in the project directory and run:
   ```bash
   npm install
   ```
3. **Set Up Environment Variables**: Create a `.env` file in the root directory and add your Google Gemini API key:
   ```env
   GEMINI_API_KEY=your_gemini_api_key_here
   ```
4. **Run Development Server**: Start the local server by running:
   ```bash
   npm run dev
   ```
5. **Access the App**: Open your browser and navigate to `http://localhost:3000`.

---

## 10. Future Improvements
- **Automated Document Categorization**: Automatically classify uploaded files (e.g., separate marksheets from ID cards) using AI vision before running OCR.
- **Relational Analytics**: Implement advanced data dashboards for administrative users to analyze application trends by region or academic year.
- **Government DB Integration**: Integrate with official academic boards or DigiLocker APIs to bypass manual verification entirely for certified digital records.
- **SMS & Email Alerts**: Set up automatic communication triggers to update students instantly when their application stage changes.
