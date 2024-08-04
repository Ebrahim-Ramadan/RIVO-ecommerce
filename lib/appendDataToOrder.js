import { getFirestore, collection, addDoc , doc, updateDoc, deleteDoc, where, getDocs, query } from 'firebase/firestore';
import firebase_app from './firebaseConfig';

const db = getFirestore(firebase_app);

export async function appendOrderDataToFirestore(docId, orderData) {
    console.log('docId', docId);
    console.log('orderData', orderData);
    try {
      if (typeof docId !== 'string' || !docId) {
        throw new Error('Invalid document ID');
      }
  
      if (typeof orderData !== 'object' || orderData === null) {
        throw new Error('orderData must be a non-null object');
      }
  
      const orderDocRef = doc(db, 'orders', orderData.docID);
      
      // Create a new object with the order data and use obj_id as the key
      const newData = {
        [orderData.order_id]: {
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
  