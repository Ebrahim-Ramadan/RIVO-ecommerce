'use client'
import { getFirestore, collection, addDoc , doc, getDocs,  getDoc } from 'firebase/firestore';
import firebase_app from './firebaseConfig';



const db = getFirestore(firebase_app);

export async function addOrder(orderItems, shippingInfo) {
  try {
    if (!Array.isArray(orderItems)) {
      throw new Error('orderItems must be an array');
    }

    if (typeof shippingInfo !== 'object' || shippingInfo === null) {
      throw new Error('shippingInfo must be an object');
    }

    const orderData = {
      items: orderItems,
      shipping_data: shippingInfo,
      createdAt: new Date(),
      status: "Received",
      // Add any other top-level order information here
    };

    const ordersCollection = collection(db, 'orders');
    const docRef = await addDoc(ordersCollection, orderData);
    console.log("Document written with ID: ", docRef.id);
    return docRef.id;
  } catch (error) {
    console.error("Error adding document: ", error);
    return false;
  }
}



export async function checkIfOrderExists(orderId) {
  try {
    // Step 1: Check if the order ID exists as a document ID
    const orderRef = doc(db, 'orders', orderId);
    const docSnap = await getDoc(orderRef);

    if (docSnap.exists()) {
      console.log(`Order ID ${orderId} exists as a document`);
      return { id: docSnap.id, ...docSnap.data() }; // The document exists
    }

    // Step 2: If the document does not exist, check if the order ID exists as a key in any document
    const ordersRef = collection(db, 'orders');
    const querySnapshot = await getDocs(ordersRef);

    for (const doc of querySnapshot.docs) {
      const data = doc.data();
      if (orderId in data) {
        console.log(`Order ID ${orderId} exists as a key in document`);
        return { id: doc.id, ...data }; // The orderId exists as a key in this document
      }
    }

    return false; // The orderId was not found as a document ID or a key in any document
  } catch (error) {
    console.error("Error checking if order ID exists: ", error);
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
  
  // Check if the newId already exists in the array
  if (!ids.includes(newId)) {
    ids.push(newId);
    saveEncryptedIds(ids);
  }
}

// Function to delete an ID from the stored array
export function deleteId(idToDelete) {
  let ids = getDecryptedIds();
  if (!ids) return; // If there are no ids, do nothing

  // Filter out the ID to delete
  ids = ids.filter(id => id !== idToDelete);

  // Save the updated array back to localStorage
  saveEncryptedIds(ids);
}



export const Shipping_costs = [
  {'Cairo':'50'},
  {'Giza':'50'},
  {'Qaluibiya':'50'},
  {'Gharbiya':'50'},
  {'Minufia':'50'},
  {'Dakahilia':'50'},
  {'Ismailia':'50'},
  {'Alexandria':'55'},
  {'Behira':'55'},
  {'Damietta':'55'},
  {'Kafr-ash-Shaykh':'55'},
  {'Elseweais':'55'},
  {'Bort Said':'55'},
  {'Fayoum':'55'},
  {'Beni Suef':'55'},
  {'Sinia North':'55'},
  {'Al Minia':'70'},
  {'Sinia South':'70'},
  {'Matrouh':'80'},
  {'Asyuit':'80'},
  {'Sohag':'80'},
  {'Red Sea':'80'},
  {'Qena':'90'},
  {'Aswan':'90'},
  {'Luxur':'90'},
  {'New Valley':'90'},
]



export const saveAddressToLocalStorage = (formData, append, fetch) => {
  // Create an address object from the form data
  const addressData = {
    email: formData?.email,
    fullname: formData?.fullname,
    phoneNumber: formData?.phoneNumber,
    governorate: formData?.governorate,
    city: formData?.city,
    address: formData?.address,
    specialMessage: formData?.specialMessage
  };

  // Convert the address object to a JSON string
  if(append){
    const addressJson = JSON.stringify(addressData);
      // Save the JSON string to localStorage
  localStorage.setItem('userAddress', addressJson);
  return true;
  }
if(fetch){
  return JSON.parse(localStorage.getItem('userAddress'));
}

};