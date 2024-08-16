import { getFirestore, collection, getDocs, getDoc, doc , query,where, limit, deleteDoc} from 'firebase/firestore';
import firebase_app from './firebaseConfig';
const db = getFirestore(firebase_app);

export const createUrl = (pathname, params) => {
  const paramsString = params.toString();
  const queryString = `${paramsString.length ? '?' : ''}${paramsString}`;

  return `${pathname}${queryString}`;
};
  
export const copyToClipboard = (text) => {
  if (navigator.clipboard) {
    navigator.clipboard.writeText(text)
  } else {
    // Fallback method for older browsers
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.style.position = 'fixed'; // Prevent scrolling to bottom of page in MS Edge.
    document.body.appendChild(textarea);
    textarea.focus();
    textarea.select();
    try {
      document.execCommand('copy');
      console.log('Text copied to clipboard');
    } catch (err) {
      console.error('Could not copy text: ', err);
    }
    document.body.removeChild(textarea);
  }
};

  export async function getProductDetails(docId) {
    try {
      const docRef = doc(db, "frames", docId);
      const docSnap = await getDoc(docRef);
  
      if (docSnap.exists()) {
        let data = docSnap.data();
        data.id = docSnap.id;
         // Convert keys to lowercase and trim spaces
         data = Object.keys(data).reduce((acc, key) => {
          const normalizedKey = key.trim().toLowerCase();
          acc[normalizedKey] = data[key];
          return acc;
        }, {});
        // Convert colors, categories, and sizes to arrays
        if (data.color) data.color = data.color.split(',').map(item => item.trim());
        if (data.categories) data.categories = data.categories.split(',').map(item => item.trim());
        if (data.sizes) {
          data.sizes = data.sizes.split(',').map(item => {
            return item.trim().replace(/[×�]/g, 'x');
          });
        }
        if (data.images) data.images = data.images.split(',').map(item => item.trim());
        if (data.keywords) data.keywords = data.keywords.split(',').map(item => item.trim());
        if (data.type) data.type = data.type.split(',').map(item => item.trim());
        if (data.price) data.price = data.price.split(',').map(item => item.trim());
  
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
      // Create a query with a limit of 100 documents
      const framesQuery = query(framesCollection, limit(25));
      const querySnapshot = await getDocs(framesQuery);
  
  
      let usersData = [];
      querySnapshot.forEach((doc) => {
        let data = doc.data();
        // Convert keys to lowercase and trim spaces
        data = Object.keys(data).reduce((acc, key) => {
          const normalizedKey = key.trim().toLowerCase();
          acc[normalizedKey] = data[key];
          return acc;
        }, {});
  
        // Convert colors, categories, sizes, images, and keywords to arrays
        if (data.color) data.color = data.color.split(',').map(item => item.trim());
        if (data.categories) data.categories = data.categories.split(',').map(item => item.trim());
        if (data.sizes) {
          data.sizes = data.sizes.split(',').map(item => {
            return item.trim().replace(/[×�]/g, 'x');
          });
        }
        if (data.images) data.images = data.images.split(',').map(item => item.trim());
        if (data.keywords) data.keywords = data.keywords.split(',').map(item => item.trim());
        if (data.type) data.type = data.type.split(',').map(item => item.trim());
        if (data.price) data.price = data.price.split(',').map(item => item.trim());
  
        usersData.push({ id: doc.id, ...data });
      });
      console.log('usersData', usersData);
      return usersData;
    } catch (error) {
      console.error('Error getting users by access token:', error);
      return false;
    }
  };
  


  export const searchFrames = async (keyword, related, relatedID) => {
    try {
      const lowercaseKeyword = keyword.toLowerCase().trim();
      const framesRef = collection(db, "frames");
      const framesQuery = query(framesRef, limit(50));

      const querySnapshot = await getDocs(framesQuery);
      const matchingProducts = [];
  
      querySnapshot.forEach((doc) => {
        let data = doc.data();
        data.id = doc.id;
        data = Object.keys(data).reduce((acc, key) => {
          const normalizedKey = key.trim().toLowerCase();
          acc[normalizedKey] = data[key];
          return acc;
        }, {});
  
        if (data.keywords) data.keywords = data.keywords.split(',').map(item => item.trim());
  
        if (data.keywords) {
          // Ensure keywords are processed as an array of lowercase strings
          const keywordsArray = data.keywords.map(item => item.toLowerCase().trim());
          // Check if the keyword is included in any of the keywords
          if (keywordsArray.some(k => k.includes(lowercaseKeyword))) {
            // Convert other properties to arrays if necessary
            if (data.color) data.color = data.color.split(',').map(item => item.trim());
            if (data.categories) data.categories = data.categories.split(',').map(item => item.trim());
            if (data.sizes) {
              data.sizes = data.sizes.split(',').map(item => {
                return item.trim().replace(/[×�]/g, 'x');
              });
            }
            if (data.images) data.images = data.images.split(',').map(item => item.trim());
            if (data.type) data.type = data.type.split(',').map(item => item.trim());
            if (data.price) data.price = data.price.split(',').map(item => item.trim());
  
            if (!related || (related && data.id !== relatedID)) {
              matchingProducts.push(data);
            }
          }
        }
      });
  
      return matchingProducts;
    } catch (error) {
      console.error('Error searching products:', error);
      return [];
    }
  };


