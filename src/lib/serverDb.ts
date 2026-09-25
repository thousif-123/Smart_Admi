import fs from 'fs';
import path from 'path';
import { adminDb, isFirebaseAdminInitialized, sendEmailNotification } from './notificationService';

const LOCAL_DB_PATH = path.join(process.cwd(), 'local_db.json');

export interface LocalDb {
  users?: any[];
  applications: any[];
  notifications: any[];
  ml_training_data: any[];
  ml_metadata: any;
}

const DEFAULT_DB: LocalDb = {
  users: [],
  applications: [],
  notifications: [],
  ml_training_data: [],
  ml_metadata: {}
};

function readLocalDb(): LocalDb {
  try {
    if (fs.existsSync(LOCAL_DB_PATH)) {
      const data = fs.readFileSync(LOCAL_DB_PATH, 'utf8');
      return JSON.parse(data);
    }
  } catch (err) {
    console.error('[SERVER DB] Error reading local_db.json:', err);
  }
  return JSON.parse(JSON.stringify(DEFAULT_DB));
}

function writeLocalDb(db: LocalDb) {
  try {
    fs.writeFileSync(LOCAL_DB_PATH, JSON.stringify(db, null, 2), 'utf8');
  } catch (err) {
    console.error('[SERVER DB] Error writing to local_db.json:', err);
  }
}

// Convert Firestore Timestamp / ISO/ Dates to seconds representation for consistent client-side sorting
function convertDates(obj: any): any {
  if (!obj) return obj;
  const newObj = { ...obj };
  
  if (newObj.createdAt && typeof newObj.createdAt === 'object' && 'seconds' in newObj.createdAt) {
    // Already firestore timestamp representation
  } else if (newObj.createdAt) {
    try {
      const d = new Date(newObj.createdAt);
      if (!isNaN(d.getTime())) {
        newObj.createdAt = { seconds: Math.floor(d.getTime() / 1000), nanoseconds: 0 };
      }
    } catch (_) {}
  }
  
  if (newObj.sentAt && typeof newObj.sentAt === 'object' && 'seconds' in newObj.sentAt) {
    // Already firestore timestamp
  } else if (newObj.sentAt) {
    try {
      const d = new Date(newObj.sentAt);
      if (!isNaN(d.getTime())) {
        newObj.sentAt = { seconds: Math.floor(d.getTime() / 1000), nanoseconds: 0 };
      }
    } catch (_) {}
  }

  return newObj;
}

// ==========================================
// Applications Collection Methods
// ==========================================

export async function getApplications(): Promise<any[]> {
  if (isFirebaseAdminInitialized && adminDb) {
    try {
      console.log('[SERVER DB] Fetching applications from Firestore...');
      const snapshot = await adminDb.collection('applications').get();
      return snapshot.docs.map(doc => {
        const data = doc.data();
        return convertDates({ id: doc.id, ...data });
      });
    } catch (err) {
      console.error('[SERVER DB] Firestore applications read failed, using local DB fallback:', err);
    }
  }
  
  console.log('[SERVER DB] Reading applications from local JSON DB...');
  const db = readLocalDb();
  return db.applications.map(app => convertDates(app));
}

export async function saveApplication(id: string, payload: any): Promise<any> {
  const cleanPayload = { ...payload, id };
  if (!cleanPayload.createdAt) {
    cleanPayload.createdAt = new Date().toISOString();
  }

  // Pre-fetch old application for mock change-detection / email triggers
  const localDb = readLocalDb();
  const oldApp = localDb.applications.find(a => a.id === id);

  if (isFirebaseAdminInitialized && adminDb) {
    try {
      console.log(`[SERVER DB] Saving application ${id} to Firestore...`);
      // Convert server timestamp representation
      const firestorePayload = { ...cleanPayload };
      delete firestorePayload.id;
      // Convert text strings if it has an object serverTimestamp
      if (firestorePayload.createdAt && typeof firestorePayload.createdAt === 'object') {
        firestorePayload.createdAt = new Date(); // use current date for server side
      }
      
      await adminDb.collection('applications').doc(id).set(firestorePayload, { merge: true });
    } catch (err) {
      console.error(`[SERVER DB] Firestore write failed for app ${id}:`, err);
    }
  }

  console.log(`[SERVER DB] Saving application ${id} to local JSON DB to keep in sync...`);
  const db = readLocalDb();
  const index = db.applications.findIndex(app => app.id === id);
  if (index >= 0) {
    db.applications[index] = { ...db.applications[index], ...cleanPayload };
  } else {
    db.applications.push(cleanPayload);
  }
  writeLocalDb(db);

  // Fallback trigger email notification on status change if running in local DB mode or as fallback
  if (oldApp && oldApp.status !== cleanPayload.status) {
    console.log(`[SERVER DB] [STATUS TRIGGER] ${id}: ${oldApp.status} -> ${cleanPayload.status}`);
    const email = cleanPayload.email || cleanPayload.studentEmail;
    const name = cleanPayload.fullName || cleanPayload.studentName || 'Student';
    const course = cleanPayload.preferredCourse || cleanPayload.course || 'Selected Course';
    const feedback = cleanPayload.feedback || '';
    const collegePreferences = Array.isArray(cleanPayload.selectedCollegePreferences)
      ? cleanPayload.selectedCollegePreferences
      : String(cleanPayload.preferredColleges || '').split('\n').map((item: string) => item.trim()).filter(Boolean);

    if (email) {
      await sendEmailNotification(email, name, course, cleanPayload.status, feedback, collegePreferences);
      await saveNotification({
        studentUid: cleanPayload.studentUid,
        studentEmail: email,
        studentName: name,
        status: cleanPayload.status,
        course,
        subject: `SmartAdmi Admission Update - Application ${cleanPayload.status}`,
        body: cleanPayload.status === 'Approved'
          ? `Dear ${name}, your application is approved. Please contact or visit your selected college(s) with original documents to complete admission.${collegePreferences.length ? ` Preferences: ${collegePreferences.join(', ')}.` : ''}`
          : `Dear ${name}, your application status for ${course} has been updated to ${cleanPayload.status}.${feedback ? ' Board Feedback: ' + feedback : ''}`,
        sentAt: new Date().toISOString(),
        type: 'email'
      });
    }
  }

  return cleanPayload;
}

export async function deleteApplication(id: string): Promise<boolean> {
  let deletedFromFirestore = false;
  if (isFirebaseAdminInitialized && adminDb) {
    try {
      console.log(`[SERVER DB] Deleting application ${id} from Firestore...`);
      await adminDb.collection('applications').doc(id).delete();
      deletedFromFirestore = true;
    } catch (err) {
      console.error(`[SERVER DB] Firestore delete failed for app ${id}:`, err);
    }
  }

  console.log(`[SERVER DB] Deleting application ${id} from local JSON DB to keep in sync...`);
  const db = readLocalDb();
  const index = db.applications.findIndex(app => app.id === id);
  let deletedFromLocal = false;
  if (index >= 0) {
    db.applications.splice(index, 1);
    writeLocalDb(db);
    deletedFromLocal = true;
  }
  return deletedFromFirestore || deletedFromLocal;
}

// ==========================================
// Notifications Collection Methods
// ==========================================

export async function getNotifications(): Promise<any[]> {
  if (isFirebaseAdminInitialized && adminDb) {
    try {
      console.log('[SERVER DB] Fetching notifications from Firestore...');
      const snapshot = await adminDb.collection('notifications').get();
      return snapshot.docs.map(doc => {
        return convertDates({ id: doc.id, ...doc.data() });
      });
    } catch (err) {
      console.error('[SERVER DB] Firestore notifications read failed, fallback to local DB:', err);
    }
  }

  console.log('[SERVER DB] Reading notifications from local JSON DB...');
  const db = readLocalDb();
  return db.notifications.map(n => convertDates(n));
}

export async function saveNotification(payload: any): Promise<any> {
  const id = `NT-${Date.now()}-${Math.floor(Math.random() * 10000)}`;
  const cleanPayload = { ...payload, id };
  if (!cleanPayload.sentAt) {
    cleanPayload.sentAt = new Date().toISOString();
  }

  if (isFirebaseAdminInitialized && adminDb) {
    try {
      console.log('[SERVER DB] Saving notification to Firestore...');
      const firestorePayload = { ...cleanPayload };
      delete firestorePayload.id;
      if (firestorePayload.sentAt && typeof firestorePayload.sentAt === 'object') {
        firestorePayload.sentAt = new Date();
      }
      await adminDb.collection('notifications').doc(id).set(firestorePayload);
    } catch (err) {
      console.error('[SERVER DB] Firestore notification write failed:', err);
    }
  }

  console.log('[SERVER DB] Saving notification to local JSON DB to keep in sync...');
  const db = readLocalDb();
  db.notifications.push(cleanPayload);
  writeLocalDb(db);

  return cleanPayload;
}

// ==========================================
// ML Metadata Collection Methods (latest_model)
// ==========================================

export async function getMlMetadata(): Promise<any> {
  if (isFirebaseAdminInitialized && adminDb) {
    try {
      console.log('[SERVER DB] Fetching ML latest_model metadata from Firestore...');
      const docSnap = await adminDb.collection('ml_metadata').doc('latest_model').get();
      if (docSnap.exists) {
        return docSnap.data();
      }
    } catch (err) {
      console.error('[SERVER DB] Firestore ML metadata read failed, using local DB:', err);
    }
  }

  console.log('[SERVER DB] Reading ML latest_model metadata from local JSON DB...');
  const db = readLocalDb();
  return db.ml_metadata || {};
}

export async function saveMlMetadata(payload: any): Promise<any> {
  const cleanPayload = { ...payload, lastTrainedAt: new Date().toISOString() };
  if (isFirebaseAdminInitialized && adminDb) {
    try {
      console.log('[SERVER DB] Saving ML latest_model metadata to Firestore...');
      await adminDb.collection('ml_metadata').doc('latest_model').set(cleanPayload);
      return cleanPayload;
    } catch (err) {
      console.error('[SERVER DB] Firestore ML metadata write failed, using local DB:', err);
    }
  }

  console.log('[SERVER DB] Saving ML latest_model metadata to local JSON DB...');
  const db = readLocalDb();
  db.ml_metadata = cleanPayload;
  writeLocalDb(db);
  return cleanPayload;
}

// ==========================================
// ML Training Data Collection Methods
// ==========================================

export async function getMlTrainingData(): Promise<any[]> {
  if (isFirebaseAdminInitialized && adminDb) {
    try {
      console.log('[SERVER DB] Fetching ML training dataset from Firestore...');
      const snapshot = await adminDb.collection('ml_training_data').get();
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (err) {
      console.error('[SERVER DB] Firestore ML training data read failed, using local DB:', err);
    }
  }

  console.log('[SERVER DB] Reading ML training dataset from local JSON DB...');
  const db = readLocalDb();
  return db.ml_training_data || [];
}

export async function saveMlTrainingData(id: string, payload: any): Promise<any> {
  const cleanPayload = { ...payload, id };
  if (isFirebaseAdminInitialized && adminDb) {
    try {
      console.log(`[SERVER DB] Saving ML training record ${id} to Firestore...`);
      const firestorePayload = { ...cleanPayload };
      delete firestorePayload.id;
      await adminDb.collection('ml_training_data').doc(id).set(firestorePayload);
      return cleanPayload;
    } catch (err) {
      console.error(`[SERVER DB] Firestore ML training record write failed, using local DB:`, err);
    }
  }

  console.log(`[SERVER DB] Saving ML training record ${id} to local JSON DB...`);
  const db = readLocalDb();
  const index = db.ml_training_data.findIndex(t => t.id === id);
  if (index >= 0) {
    db.ml_training_data[index] = cleanPayload;
  } else {
    db.ml_training_data.push(cleanPayload);
  }
  writeLocalDb(db);
  return cleanPayload;
}

let hasSynced = false;

export async function syncLocalToFirestoreIfEmpty(): Promise<void> {
  if (hasSynced) return;
  if (!isFirebaseAdminInitialized || !adminDb) {
    console.log('[SERVER DB] Firestore Admin not initialized or accessible. Skipping automatic sync.');
    return;
  }

  try {
    console.log('[SERVER DB] Checking if Firestore database requires seeding from local_db.json...');
    const snapshot = await adminDb.collection('applications').limit(1).get();
    
    if (snapshot.empty) {
      console.log('[SERVER DB] Firestore "applications" collection is empty. Starting migration/seeding from local_db.json to make it permanent...');
      const db = readLocalDb();
      
      // 1. Sync applications
      if (db.applications && db.applications.length > 0) {
        console.log(`[SERVER DB] Seeding ${db.applications.length} applications to Firestore...`);
        for (const app of db.applications) {
          const id = app.id;
          const firestorePayload = { ...app };
          delete firestorePayload.id;
          
          if (firestorePayload.createdAt && typeof firestorePayload.createdAt === 'object') {
            firestorePayload.createdAt = new Date();
          } else if (firestorePayload.createdAt) {
            firestorePayload.createdAt = new Date(firestorePayload.createdAt);
          }
          
          await adminDb.collection('applications').doc(id).set(firestorePayload);
        }
        console.log('[SERVER DB] Applications successfully seeded to Firestore.');
      }
      
      // 2. Sync notifications
      if (db.notifications && db.notifications.length > 0) {
        console.log(`[SERVER DB] Seeding ${db.notifications.length} notifications to Firestore...`);
        for (const notif of db.notifications) {
          const id = notif.id;
          const firestorePayload = { ...notif };
          delete firestorePayload.id;
          
          if (firestorePayload.sentAt && typeof firestorePayload.sentAt === 'object') {
            firestorePayload.sentAt = new Date();
          } else if (firestorePayload.sentAt) {
            firestorePayload.sentAt = new Date(firestorePayload.sentAt);
          }
          
          await adminDb.collection('notifications').doc(id).set(firestorePayload);
        }
        console.log('[SERVER DB] Notifications successfully seeded to Firestore.');
      }

      // 3. Sync ML metadata
      if (db.ml_metadata && Object.keys(db.ml_metadata).length > 0) {
        console.log('[SERVER DB] Seeding ML metadata to Firestore...');
        await adminDb.collection('ml_metadata').doc('latest_model').set(db.ml_metadata);
        console.log('[SERVER DB] ML metadata successfully seeded to Firestore.');
      }

      // 4. Sync ML training data
      if (db.ml_training_data && db.ml_training_data.length > 0) {
        console.log(`[SERVER DB] Seeding ${db.ml_training_data.length} ML training records to Firestore...`);
        for (const record of db.ml_training_data) {
          const id = record.id;
          const firestorePayload = { ...record };
          delete firestorePayload.id;
          await adminDb.collection('ml_training_data').doc(id).set(firestorePayload);
        }
        console.log('[SERVER DB] ML training records successfully seeded to Firestore.');
      }
      
      console.log('[SERVER DB] Local database successfully synchronized with Firestore database!');
    } else {
      console.log('[SERVER DB] Firestore database has existing data. Seeding is not required.');
    }
    hasSynced = true;
  } catch (err) {
    console.error('[SERVER DB] Error during Firestore automatic seeding:', err);
  }
}

// ==========================================
// Users Collection Methods (Local Auth Fallback)
// ==========================================

export async function getUsers(): Promise<any[]> {
  if (isFirebaseAdminInitialized && adminDb) {
    try {
      console.log('[SERVER DB] Fetching users from Firestore...');
      const snapshot = await adminDb.collection('users').get();
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (err) {
      console.error('[SERVER DB] Firestore users read failed:', err);
    }
  }
  const db = readLocalDb();
  return db.users || [];
}

export async function saveUser(uid: string, payload: any): Promise<any> {
  const cleanPayload = { ...payload, uid };
  if (!cleanPayload.createdAt) {
    cleanPayload.createdAt = new Date().toISOString();
  }

  if (isFirebaseAdminInitialized && adminDb) {
    try {
      console.log(`[SERVER DB] Saving user ${uid} to Firestore...`);
      const firestorePayload = { ...cleanPayload };
      await adminDb.collection('users').doc(uid).set(firestorePayload, { merge: true });
    } catch (err) {
      console.error(`[SERVER DB] Firestore write failed for user ${uid}:`, err);
    }
  }

  const db = readLocalDb();
  if (!db.users) db.users = [];
  const index = db.users.findIndex((u: any) => u.uid === uid);
  if (index >= 0) {
    db.users[index] = { ...db.users[index], ...cleanPayload };
  } else {
    db.users.push(cleanPayload);
  }
  writeLocalDb(db);
  return cleanPayload;
}
