// Native Browser IndexedDB Storage for Commission Inquiries
// Stores raw binary File/Blob objects directly without Base64 conversion!

const DB_NAME = 'TLArts_DB';
const DB_VERSION = 1;
const STORE_NAME = 'commission_inquiries';

function openDatabase() {
  return new Promise((resolve, reject) => {
    if (!window.indexedDB) {
      reject(new Error('IndexedDB is not supported by your browser.'));
      return;
    }

    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        const store = db.createObjectStore(STORE_NAME, { keyPath: 'id' });
        store.createIndex('date', 'date', { unique: false });
        store.createIndex('status', 'status', { unique: false });
      }
    };

    request.onsuccess = (event) => {
      resolve(event.target.result);
    };

    request.onerror = (event) => {
      reject(event.target.error);
    };
  });
}

/**
 * Save a new commission inquiry into IndexedDB
 * @param {Object} data - { id, name, contact, sketchType, size, message, imageFile, fileName, date, status }
 */
export async function saveInquiry(data) {
  const db = await openDatabase();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([STORE_NAME], 'readwrite');
    const store = transaction.objectStore(STORE_NAME);

    const inquiryRecord = {
      id: data.id || `inquiry_${Date.now()}`,
      name: data.name.trim(),
      contact: data.contact.trim(),
      sketchType: data.sketchType || 'Single Realistic Portrait',
      size: data.size || 'A3 (29.7 × 42.0 cm)',
      message: data.message ? data.message.trim() : '',
      // Raw File/Blob directly saved! No Base64!
      imageFile: data.imageFile || null,
      fileName: data.fileName || (data.imageFile ? data.imageFile.name : ''),
      fileType: data.fileType || (data.imageFile ? data.imageFile.type : ''),
      date: data.date || new Date().toISOString(),
      status: data.status || 'New' // 'New' | 'In Progress' | 'Completed'
    };

    const request = store.put(inquiryRecord);

    request.onsuccess = () => {
      resolve(inquiryRecord);
    };

    request.onerror = (event) => {
      reject(event.target.error);
    };
  });
}

/**
 * Retrieve all commission inquiries from IndexedDB, sorted newest first
 */
export async function getInquiries() {
  const db = await openDatabase();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([STORE_NAME], 'readonly');
    const store = transaction.objectStore(STORE_NAME);
    const request = store.getAll();

    request.onsuccess = () => {
      const results = request.result || [];
      // Sort newest to oldest
      results.sort((a, b) => new Date(b.date) - new Date(a.date));
      resolve(results);
    };

    request.onerror = (event) => {
      reject(event.target.error);
    };
  });
}

/**
 * Update the status of an existing inquiry
 * @param {string} id 
 * @param {string} status - 'New' | 'In Progress' | 'Completed'
 */
export async function updateInquiryStatus(id, status) {
  const db = await openDatabase();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([STORE_NAME], 'readwrite');
    const store = transaction.objectStore(STORE_NAME);
    const getRequest = store.get(id);

    getRequest.onsuccess = () => {
      const record = getRequest.result;
      if (!record) {
        reject(new Error(`Inquiry with ID ${id} not found.`));
        return;
      }

      record.status = status;
      const updateRequest = store.put(record);

      updateRequest.onsuccess = () => resolve(record);
      updateRequest.onerror = (e) => reject(e.target.error);
    };

    getRequest.onerror = (e) => reject(e.target.error);
  });
}

/**
 * Delete a commission inquiry from IndexedDB
 * @param {string} id 
 */
export async function deleteInquiry(id) {
  const db = await openDatabase();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([STORE_NAME], 'readwrite');
    const store = transaction.objectStore(STORE_NAME);
    const request = store.delete(id);

    request.onsuccess = () => resolve(true);
    request.onerror = (e) => reject(e.target.error);
  });
}
