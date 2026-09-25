import { db } from './firebase';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { handleFirestoreError, OperationType } from './firestoreErrorHandler';

export async function getApplication(uid: string): Promise<any | null> {
  if (!uid) return null;
  try {
    console.log(`[applicationService] Fetching application for UID: ${uid}`);
    const docRef = doc(db, 'applications', uid);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() };
    }
    return null;
  } catch (error) {
    handleFirestoreError(error, OperationType.GET, `applications/${uid}`);
    return null;
  }
}

export async function saveApplication(uid: string, data: any): Promise<any> {
  if (!uid) throw new Error('User UID is required to save application');
  try {
    console.log(`[applicationService] Saving application for UID: ${uid}`);
    const docRef = doc(db, 'applications', uid);
    const docSnap = await getDoc(docRef);
    const exists = docSnap.exists();

    const payload = {
      ...data,
      id: uid,
      studentUid: uid,
      updatedAt: serverTimestamp(),
    };

    if (!exists) {
      payload.createdAt = serverTimestamp();
    } else {
      // Preserve original createdAt if not provided in data
      const existingData = docSnap.data();
      if (existingData.createdAt && !payload.createdAt) {
        payload.createdAt = existingData.createdAt;
      }
    }

    await setDoc(docRef, payload, { merge: true });
    return { success: true, id: uid };
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, `applications/${uid}`);
    throw error;
  }
}
