import { getWorkspaceAccessToken } from './googleAuth';

export interface GoogleDocFile {
  id: string;
  name: string;
  mimeType: string;
  webViewLink?: string;
  modifiedTime?: string;
}

// Ensure we have a valid access token
function getRequiredToken(): string {
  const token = getWorkspaceAccessToken();
  if (!token) {
    throw new Error('Google Workspace access token is not available. Please sign in with Google first.');
  }
  return token;
}

/**
 * Lists the Google Docs files in the user's Google Drive.
 */
export async function listGoogleDocs(pageSize: number = 10): Promise<GoogleDocFile[]> {
  const token = getRequiredToken();
  const query = encodeURIComponent("mimeType = 'application/vnd.google-apps.document' and trashed = false");
  const url = `https://www.googleapis.com/drive/v3/files?q=${query}&fields=files(id,name,mimeType,webViewLink,modifiedTime)&pageSize=${pageSize}&orderBy=modifiedTime desc`;

  const response = await fetch(url, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`Failed to list Google Docs: ${response.status} ${response.statusText} - ${errText}`);
  }

  const data = await response.json();
  return data.files || [];
}

/**
 * Creates a new blank Google Document and returns its details.
 */
export async function createGoogleDoc(title: string): Promise<any> {
  const token = getRequiredToken();
  const url = 'https://docs.googleapis.com/v1/documents';

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      title,
    }),
  });

  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`Failed to create Google Doc: ${response.status} ${response.statusText} - ${errText}`);
  }

  return await response.json();
}

/**
 * Appends or inserts text into a Google Document using batchUpdate.
 */
export async function insertTextIntoDoc(documentId: string, text: string): Promise<any> {
  const token = getRequiredToken();
  const url = `https://docs.googleapis.com/v1/documents/${documentId}:batchUpdate`;

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      requests: [
        {
          insertText: {
            location: {
              index: 1, // Start of the document (index 0 is reserved or might error, index 1 is standard for empty documents)
            },
            text,
          },
        },
      ],
    }),
  });

  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`Failed to insert text in Google Doc: ${response.status} ${response.statusText} - ${errText}`);
  }

  return await response.json();
}

/**
 * Creates a Google Document with specific content in one flow.
 */
export async function createDocWithContent(title: string, content: string): Promise<GoogleDocFile> {
  // 1. Create the blank document
  const doc = await createGoogleDoc(title);
  const documentId = doc.documentId;

  // 2. Insert content
  await insertTextIntoDoc(documentId, content);

  // 3. Return formatted file details
  return {
    id: documentId,
    name: doc.title,
    mimeType: 'application/vnd.google-apps.document',
    webViewLink: `https://docs.google.com/document/d/${documentId}/edit`,
  };
}
