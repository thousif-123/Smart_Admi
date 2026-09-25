import { jsPDF } from "jspdf";
import fs from "fs";
import path from "path";

// Initialize PDF document
const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });

// Layout and typography constants
const PAGE_WIDTH = 210;
const PAGE_HEIGHT = 297;
const MARGIN_LEFT = 20;
const MARGIN_RIGHT = 20;
const CONTENT_WIDTH = PAGE_WIDTH - MARGIN_LEFT - MARGIN_RIGHT; // 170mm

// Color palette
const COLOR_PRIMARY = [30, 41, 59];    // Slate Blue #1e293b
const COLOR_SECONDARY = [13, 148, 136]; // Teal #0d9488
const COLOR_TEXT = [51, 65, 85];       // Dark Slate #334155
const COLOR_MUTED = [100, 116, 139];   // Muted gray #64748b
const COLOR_BG_CARD = [248, 250, 252]; // Light card gray #f8fafc
const COLOR_BORDER = [226, 232, 240];  // Slate-200 #e2e8f0

// Core state to keep track of drawing position
let currentY = 30;

// Helper to draw the page header and footer
function drawHeaderFooter(pageNumber, totalPages) {
  if (pageNumber === 1) return; // Skip cover page

  // Header
  doc.setFont("Helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(...COLOR_MUTED);
  doc.text("SmartAdmi - Intelligent College Admission & Verification System", MARGIN_LEFT, 15);
  doc.text("Project Handout & Technical Handbook", PAGE_WIDTH - MARGIN_RIGHT, 15, { align: "right" });
  
  doc.setDrawColor(...COLOR_BORDER);
  doc.setLineWidth(0.3);
  doc.line(MARGIN_LEFT, 17, PAGE_WIDTH - MARGIN_RIGHT, 17);

  // Footer
  doc.line(MARGIN_LEFT, PAGE_HEIGHT - 17, PAGE_WIDTH - MARGIN_RIGHT, PAGE_HEIGHT - 17);
  doc.text("Confidential & Proprietary", MARGIN_LEFT, PAGE_HEIGHT - 12);
  doc.text(`Page ${pageNumber} of ${totalPages}`, PAGE_WIDTH - MARGIN_RIGHT, PAGE_HEIGHT - 12, { align: "right" });
}

// Helper to add heading with left accent bar
function drawSectionHeading(title) {
  // Check if we need a page break (heading size + some text)
  if (currentY > PAGE_HEIGHT - 35) {
    doc.addPage();
    currentY = 30;
  }

  // Left accent line
  doc.setFillColor(...COLOR_SECONDARY);
  doc.rect(MARGIN_LEFT, currentY, 3, 7, "F");

  // Heading Text
  doc.setFont("Helvetica", "bold");
  doc.setFontSize(14);
  doc.setTextColor(...COLOR_PRIMARY);
  doc.text(title, MARGIN_LEFT + 6, currentY + 5.5);

  currentY += 12;
}

// Helper to add subsection heading
function drawSubsectionHeading(title) {
  if (currentY > PAGE_HEIGHT - 25) {
    doc.addPage();
    currentY = 30;
  }

  doc.setFont("Helvetica", "bold");
  doc.setFontSize(11);
  doc.setTextColor(...COLOR_SECONDARY);
  doc.text(title, MARGIN_LEFT, currentY);
  currentY += 6;
}

// Helper to add body text
function drawBodyText(text, isItalic = false) {
  doc.setFont("Helvetica", isItalic ? "italic" : "normal");
  doc.setFontSize(10);
  doc.setTextColor(...COLOR_TEXT);
  
  const lines = doc.splitTextToSize(text, CONTENT_WIDTH);
  for (const line of lines) {
    if (currentY > PAGE_HEIGHT - 25) {
      doc.addPage();
      currentY = 30;
    }
    doc.text(line, MARGIN_LEFT, currentY);
    currentY += 5.2; // Line spacing
  }
}

// Helper to draw a bullet point
function drawBulletPoint(label, boldPart = "", textPart = "") {
  if (currentY > PAGE_HEIGHT - 22) {
    doc.addPage();
    currentY = 30;
  }

  // Draw bullet symbol
  doc.setFillColor(...COLOR_SECONDARY);
  doc.circle(MARGIN_LEFT + 2, currentY - 1, 1, "F");

  // Set font
  let indent = 6;
  doc.setFont("Helvetica", "bold");
  doc.setFontSize(10);
  doc.setTextColor(...COLOR_PRIMARY);

  let currentX = MARGIN_LEFT + indent;

  if (label) {
    doc.text(label, currentX, currentY);
    const labelWidth = doc.getTextWidth(label);
    currentX += labelWidth + 1;
  }

  if (boldPart) {
    doc.text(boldPart, currentX, currentY);
    const boldWidth = doc.getTextWidth(boldPart);
    currentX += boldWidth + 1;
  }

  if (textPart) {
    doc.setFont("Helvetica", "normal");
    doc.setTextColor(...COLOR_TEXT);
    
    const remainingWidth = PAGE_WIDTH - MARGIN_RIGHT - currentX;
    const lines = doc.splitTextToSize(textPart, remainingWidth);
    
    // Draw the first line immediately
    doc.text(lines[0], currentX, currentY);
    currentY += 5.2;

    // Draw the remaining lines
    for (let i = 1; i < lines.length; i++) {
      if (currentY > PAGE_HEIGHT - 22) {
        doc.addPage();
        currentY = 30;
      }
      doc.text(lines[i], MARGIN_LEFT + indent, currentY);
      currentY += 5.2;
    }
  } else {
    currentY += 5.2;
  }
}

// Helper to draw a modern card box for content
function drawCardBox(title, details, bulletPoints = []) {
  const estimateHeight = 15 + (details ? 12 : 0) + (bulletPoints.length * 8);
  if (currentY + estimateHeight > PAGE_HEIGHT - 22) {
    doc.addPage();
    currentY = 30;
  }

  const cardStartY = currentY;
  currentY += 6; // Leave space for border start

  // Draw temporary background and border (will update height dynamically)
  doc.setFont("Helvetica", "bold");
  doc.setFontSize(11);
  doc.setTextColor(...COLOR_PRIMARY);
  doc.text(title, MARGIN_LEFT + 5, currentY);
  currentY += 5;

  if (details) {
    doc.setFont("Helvetica", "normal");
    doc.setFontSize(9);
    doc.setTextColor(...COLOR_TEXT);
    const lines = doc.splitTextToSize(details, CONTENT_WIDTH - 10);
    for (const line of lines) {
      doc.text(line, MARGIN_LEFT + 5, currentY);
      currentY += 4.5;
    }
  }

  currentY += 2;

  // Render bullets inside card
  bulletPoints.forEach(bp => {
    if (currentY > PAGE_HEIGHT - 22) {
      // If we overflow, we must end card and start a new one, but for now we draw inside
    }
    // Mini bullet
    doc.setFillColor(...COLOR_MUTED);
    doc.circle(MARGIN_LEFT + 6, currentY - 1, 0.7, "F");

    doc.setFont("Helvetica", "bold");
    doc.setFontSize(9);
    doc.setTextColor(...COLOR_PRIMARY);
    doc.text(bp.name + ": ", MARGIN_LEFT + 9, currentY);
    const w = doc.getTextWidth(bp.name + ": ");

    doc.setFont("Helvetica", "normal");
    doc.setTextColor(...COLOR_TEXT);
    const detailLines = doc.splitTextToSize(bp.desc, CONTENT_WIDTH - 15 - w);
    doc.text(detailLines[0], MARGIN_LEFT + 9 + w, currentY);
    currentY += 4.5;

    for(let i = 1; i < detailLines.length; i++) {
      doc.text(detailLines[i], MARGIN_LEFT + 9 + w, currentY);
      currentY += 4.5;
    }
    currentY += 1.5;
  });

  const cardHeight = currentY - cardStartY;
  
  // Actually draw the card background and border in the background of text
  // We use jspdf's context stacking or just draw the box under the text
  // Since we drew text already, drawing rect will cover it unless we use 'S' outline, or do it before.
  // Let's draw an outline border and simple side ribbon.
  doc.setDrawColor(...COLOR_BORDER);
  doc.setLineWidth(0.4);
  doc.setFillColor(...COLOR_BG_CARD);
  // Re-draw outer rectangle with 'S' stroke-only, and draw background manually if we want to.
  // Instead of drawing on top, we draw a border box around the computed space
  doc.rect(MARGIN_LEFT, cardStartY, CONTENT_WIDTH, cardHeight, "S");
  
  // Side colored ribbon
  doc.setFillColor(...COLOR_SECONDARY);
  doc.rect(MARGIN_LEFT, cardStartY, 1.5, cardHeight, "F");

  currentY += 5; // Spacing after card
}


// ==========================================
// 1. PAGE 1: COVER PAGE
// ==========================================
// Left color bar decoration
doc.setFillColor(...COLOR_PRIMARY);
doc.rect(0, 0, 15, PAGE_HEIGHT, "F");

// Top accent ribbon
doc.setFillColor(...COLOR_SECONDARY);
doc.rect(15, 0, PAGE_WIDTH - 15, 8, "F");

// Title text
doc.setFont("Helvetica", "bold");
doc.setFontSize(32);
doc.setTextColor(...COLOR_PRIMARY);
doc.text("SmartAdmi", 30, 75);

doc.setFont("Helvetica", "bold");
doc.setFontSize(16);
doc.setTextColor(...COLOR_SECONDARY);
doc.text("Intelligent College Admission & Verification System", 30, 87);

doc.setDrawColor(...COLOR_SECONDARY);
doc.setLineWidth(1.5);
doc.line(30, 95, 120, 95);

// Subtitle
doc.setFont("Helvetica", "normal");
doc.setFontSize(12);
doc.setTextColor(...COLOR_TEXT);
doc.text("An AI-Driven Full-Stack Application for Automated Certificate OCR,", 30, 107);
doc.text("Real-Time Course Recommendations, and Fraud Prevention Analysis.", 30, 113);

// Meta details box
const metaY = 160;
doc.setFillColor(...COLOR_BG_CARD);
doc.setDrawColor(...COLOR_BORDER);
doc.setLineWidth(0.5);
doc.rect(30, metaY, PAGE_WIDTH - 55, 65, "FD");

// Left accent on meta box
doc.setFillColor(...COLOR_PRIMARY);
doc.rect(30, metaY, 2, 65, "F");

doc.setFont("Helvetica", "bold");
doc.setFontSize(11);
doc.setTextColor(...COLOR_PRIMARY);
doc.text("PROJECT DOCUMENTATION & ARCHITECTURE HANDBOOK", 38, metaY + 12);

doc.setFont("Helvetica", "normal");
doc.setFontSize(9.5);
doc.setTextColor(...COLOR_TEXT);

doc.setFont("Helvetica", "bold");
doc.text("Author: ", 38, metaY + 24);
doc.setFont("Helvetica", "normal");
doc.text("Google AI Studio Build Team", 55, metaY + 24);

doc.setFont("Helvetica", "bold");
doc.text("Version: ", 38, metaY + 32);
doc.setFont("Helvetica", "normal");
doc.text("Production Release 1.0.0 (TypeScript)", 55, metaY + 32);

doc.setFont("Helvetica", "bold");
doc.text("AI Platform: ", 38, metaY + 40);
doc.setFont("Helvetica", "normal");
doc.text("Google Gemini Developer Models (@google/genai)", 62, metaY + 40);

doc.setFont("Helvetica", "bold");
doc.text("Core Stack: ", 38, metaY + 48);
doc.setFont("Helvetica", "normal");
doc.text("React (v19) + Express Server + Firebase Realtime Firestore", 62, metaY + 48);

doc.setFont("Helvetica", "italic");
doc.setFontSize(9);
doc.setTextColor(...COLOR_MUTED);
doc.text("Generated: July 2026 • AI Studio Verified Sandbox", 38, metaY + 58);


// ==========================================
// 2. PAGE 2: OBJECTIVES & WORKFLOW
// ==========================================
doc.addPage();
currentY = 28;

drawSectionHeading("1. Executive Summary & Objectives");
drawBodyText(
  "Traditional college admission pipelines suffer from high manual overhead, slow operational turnarounds, and elevated vulnerability to document manipulation, transcript fraud, or clerical entry errors. SmartAdmi directly addresses these systemic bottlenecks by introducing a secure, fully automated, and intelligent admission ecosystem."
);
currentY += 2;
drawBodyText(
  "The system streamlines student registration and leverages cutting-edge artificial intelligence to cross-verify physical credentials, automatically audit academic records, and generate personalized course recommendations, establishing a reliable, frictionless experience for both students and universities."
);

currentY += 5;
drawSubsectionHeading("Core Functional Goals");
drawBulletPoint("Automate Document Audits: ", "OCR Extraction", "Instantly parse text and grades from uploaded certificates, completely eliminating manual transcription.");
drawBulletPoint("Mitigate Credential Fraud: ", "Authenticity Scoring", "Evaluate user inputs against visual documents to yield an automated confidence coefficient.");
drawBulletPoint("Personalized Counseling: ", "Intelligent Recommendations", "Assess applicant metrics and career interests to offer matching engineering branches.");
drawBulletPoint("Interactive Guidance: ", "Admission Companion Chatbot", "Address applicant questions on enrollment timelines, requirements, and curricula 24/7.");

currentY += 7;
drawSectionHeading("2. System Architecture & Workflows");
drawBodyText(
  "SmartAdmi is built upon a distributed full-stack architecture. The user interface, constructed in React, coordinates with an Express.js backend API that acts as a secure proxy to external services, isolating API secrets and preventing client-side leaks."
);
currentY += 4;

// Workflow diagram box
const diagY = currentY;
doc.setFillColor(...COLOR_BG_CARD);
doc.setDrawColor(...COLOR_BORDER);
doc.rect(MARGIN_LEFT, diagY, CONTENT_WIDTH, 42, "FD");

doc.setFont("Helvetica", "bold");
doc.setFontSize(9);
doc.setTextColor(...COLOR_PRIMARY);
doc.text("SYSTEM WORKFLOW SCHEMATIC", MARGIN_LEFT + 6, diagY + 6);

// Simple text flow diagram
doc.setFont("Courier", "bold");
doc.setFontSize(8.5);
doc.setTextColor(...COLOR_SECONDARY);
doc.text("[Student Registration & Login] (Firebase Auth)", MARGIN_LEFT + 10, diagY + 14);
doc.setTextColor(...COLOR_MUTED);
doc.text("                  \u2193", MARGIN_LEFT + 10, diagY + 18);
doc.setTextColor(...COLOR_SECONDARY);
doc.text("[Submit Marks & Certificate Upload] (React Hook Form + Base64 Compressor)", MARGIN_LEFT + 10, diagY + 22);
doc.setTextColor(...COLOR_MUTED);
doc.text("                  \u2193", MARGIN_LEFT + 10, diagY + 26);
doc.setTextColor(...COLOR_SECONDARY);
doc.text("[Gemini Secure AI OCR, Comparison & Course Engine] (Express API Proxy)", MARGIN_LEFT + 10, diagY + 30);
doc.setTextColor(...COLOR_MUTED);
doc.text("                  \u2193", MARGIN_LEFT + 10, diagY + 34);
doc.setTextColor(...COLOR_SECONDARY);
doc.text("[Real-time Board Decision & Automated Status Notify] (Firestore + Nodemailer)", MARGIN_LEFT + 10, diagY + 38);

currentY += 48;


// ==========================================
// 3. PAGE 3: TECHNICAL STACK & DEPENDENCY DETAIL
// ==========================================
doc.addPage();
currentY = 28;

drawSectionHeading("3. Detailed Technology Stack");
drawBodyText(
  "The system utilizes industry-grade tools across every tier of execution to guarantee speed, modularity, visual luxury, and rigid security policies."
);
currentY += 4;

drawCardBox("Core Runtime & Build Systems", "The framework engine supporting compile-time validation and high-speed serving.", [
  { name: "Node.js (v18/v20/v22)", desc: "Serves as the server runtime and hosting engine for our Express REST api." },
  { name: "TypeScript (v5.8)", desc: "Enforces strong type interfaces, static verification, and strict compile-time contracts." },
  { name: "Vite (v6.2)", desc: "Powers hot module optimization and bundles light assets for production assets." },
  { name: "esbuild (v0.28)", desc: "Bundles server TS code into a clean CommonJS file (dist/server.cjs) bypassing Node relative import errors." }
]);

drawCardBox("Database & Intelligent AI Tiers", "The databases holding user state and the intelligence layers parsing academic files.", [
  { name: "Firebase Client SDK", desc: "Allows instant database subscriptions and pushes application documents from the browser." },
  { name: "Firebase Admin SDK", desc: "Runs elevated, server-authorized commands like duplicate checks on the Express backend." },
  { name: "Google Gemini API", desc: "Leverages cutting-edge models via `@google/genai` to perform multimodal OCR, fraud matching, and chat." },
  { name: "Nodemailer", desc: "Sends instant HTML mail notifications to students when administration boards review their application status." }
]);

drawCardBox("Client UI & Experience Layer", "A luxurious, responsive dashboard styled with deep focus on accessibility and motion.", [
  { name: "Tailwind CSS (v4.1)", desc: "A utility styling engine delivering layout responsive grids across desktop and mobile devices." },
  { name: "Motion", desc: "Produces visual rhythmic animations, staggered page entrances, and smooth route transitions." },
  { name: "Lucide React Icons", desc: "Serves clean, scalable SVG symbols supporting interactive dashboards and application status pipelines." }
]);


// ==========================================
// 4. PAGE 4: DETAILED CODE PATHS & IMPLEMENTATIONS
// ==========================================
doc.addPage();
currentY = 28;

drawSectionHeading("4. Essential Source Code Architecture");
drawBodyText(
  "The codebase is divided into modular, decoupled scripts mapping frontend rendering components from core security API processes."
);
currentY += 4;

drawSubsectionHeading("Key File Map & Responsibility Matrix");
drawBulletPoint("src/pages/student/AdmissionForm.tsx: ", "Admission Pipeline", "A multi-step, responsive form. Collects candidate details, performs file compression to prevent database storage over-bloat, and triggers secure verification API requests.");
drawBulletPoint("src/pages/student/Status.tsx: ", "Interactive Timeline", "Renders a real-time status pipeline showing whether the student's credentials have cleared OCR and are currently pending board approval.");
drawBulletPoint("src/pages/admin/Dashboard.tsx: ", "Admin Control Panel", "Displays application metrics (average authenticity score, total submissions, engineering course trends) and handles manual approvals/rejections.");
drawBulletPoint("src/lib/gemini.ts: ", "AI Intelligence client", "Wraps the Google GenAI SDK. Extracts structured JSON for course recommendations and conducts fraud evaluation with structured fallback schemas.");
drawBulletPoint("server.ts: ", "Express API Layer & Vite Server", "Enforces server-side authentication proxy endpoints, handles CORS, implements file listeners, and securely compiles Vite assets.");
drawBulletPoint("src/lib/mlFraudService.ts: ", "Heuristic Fraud Model", "Acts as an offline-first backup utilizing a Naive Bayes classifier when network connectivity is lost or Firebase Firestore is unreachable.");

currentY += 6;
drawSectionHeading("5. Security Policies & Offline Resilience");
drawBodyText(
  "To maintain high integrity in demanding environments, SmartAdmi incorporates extensive security protocols and intelligent, graceful offline fallbacks:"
);
currentY += 4;

drawBulletPoint("Secure API Key Shielding: ", "Express Gateway", "The Gemini API key is hosted completely server-side in the Node environment. No client-side code can access the key, ensuring zero key exposure.");
drawBulletPoint("Strict Firestore Rules: ", "Document Access Guard", "Rules ensure students can only create or view their own application file, while admin roles are explicitly authorized via custom claims lists.");
drawBulletPoint("Fail-Safe AI Recommendation: ", "Dual-Execution Engine", "If the Google Gemini service hits quotas, network disruptions, or has key issues, the Express backend automatically runs a mathematical fallback model matching the student's metrics to historical academic brackets seamlessly.");
drawBulletPoint("Offline Local Storage Cache: ", "Firestore Offline Persistence", "Active local caching allows students to draft and view their current progress even during transient network disconnects, syncing changes as soon as connectivity resumes.");


// ==========================================
// 5. PAGE 5: LOCAL DEPLOYMENT GUIDE & ROADMAP
// ==========================================
doc.addPage();
currentY = 28;

drawSectionHeading("6. Local Development & Deployment Guide");
drawBodyText(
  "SmartAdmi is configured to run instantly out-of-the-box on your computer. Follow these steps to configure your own free private database environment:"
);
currentY += 4;

drawSubsectionHeading("Step-by-Step System Bootstrap");
drawBulletPoint("1. Extract Workspace Archive: ", "", "Download the repository ZIP from AI Studio settings and extract it to a local folder.");
drawBulletPoint("2. Install Software Prerequisites: ", "", "Download Node.js (LTS version) and Visual Studio Code (VS Code) for your platform.");
drawBulletPoint("3. Establish Database: ", "Firebase Console", "Go to console.firebase.google.com. Create a project named 'SmartAdmi', enable Email/Password Authentication, and activate Firestore in test mode.");
drawBulletPoint("4. Configure Variables: ", "VS Code .env", "Replace the project API keys inside firebase-applet-config.json and create a root .env file containing your GEMINI_API_KEY.");
drawBulletPoint("5. Install Dependencies & Boot: ", "npm install", "Run 'npm install' in the VS Code terminal, followed by 'npm run dev' to boot the application on http://localhost:3000.");

currentY += 6;
drawSectionHeading("7. Future Roadmap Improvements");
drawBodyText(
  "To scale SmartAdmi to support tier-1 academic institutions globally, the following features are planned for subsequent core rollouts:"
);
currentY += 4;

drawBulletPoint("Government Database Verification: ", "DigiLocker Integration", "Hook into sovereign academic database APIs to automatically cross-match certifications against cryptographic official registries.");
drawBulletPoint("Visual OCR Model Matching: ", "Multimodal CNN Filters", "Deploy custom vision classifiers to automatically identify document types (e.g. distinguishing a driver's license from a school marksheet) before extracting grades.");
drawBulletPoint("Predictive Student Analytics: ", "Deep Learning Forecast", "Build models predicting graduation success or academic performance in specific engineering branches based on historical multi-year records.");
drawBulletPoint("Sovereign Multi-Tenant Hosting: ", "Kubernetes Deployment", "Deploy stateless container clusters with Cloud SQL databases to process millions of parallel admissions securely.");


// ==========================================
// APPLY HEADER, FOOTER, AND WRITE FILE
// ==========================================
const totalPages = doc.getNumberOfPages();
for (let i = 1; i <= totalPages; i++) {
  doc.setPage(i);
  drawHeaderFooter(i, totalPages);
}

// Convert PDF output to binary buffer and write directly to disk
const pdfArrayBuffer = doc.output("arraybuffer");
const pdfBuffer = Buffer.from(pdfArrayBuffer);

const targetDir = path.join(process.cwd(), "public");
if (!fs.existsSync(targetDir)) {
  fs.mkdirSync(targetDir, { recursive: true });
}

const targetPath = path.join(targetDir, "SmartAdmi_Project_Documentation.pdf");
fs.writeFileSync(targetPath, pdfBuffer);

console.log(`[PDF GENERATOR] Successfully compiled elegant PDF at: ${targetPath}`);
