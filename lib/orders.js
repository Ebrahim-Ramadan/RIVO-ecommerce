'use client'
import { getFirestore, collection, addDoc , doc, updateDoc, deleteDoc, where, getDocs, query } from 'firebase/firestore';
import firebase_app from './firebaseConfig';



const db = getFirestore(firebase_app);

export async function addOrder(orderItems) {
  try {
    if (!Array.isArray(orderItems)) {
      throw new Error('orderItems must be an array');
    }

    const orderData = {
      items: orderItems,
      createdAt: new Date(),
      status: "Recieved",
      // Add any other top-level order information here
    };

    const ordersCollection = collection(db, 'orders');
    const docRef = await addDoc(ordersCollection, orderData);
    console.log("Document written with ID: ", docRef.id);
    return docRef.id;
  } catch (error) {
    console.error("Error adding document: ", error);
    // throw error;
    return false
  }
}



export async function appendOrderDataToFirestore(docId, orderData) {
  try {
    if (typeof docId !== 'string' || !docId) {
      throw new Error('Invalid document ID');
    }

    if (typeof orderData !== 'object' || orderData === null) {
      throw new Error('orderData must be a non-null object');
    }

    const orderDocRef = doc(db, 'orders', docId);
    
    // Create a new object with the order data and use obj_id as the key
    const newData = {
      [orderData.obj_id]: {
        shipping_data: orderData.shipping_data,
        source_data: orderData.source_data
      }
    };

    await updateDoc(orderDocRef, newData);

    console.log(`Order data appended to document ${docId} with key ${orderData.obj_id}`);
    return true;
  } catch (error) {
    console.error("Error appending order data: ", error);
    // Attempt to delete the document if an error occurs
    try {
      const orderDocRef = doc(db, 'orders', docId);
      await deleteDoc(orderDocRef);
      console.log(`Document ${docId} deleted due to error.`);
    } catch (deleteError) {
      console.error("Error deleting document: ", deleteError);
    }
    return false

  }
}


export async function checkIfOrderExists(orderId) {
  try {
    const ordersRef = collection(db, 'orders');
    const querySnapshot = await getDocs(ordersRef);
    
    for (const doc of querySnapshot.docs) {
      const data = doc.data();
      if (orderId in data) {
        console.log(`Order ID ${orderId} exists as a key in document`);
        return doc.data(); // The orderId exists as a key in this document
      }
    }
    
    return false; // The orderId was not found as a key in any document
  } catch (error) {
    console.error("Error checking if order ID exists as key: ", error);
    return false;
  }
}


// Function to encrypt data
function encrypt(data) {
  return btoa(JSON.stringify(data));
}

// Function to decrypt data
function decrypt(encryptedData) {
  return JSON.parse(atob(encryptedData));
}

// Function to save encrypted array of IDs to localStorage
function saveEncryptedIds(ids) {
  const encryptedIds = encrypt(ids);
  localStorage.setItem('encryptedOrderIds', encryptedIds);
}

export function getDecryptedIds() {
  const encryptedIds = localStorage.getItem('encryptedOrderIds');
  if (!encryptedIds) return null;
  
  const decryptedIds = decrypt(encryptedIds);
  
  // Remove duplicates, keeping the last occurrence
  const uniqueIds = Array.from(
    decryptedIds.reduce((map, id) => map.set(id, id), new Map()).values()
  );
  
  return uniqueIds;
}

// Function to add a new ID to the stored array
export function addId(newId) {
  let ids = getDecryptedIds() || [];
  ids.push(newId);
  saveEncryptedIds(ids);
}
