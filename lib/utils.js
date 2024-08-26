import { getFirestore, collection, getDocs, getDoc, doc , query,where, limit, deleteDoc, updateDoc, setDoc, deleteField, orderBy, startAt, endAt} from 'firebase/firestore';
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
      
      // Ensure arrays are properly formatted
      if (data.color && typeof data.color === 'string') data.color = data.color.split(',').map(item => item.trim());
      if (data.type && typeof data.type === 'string') data.type = data.type.split(',').map(item => item.trim());
      if (data.price && typeof data.price === 'string') {
        data.price = data.price.split(',').map(item => item.trim());
      } else if (typeof data.price === 'number') {
        data.price = [data.price.toString()];
      }

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
    const framesQuery = query(framesCollection, limit(30));
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

      // Ensure arrays are properly formatted
      if (data.color && typeof data.color === 'string') data.color = data.color.split(',').map(item => item.trim());
      if (data.type && typeof data.type === 'string') data.type = data.type.split(',').map(item => item.trim());
      if (data.price && typeof data.price === 'string') {
        data.price = data.price.split(',').map(item => item.trim());
      } else if (typeof data.price === 'number') {
        data.price = [data.price.toString()];
      }

      usersData.push({ id: doc.id, ...data });
    });
    return usersData;
  } catch (error) {
    console.error('Error getting users by access token:', error);
    return false;
  }
};

function generatePrefixes(str) {
  const prefixes = [];
  for (let i = 1; i <= str.length; i++) {
    prefixes.push(str.substring(0, i));
  }
  return prefixes;
}

export const searchFrames = async (keyword) => {
  try {
    const lowercaseKeyword = keyword.trim();

    // Create Firestore query
    const framesRef = collection(db, "frames");
    const q = query(
      framesRef,
      where('keywords', 'array-contains', lowercaseKeyword)
    );

    // Fetch documents
    const querySnapshot = await getDocs(q);
    console.log("Fetched documents:", querySnapshot.docs.map(doc => doc.data()));
    const matchingProducts = [];

    querySnapshot.forEach((doc) => {
      let data = doc.data();
      data.id = doc.id;

      // Ensure arrays are properly formatted
      if (data.color && typeof data.color === 'string') {
        data.color = data.color.split(',').map(item => item.trim());
      }

      if (data.type && typeof data.type === 'string') {
        data.type = data.type.split(',').map(item => item.trim());
      }

      if (data.price && typeof data.price === 'string') {
        data.price = data.price.split(',').map(item => item.trim());
      } else if (typeof data.price === 'number') {
        data.price = [data.price.toString()];
      }

      matchingProducts.push(data);
    });

    return matchingProducts;
  } catch (error) {
    console.error('Error searching products:', error);
    return [];
  }
};

  export const getFramesByCategory = async (categoryParam) => {
    const lowercaseCategoryParam = categoryParam.charAt(0).toUpperCase() + categoryParam.slice(1).toLowerCase().trim();
  console.log('lowercaseCategoryParam',  lowercaseCategoryParam);
    try {
      // Fetch frames where the categories array contains the specified category
      const framesCollection = collection(db, 'frames');
      const framesQuery = query(framesCollection, where('categories', 'array-contains',lowercaseCategoryParam)); // Adjust limit as needed
      const querySnapshot = await getDocs(framesQuery);
  
      let filteredFrames = [];
  
      querySnapshot.forEach((doc) => {
        let data = doc.data();
  
        // Ensure arrays are properly formatted
        if (data.color && typeof data.color === 'string') {
          data.color = data.color.split(',').map(item => item.trim());
        }
  
        if (data.type && typeof data.type === 'string') {
          data.type = data.type.split(',').map(item => item.trim());
        }
  
        if (data.price && typeof data.price === 'string') {
          data.price = data.price.split(',').map(item => item.trim());
        } else if (typeof data.price === 'number') {
          data.price = [data.price.toString()];
        }
  
        filteredFrames.push({ id: doc.id, ...data });
      });
  
      return filteredFrames;
    } catch (error) {
      console.error('Error getting frames by category:', error);
      return [];
    }
  };

  export const updateDocumentsWithVinyls = async () => {
    try {
      const collectionRef = collection(db, 'frames');
      const querySnapshot = await getDocs(collectionRef);
      
      for (const docSnapshot of querySnapshot.docs) {
        const documentData = docSnapshot.data();
        
        // Check if the document has a 'keywords' field and it's a comma-separated string
        if (documentData.keywords ) {
          
          const docRef = doc(db, 'frames', docSnapshot.id);
  
          // Generate prefixes for each keyword and combine them into a single array
          const prefixesArray = documentData.keywords.flatMap(keyword => generatePrefixes(keyword));
          
          const updateData = {
            keywords: prefixesArray // Update 'keywords' field with the array of prefixes
          };
  
          await updateDoc(docRef, updateData);
          
          console.log(`Document ${docSnapshot.id} updated successfully.`);
         
        }
      }
    } catch (error) {
      console.error('Error updating documents:', error);
    }
  };