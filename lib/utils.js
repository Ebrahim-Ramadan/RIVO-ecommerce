import { getFirestore, collection, getDocs, getDoc, doc ,where, query} from 'firebase/firestore';
import firebase_app from './firebaseConfig';
const db = getFirestore(firebase_app);

export const createUrl = (pathname, params) => {
  const paramsString = params.toString();
  const queryString = `${paramsString.length ? '?' : ''}${paramsString}`;

  return `${pathname}${queryString}`;
};
  
  export async function getProductRecommendations() {
    const products = await fetch(`https://jsonplaceholder.typicode.com/photos?limit=10`)
    const data = await products.json();
    return data.slice(0, 10);
  }

  export async function getProductDetails(docId) {
    try {
      const docRef = doc(db, "frames", docId);
      const docSnap = await getDoc(docRef);
  
      if (docSnap.exists()) {
        const data = docSnap.data();
        
        // Convert colors, categories, and sizes to arrays
        if (data.colors) data.colors = data.colors.split(',').map(item => item.trim());
        if (data.categories) data.categories = data.categories.split(',').map(item => item.trim());
        if (data.sizes) data.sizes = data.sizes.split(',').map(item => item.trim());
        if (data.images) data.images = data.images.split(',').map(item => item.trim());
        if (data.keywords) data.keywords = data.keywords.split(',').map(item => item.trim());
  
        return data;
      } else {
        return false;
      }
    } catch (error) {
      console.error('Error fetching product details:', error);
      return false;
    }
  }



export const getAllFrames = async () => {
  try {
    const framesCollection = collection(db, 'frames');
    const querySnapshot = await getDocs(framesCollection);

    let usersData =[]
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      // Convert colors, categories, and sizes to arrays
      if (data.colors) data.colors = data.colors.split(',').map(item => item.trim());
      if (data.categories) data.categories = data.categories.split(',').map(item => item.trim());
      if (data.sizes) data.sizes = data.sizes.split(',').map(item => item.trim());
      if (data.images) data.images = data.images.split(',').map(item => item.trim());
      if (data.keywords) data.keywords = data.keywords.split(',').map(item => item.trim());

      usersData.push({ id: doc.id, ...data });
    });
    return usersData;

  } catch (error) {
    console.error('Error getting users by access token:', error);
    return false;
  }
};

export const convertToArray = (filesString, firstElement) => {
  const arrayElements = filesString.split(',').map(file => file.trim()).filter(file => file);
  if(firstElement === true){
    return arrayElements[0];
  }
  return arrayElements;
};


export const searchFrames = async (keyword) => {
  try {
    const lowercaseKeyword = keyword.toLowerCase().trim();
    const framesRef = collection(db, "frames");
    const querySnapshot = await getDocs(framesRef);
    const matchingProducts = [];

    querySnapshot.forEach((doc) => {
      const data = doc.data();
      data.id = doc.id;
      if (data.keywords) {
        const keywordsArray = data.keywords.toLowerCase().split(',').map(item => item.trim());
        if (keywordsArray.some(k => k.includes(lowercaseKeyword))) {
          if (data.colors) data.colors = data.colors.split(',').map(item => item.trim());
          if (data.categories) data.categories = data.categories.split(',').map(item => item.trim());
          if (data.sizes) data.sizes = data.sizes.split(',').map(item => item.trim());
          if (data.images) data.images = data.images.split(',').map(item => item.trim());
          if (data.keywords) data.keywords = data.keywords.split(',').map(item => item.trim());

          matchingProducts.push(data);
        }
      }
    });

    return matchingProducts;
  } catch (error) {
    console.error('Error searching products:', error);
    return [];
  }
};