import nodemailer from 'nodemailer';
import { initializeApp, getApps, getApp, App, cert } from 'firebase-admin/app';
import { getFirestore, FieldValue, Firestore } from 'firebase-admin/firestore';
import fs from 'fs';
import path from 'path';

// Load config to get the correct database ID
const configPath = path.join(process.cwd(), 'firebase-applet-config.json');
let firebaseConfig: any = {};
try {
  if (fs.existsSync(configPath)) {
    firebaseConfig = JSON.parse(fs.readFileSync(configPath, 'utf8'));
  }
} catch (error) {
  console.error('Error reading firebase-applet-config.json:', error);
}

// Initialize Admin SDK safely
export let adminDb: Firestore | null = null;
export let isFirebaseAdminInitialized = false;

try {
  if (firebaseConfig.projectId) {
    let app: App | null = null;
    const serviceAccountPath = path.join(process.cwd(), 'firebase-service-account.json');
    const hasServiceAccount = fs.existsSync(serviceAccountPath);
    const isProduction = process.env.NODE_ENV === 'production';

    if (getApps().length === 0) {
      if (hasServiceAccount) {
        const serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath, 'utf8'));
        app = initializeApp({
          credential: cert(serviceAccount),
          projectId: firebaseConfig.projectId
        });
        console.log('[NOTIFICATION SERVICE] Initialized Firebase Admin using local service account key.');
      } else if (isProduction) {
        // Cloud Run supplies Application Default Credentials in production.
        // Do not attempt ADC on a developer machine: it triggers Google Auth's
        // credential lookup and can crash the local server when no account is configured.
        try {
          app = initializeApp({
            projectId: firebaseConfig.projectId
          });
          console.log('[NOTIFICATION SERVICE] Initialized Firebase Admin using Application Default Credentials (ADC) or environmental credentials.');
        } catch (adcErr) {
          console.warn('[NOTIFICATION SERVICE] Failed to initialize Firebase Admin with ADC:', adcErr);
          // Safe local fallback: Do not initialize Admin SDK to prevent ADC crash, but warn user
          console.warn('\n======================================================================');
          console.warn('[WARNING] No "firebase-service-account.json" file found in your folder.');
          console.warn('The server-side background listeners and notification logs are disabled.');
          console.warn('To enable them, follow the guide to download your service account key.');
          console.warn('======================================================================\n');
        }
      } else {
        console.warn('[NOTIFICATION SERVICE] No Firebase Admin credentials found. Local development will use local_db.json; client-side Firebase Auth remains available.');
      }
    } else {
      app = getApp();
    }
    
    if (app) {
      const dbId = firebaseConfig.firestoreDatabaseId;
      if (dbId) {
        adminDb = getFirestore(app, dbId);
      } else {
        adminDb = getFirestore(app);
      }
      isFirebaseAdminInitialized = true;
      console.log('[NOTIFICATION SERVICE] Firebase Admin successfully initialized for project:', firebaseConfig.projectId, 'databaseId:', dbId);

      // Perform a quick connectivity/permission check asynchronously to verify access
      adminDb.collection('applications').limit(1).get()
        .then(() => {
          console.log('[NOTIFICATION SERVICE] Firestore Admin connectivity and permissions verified successfully.');
        })
        .catch((err) => {
          console.warn('[NOTIFICATION SERVICE] Firestore database collection "applications" is not accessible:', err.message || err);
          console.warn('[NOTIFICATION SERVICE] Disabling server-side Firestore operations to run with local JSON DB persistence fallback cleanly.');
          isFirebaseAdminInitialized = false;
        });
    }
  } else {
    console.warn('[NOTIFICATION SERVICE] No Firebase projectId found. Running in mock DB mode.');
  }
} catch (error) {
  console.error('[NOTIFICATION SERVICE] Firebase Admin initialization failed:', error);
}

// Generate styled HTML email template
export function getEmailTemplate(studentName: string, course: string, status: string, feedback?: string, collegePreferences: string[] = []) {
  const statusColors: any = {
    'Approved': '#10B981',
    'Rejected': '#EF4444',
    'Pending': '#F59E0B',
    'Under Review': '#3B82F6',
    'Under Manual Verification': '#8B5CF6'
  };

  const statusColor = statusColors[status] || '#3B82F6';

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Admission Status Update</title>
      <style>
        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
          background-color: #f9fafb;
          color: #1f2937;
          margin: 0;
          padding: 0;
        }
        .container {
          max-width: 600px;
          margin: 40px auto;
          background: #ffffff;
          border-radius: 12px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
          overflow: hidden;
          border: 1px solid #e5e7eb;
        }
        .header {
          background-color: #4f46e5;
          padding: 32px;
          text-align: center;
          color: white;
        }
        .header h1 {
          margin: 0;
          font-size: 24px;
          font-weight: 700;
          letter-spacing: -0.05em;
        }
        .content {
          padding: 40px;
        }
        .greeting {
          font-size: 18px;
          font-weight: 600;
          margin-top: 0;
          margin-bottom: 16px;
        }
        .status-badge {
          display: inline-block;
          padding: 6px 16px;
          font-size: 14px;
          font-weight: 600;
          border-radius: 9999px;
          color: white;
          background-color: ${statusColor};
          margin-bottom: 24px;
        }
        .details-box {
          background-color: #f3f4f6;
          border-radius: 8px;
          padding: 20px;
          margin-bottom: 24px;
        }
        .details-row {
          display: flex;
          justify-content: space-between;
          padding: 8px 0;
          border-bottom: 1px solid #e5e7eb;
        }
        .details-row:last-child {
          border-bottom: none;
        }
        .details-label {
          color: #6b7280;
          font-weight: 500;
        }
        .details-value {
          font-weight: 600;
        }
        .feedback {
          border-left: 4px solid #4f46e5;
          padding-left: 16px;
          font-style: italic;
          color: #4b5563;
          margin: 24px 0;
        }
        .footer {
          background-color: #f9fafb;
          padding: 24px;
          text-align: center;
          font-size: 12px;
          color: #9ca3af;
          border-top: 1px solid #e5e7eb;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>SmartAdmi Admission System</h1>
        </div>
        <div class="content">
          <p class="greeting">Hello ${studentName},</p>
          <p>The status of your college admission application has been updated.</p>
          
          <div style="text-align: center;">
            <span class="status-badge">${status}</span>
          </div>

          <div class="details-box">
            <div class="details-row">
              <span class="details-label">Course:</span>
              <span class="details-value">${course}</span>
            </div>
            <div class="details-row">
              <span class="details-label">New Status:</span>
              <span class="details-value">${status}</span>
            </div>
          </div>

          ${status === 'Approved' ? `
            <div class="details-box" style="background-color: #ecfdf5; border: 1px solid #a7f3d0;">
              <div style="font-weight: 700; color: #065f46; margin-bottom: 8px;">Your next step</div>
              <div style="color: #065f46; line-height: 1.6;">Congratulations—your application has been approved. Please contact or visit the admissions office of your selected college(s) with your original documents to complete the college admission process.</div>
              ${collegePreferences.length > 0 ? `<div style="margin-top: 12px; font-size: 13px; color: #065f46;"><strong>Your submitted preferences:</strong><br/>${collegePreferences.map((college, index) => `${index + 1}. ${college}`).join('<br/>')}</div>` : ''}
            </div>
          ` : ''}

          ${feedback ? `
            <div style="font-weight: 600; font-size: 14px; color: #374151; margin-bottom: 8px;">Feedback from Admission Board:</div>
            <div class="feedback">"${feedback}"</div>
          ` : ''}

          <p>You can view full details and track your application pipeline by logging into the SmartAdmi portal.</p>
        </div>
        <div class="footer">
          <p>© 2026 SmartAdmi Admission System. All rights reserved.</p>
          <p>This is an automated notification. Please do not reply to this email.</p>
        </div>
      </div>
    </body>
    </html>
  `;
}

// Dispatches SMTP or Mock Email
export async function sendEmailNotification(to: string, studentName: string, course: string, status: string, feedback?: string, collegePreferences: string[] = []) {
  const subject = status === 'Approved'
    ? 'SmartAdmi: Your Admission Application Has Been Approved'
    : `SmartAdmi Admission Update - Application ${status}`;
  const htmlContent = getEmailTemplate(studentName, course, status, feedback, collegePreferences);
  const approvalText = status === 'Approved'
    ? ` Your application has been approved. Please contact or visit the admissions office of your selected college(s) with your original documents to complete admission.${collegePreferences.length ? ` Your preferences: ${collegePreferences.join(', ')}.` : ''}`
    : '';

  // Print highly visible console log block for validation and preview
  console.log('\n==================================================');
  console.log('[EMAIL SERVICE] AUTOMATED NOTIFICATION DISPATCHED');
  console.log(`To:      ${to}`);
  console.log(`Subject: ${subject}`);
  console.log(`Status:  ${status}`);
  console.log('--------------------------------------------------');
  console.log(`Dear ${studentName},\n\nYour application status for ${course} has been updated to: ${status}.`);
  if (feedback) {
    console.log(`Feedback: "${feedback}"`);
  }
  console.log('==================================================\n');

  // Load SMTP config if present in environment
  const smtpUser = process.env.SMTP_USER;
  const smtpPass = process.env.SMTP_PASS;
  const smtpHost = process.env.SMTP_HOST || 'smtp.gmail.com';
  const smtpPort = parseInt(process.env.SMTP_PORT || '587', 10);

  if (smtpUser && smtpPass) {
    try {
      const transporter = nodemailer.createTransport({
        host: smtpHost,
        port: smtpPort,
        secure: smtpPort === 465,
        auth: {
          user: smtpUser,
          pass: smtpPass
        }
      });

      await transporter.sendMail({
        from: `"SmartAdmi Admissions" <${smtpUser}>`,
        to: to,
        subject: subject,
      text: `Hello ${studentName}, Your application status for ${course} is now ${status}.${approvalText} ${feedback ? 'Feedback: ' + feedback : ''}`,
        html: htmlContent
      });
      console.log(`[EMAIL SERVICE] Real email successfully sent to ${to}`);
      return { success: true, method: 'smtp' };
    } catch (error) {
      console.error('[EMAIL SERVICE] Failed to send real email via SMTP:', error);
      return { success: false, error, method: 'smtp' };
    }
  } else {
    console.log('[EMAIL SERVICE] SMTP not configured. Environment variables SMTP_USER and SMTP_PASS are required for real email sending.');
    return { success: true, method: 'mock' };
  }
}

// Stores the email notification record in Firestore for full transparency
export async function saveNotificationRecord(
  studentUid: string,
  studentEmail: string,
  studentName: string,
  status: string,
  course: string,
  feedback?: string
) {
  if (!isFirebaseAdminInitialized || !adminDb) {
    console.warn('[NOTIFICATION SERVICE] Cannot save notification record: Firebase Admin is not initialized.');
    return null;
  }

  try {
    const subject = `SmartAdmi Admission Update - Application ${status}`;
    const body = `Dear ${studentName}, your application status for ${course} has been updated to ${status}.${feedback ? ' Board Feedback: ' + feedback : ''}`;
    
    const notificationData = {
      studentUid,
      studentEmail,
      studentName,
      status,
      course,
      subject,
      body,
      sentAt: FieldValue.serverTimestamp(),
      type: 'email'
    };

    const docRef = await adminDb.collection('notifications').add(notificationData);
    console.log(`[NOTIFICATION STORE] Notification saved with ID: ${docRef.id}`);
    return docRef.id;
  } catch (error) {
    console.error('[NOTIFICATION STORE] Failed to save notification to Firestore:', error);
    return null;
  }
}

// Configures automatic onSnapshot background triggers
export function startBackgroundStatusListener() {
  if (!isFirebaseAdminInitialized || !adminDb) {
    console.warn('[NOTIFICATION SERVICE] Cannot start background listener: Firebase Admin is not initialized.');
    return;
  }

  console.log('[NOTIFICATION SERVICE] Checking Firestore collection "applications" accessibility before starting background listener...');
  
  // Test if Firestore collection is accessible first to avoid infinite retry loops if database is not provisioned
  adminDb.collection('applications').limit(1).get()
    .then(() => {
      console.log('[NOTIFICATION SERVICE] Firestore connection verified. Starting background listener on the "applications" collection...');
      
      // Local cache to keep track of existing statuses to only notify on real updates
      const statusCache = new Map<string, string>();
      let isInitialLoad = true;

      const unsubscribe = (adminDb as Firestore).collection('applications').onSnapshot((snapshot: any) => {
        snapshot.docChanges().forEach((change: any) => {
          const data = change.doc.data();
          const id = change.doc.id;
          const currentStatus = data.status;
          const cachedStatus = statusCache.get(id);

          // Store in cache
          statusCache.set(id, currentStatus);

          // Skip triggering emails during the initial collection load to avoid spamming historical records
          if (isInitialLoad) return;

          // Trigger if it's a modified document and the status has changed
          if (change.type === 'modified' && cachedStatus && cachedStatus !== currentStatus) {
            console.log(`[NOTIFICATION SERVICE] Detected status update for application ${id}: ${cachedStatus} -> ${currentStatus}`);
            
            const email = data.email || data.studentEmail; // Handle different potential email field names
            const name = data.fullName || data.studentName || 'Student';
            const course = data.preferredCourse || data.course || 'Selected Course';
            const feedback = data.feedback || '';

            if (email) {
              sendEmailNotification(email, name, course, currentStatus, feedback);
              saveNotificationRecord(data.studentUid, email, name, currentStatus, course, feedback);
            } else {
              console.warn(`[NOTIFICATION SERVICE] No email found for application ${id}. Cannot send notification.`);
            }
          }
        });

        if (isInitialLoad) {
          isInitialLoad = false;
          console.log(`[NOTIFICATION SERVICE] Initial load completed. Listening to subsequent changes... (Cached ${statusCache.size} applications)`);
        }
      }, (error: any) => {
        console.error('[NOTIFICATION SERVICE] Error in background status listener:', error);
        // Unsubscribe to avoid infinite retry loops on permanent failures
        if (error.code === 5 || error.message?.includes('NOT_FOUND') || error.message?.includes('retry')) {
          console.warn('[NOTIFICATION SERVICE] Permanent Firestore error detected, closing listener to prevent retry spam.');
          if (typeof unsubscribe === 'function') unsubscribe();
        }
      });
    })
    .catch((err: any) => {
      console.warn('[NOTIFICATION SERVICE] Firestore database collection "applications" is not accessible (perhaps database is not provisioned/found or permission denied):', err.message || err);
      console.warn('[NOTIFICATION SERVICE] Running in local DB fallback mode. Real-time background update listener is disabled.');
    });
}

// Check if a hall ticket is duplicate using admin privileges
export async function checkDuplicateHallTicketAdmin(hallTicket: string, currentAppId: string): Promise<boolean> {
  if (!isFirebaseAdminInitialized || !adminDb) {
    console.warn('[DUPLICATE CHECK] Firebase Admin not initialized. Falling back to false.');
    return false;
  }
  try {
    const querySnapshot = await adminDb.collection('applications')
      .where('hallTicketEamcet', '==', hallTicket)
      .get();
    
    return querySnapshot.docs.some((doc: any) => doc.id !== currentAppId);
  } catch (error) {
    console.error('[DUPLICATE CHECK] Error querying applications:', error);
    return false;
  }
}
