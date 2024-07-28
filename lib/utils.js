import { getFirestore, collection, getDocs, query, where } from 'firebase/firestore';
import firebase_app from './firebaseConfig';
const db = getFirestore(firebase_app);


  
  export async function getProductRecommendations() {
    const products = await fetch(`https://jsonplaceholder.typicode.com/photos?limit=10`)
    const data = await products.json();
    return data.slice(0, 10);
  }
  export async function getProductDetails({id}) {
    const productDetails = await fetch(`https://jsonplaceholder.typicode.com/photos/${id}`)
    const data = await productDetails.json();
    return data;
  }



export const getAllFrames = async () => {
  try {
    const framesCollection = collection(db, 'frames');
    const querySnapshot = await getDocs(framesCollection);

    let usersData =[]
    querySnapshot.forEach((doc) => {
      usersData.push(doc.data());
      console.log('usersData', usersData)
      return usersData;
    });
  } catch (error) {
    console.error('Error getting users by access token:', error);
    return false;
  }
};