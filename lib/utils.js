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
    let lowercaseCategoryParam;

    if (categoryParam.toLowerCase() === "cairokee frames" || categoryParam == "Ar Musics" || categoryParam == "posters set") {
      console.log('ass');
      lowercaseCategoryParam = categoryParam.trim(); // No capitalization
    } 
    else {
      lowercaseCategoryParam =
        categoryParam.charAt(0).toUpperCase() + categoryParam.slice(1).toLowerCase().trim();
    }
  console.log('lowercaseCategoryParam',  categoryParam, lowercaseCategoryParam);
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
  
      // Query documents where the 'categories' array contains 'Frame sets'
      const q = query(collectionRef, where('categories', 'array-contains', 'Decoration'));
      const querySnapshot = await getDocs(q);
  
      for (const docSnapshot of querySnapshot.docs) {
        const documentData = docSnapshot.data();
  
        // Check if the document has a 'keywords' field and if it's a string
        if (documentData.keywords && typeof documentData.keywords === 'string') {
          const docRef = doc(db, 'frames', docSnapshot.id);
  
          // Split the comma-separated keywords into an array
          const keywordsArray = documentData.keywords.split(',').map(keyword => keyword.trim());
  
          // Generate prefixes for each keyword and combine them into a single array
          const prefixesArray = keywordsArray.flatMap(keyword => generatePrefixes(keyword));
  
          const updateData = {
            keywords: prefixesArray // Update 'keywords' field with the array of prefixes
          };
  
          await updateDoc(docRef, updateData);
  
          console.log(`Document ${docSnapshot.id} updated successfully.`);
        } else {
          console.log(`Document ${docSnapshot.id} has no keywords or keywords is not a string.`);
        }
      }
    } catch (error) {
      console.error('Error updating documents:', error);
    }
  };
  
  



export async function updateOrCreateFrames() {
  const collectionRef = collection(db, 'frames');

  for (const frame of framesData) {
    try {
      // Query for a document with the matching name
      const q = query(collectionRef, where("name", "==", frame.name));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        // Document exists, update the images field
        const docRef = doc(db, 'frames', querySnapshot.docs[0].id);
        await updateDoc(docRef, { images: frame.images });
        console.log(`Updated images for document: ${frame.name}`);
      } else {
        // Document doesn't exist, create a new one
        const newDocRef = doc(collection(db, 'frames'));
        await setDoc(newDocRef, frame);
        console.log(`Created new document for: ${frame.name}`);
      }
    } catch (error) {
      console.error(`Error processing ${frame.name}:`, error);
    }
  }
}
const framesData=[
  {
    "name": "Tree Leaves",
    "keywords": "Tree Leaves",
    "desc": "High quality artificial tree branches, looks like real plants! Natural, widely used and durable. Ideal for decorating walls, home ceilings, etc. An essential corner of home decor",
    "type": "Leaves",
    "price": "60",
    "sizes": [
      "2 meters"
    ],
    "color": "Green",
    "images": [
      "https://freeimage.host/i/djXvktR",
      "https://freeimage.host/i/djXv8np"
    ],
    "categories": [
      "Decoration"
    ]
  },
  {
    "name": "wall hanging hooks",
    "keywords": "wall hanging hooks",
    "desc": "1. Wipe the dust, grease on the wall with clean soft cloth and keep it fully dry.\n2. Uncover barrier film on bottom layer. Don't touch sticking face with hand.\n3. Position the position of sticking film, paste the patch affixed to the wall horizontally.\n4. Flatten with force to the patch from inside to outside, press each region tightly to evacuate the air in the sticking patch.\n5. Then install hanging rack and screw nut.\n6. Check that the installation is against the wall.\n7.After installation hanging any rack or other stuff after 1 hour.let it dry at 1 hour.\n\nNotice:\n\n1. Please pay attention that there are limits on painted walls, otherwise it might damaged your paint. Avoid using on uneven surface, the more smooth the wall, the better the results.\n2.This screw can hold up to 6kg. But we'd like to suggest no more than 6kg for holding a long time.\n3. Please clean the adhesive surface with water if it has dust covered before installation the hook.\n4. Do not use it at temperatures above 80 degrees.",
    "type": "Hook",
    "price": "25",
    "sizes": [
      "4x4 cm"
    ],
    "color": "Transparent",
    "images": [
      "https://freeimage.host/i/djXSCX4",
      "https://freeimage.host/i/djXSnLl"
    ],
    "categories": [
      "Decoration"
    ]
  },
  {
    "name": "Small vinyl",
    "keywords": "Small vinyl",
    "desc": "Small vinyl disc for decoration",
    "type": "Vinyl",
    "price": "75",
    "sizes": [
      "18 cm"
    ],
    "color": "Black",
    "images": [
      "https://freeimage.host/i/djXUzZv"
    ],
    "categories": [
      "Decoration"
    ]
  },
  {
    "name": "Double face tape",
    "keywords": "Double face tape",
    "desc": "Double face tape is used for many things \nThe most important of them is to stick posters and frames on the wall without any damage to the wall and products",
    "type": "Tape",
    "price": "50",
    "sizes": [
      "3 meters"
    ],
    "color": "Transparent",
    "images": [
      "https://freeimage.host/i/dj8sSlS",
      "https://freeimage.host/i/dj8s4Re"
    ],
    "categories": [
      "Decoration"
    ]
  }
]