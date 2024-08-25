import { getFirestore, collection, getDocs, getDoc, doc , query,where, limit, deleteDoc, updateDoc, setDoc} from 'firebase/firestore';
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
  
  const generateSubstrings = (word, minLength = 3) => {
    let substrings = [];
    word = word.toLowerCase(); // Convert to lowercase for case-insensitive search
    for (let i = 0; i < word.length; i++) {
      for (let j = i + 1; j <= word.length; j++) {
        const substring = word.slice(i, j);
        if (substring.length >= minLength) {
          substrings.push(substring);
        }
      }
    }
    return substrings;
  };
  
  export const searchFrames = async (keyword, related, relatedID) => {
    try {
      const lowercaseKeyword = keyword.toLowerCase().trim();
      const framesRef = collection(db, "frames");
      const framesQuery = query(framesRef);
  
      const querySnapshot = await getDocs(framesQuery);
      const matchingProducts = [];
  
      const substrings = generateSubstrings(lowercaseKeyword);
  
      querySnapshot.forEach((doc) => {
        let data = doc.data();
        data.id = doc.id;
        data = Object.keys(data).reduce((acc, key) => {
          const normalizedKey = key.trim().toLowerCase();
          acc[normalizedKey] = data[key];
          return acc;
        }, {});
  
        if (data.keywords && Array.isArray(data.keywords)) {
          const keywordsArray = data.keywords.map(item => item.toLowerCase().trim());
  
          const isMatch = substrings.some(sub => keywordsArray.some(k => k.includes(sub)));
  
          if (isMatch) {
            // Ensure arrays are properly formatted
            if (data.color && typeof data.color === 'string') data.color = data.color.split(',').map(item => item.trim());
            if (data.type && typeof data.type === 'string') data.type = data.type.split(',').map(item => item.trim());
            if (data.price && typeof data.price === 'string') {
              data.price = data.price.split(',').map(item => item.trim());
            } else if (typeof data.price === 'number') {
              data.price = [data.price.toString()];
            }
  
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
      // Reference to the collection you want to update
      const collectionRef = collection(db, 'frames'); // Replace 'frames' with your actual collection name
      
      // Fetch all documents in the collection
      const querySnapshot = await getDocs(collectionRef);
      
      // Iterate over each document
      for (const docSnapshot of querySnapshot.docs) {
        const documentData = docSnapshot.data();
        
        // Check if the 'categories' field contains 'Vinyls'
        if (documentData.categories && documentData.categories.includes('Vinyls')) {
          // Reference to the specific document
          const docRef = doc(db, 'frames', docSnapshot.id);
          
          // Update the document to include the new field
          await updateDoc(docRef, {
            type: 'vinyls'
          });
          
          console.log(`Document ${docSnapshot.id} updated successfully.`);
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
    "name": "The Beatles Framed vinyl",
    "keywords": [
      "the beatles"
    ],
    "desc": "Real vinyl into pvc frame\n\n• plastic PVC frame.\n\n• ⁠ zero pixelation design .\n\n• Real vinyl records \n\n• High Quality printed paper .\n\n• ⁠acrylic protection layer on top the printed paper ( for frame).\n\n• ⁠2 hangers on the back of the frame , can be hanged vertically or horizontally, but we suggest also can be sticked by double face tape “not included”",
    "price": "410, 665",
    "sizes": [
      "30×40",
      "50×70"
    ],
    "color": "Black frame",
    "images": [
      "https://freeimage.host/i/dWx3QGn"
    ],
    "categories": [
      "Framed vinyls"
    ],
    "type": "Frame"
  },
  {
    "name": "Lana Del Ray framed vinyl",
    "keywords": [
      "lana del ray"
    ],
    "desc": "Real vinyl into pvc frame\n\n• plastic PVC frame.\n\n• ⁠ zero pixelation design .\n\n• Real vinyl records \n\n• High Quality printed paper .\n\n• ⁠acrylic protection layer on top the printed paper ( for frame).\n\n• ⁠2 hangers on the back of the frame , can be hanged vertically or horizontally, but we suggest also can be sticked by double face tape “not included”",
    "price": "410, 665",
    "sizes": [
      "30×40",
      "50×70"
    ],
    "color": "Black frame",
    "images": [
      "https://freeimage.host/i/dWx3iQt"
    ],
    "categories": [
      "Framed vinyls"
    ],
    "type": "Frame"
  },
  {
    "name": "Fayrouz framed vinyl",
    "keywords": [
      "فيروز",
      "fayrouz"
    ],
    "desc": "Real vinyl into pvc frame\n\n• plastic PVC frame.\n\n• ⁠ zero pixelation design .\n\n• Real vinyl records \n\n• High Quality printed paper .\n\n• ⁠acrylic protection layer on top the printed paper ( for frame).\n\n• ⁠2 hangers on the back of the frame , can be hanged vertically or horizontally, but we suggest also can be sticked by double face tape “not included”",
    "price": "410, 665",
    "sizes": [
      "30×40",
      "50×70"
    ],
    "color": "Black frame",
    "images": [
      "https://freeimage.host/i/dWx3LCX"
    ],
    "categories": [
      "Framed vinyls"
    ],
    "type": "Frame"
  },
  {
    "name": "EMINEM ( Slim Shady ) framed vinyl",
    "keywords": [
      "eminem"
    ],
    "desc": "Real vinyl into pvc frame\n\n• plastic PVC frame.\n\n• ⁠ zero pixelation design .\n\n• Real vinyl records \n\n• High Quality printed paper .\n\n• ⁠acrylic protection layer on top the printed paper ( for frame).\n\n• ⁠2 hangers on the back of the frame , can be hanged vertically or horizontally, but we suggest also can be sticked by double face tape “not included”",
    "price": "410, 665",
    "sizes": [
      "30×40",
      "50×70"
    ],
    "color": "Black frame",
    "images": [
      "https://freeimage.host/i/dWx3D3G"
    ],
    "categories": [
      "Framed vinyls"
    ],
    "type": "Frame"
  },
  {
    "name": "Pink Floyd framed vinyl",
    "keywords": [
      "pink floyd"
    ],
    "desc": "Real vinyl into pvc frame\n\n• plastic PVC frame.\n\n• ⁠ zero pixelation design .\n\n• Real vinyl records \n\n• High Quality printed paper .\n\n• ⁠acrylic protection layer on top the printed paper ( for frame).\n\n• ⁠2 hangers on the back of the frame , can be hanged vertically or horizontally, but we suggest also can be sticked by double face tape “not included”",
    "price": "410, 665",
    "sizes": [
      "30×40",
      "50×70"
    ],
    "color": "Black frame",
    "images": [
      "https://freeimage.host/i/dWxFF6u"
    ],
    "categories": [
      "Framed vinyls"
    ],
    "type": "Frame"
  },
  {
    "name": "AC DC framed vinyl",
    "keywords": [
      "ac dc"
    ],
    "desc": "Real vinyl into pvc frame\n\n• plastic PVC frame.\n\n• ⁠ zero pixelation design .\n\n• Real vinyl records \n\n• High Quality printed paper .\n\n• ⁠acrylic protection layer on top the printed paper ( for frame).\n\n• ⁠2 hangers on the back of the frame , can be hanged vertically or horizontally, but we suggest also can be sticked by double face tape “not included”",
    "price": "410, 665",
    "sizes": [
      "30×40",
      "50×70"
    ],
    "color": "Black frame",
    "images": [
      "https://freeimage.host/i/dWxFzZP"
    ],
    "categories": [
      "Framed vinyls"
    ],
    "type": "Frame"
  },
  {
    "name": "Rolling Stones framed vinyl",
    "keywords": [
      "Rolling stones"
    ],
    "desc": "Real vinyl into pvc frame\n\n• plastic PVC frame.\n\n• ⁠ zero pixelation design .\n\n• Real vinyl records \n\n• High Quality printed paper .\n\n• ⁠acrylic protection layer on top the printed paper ( for frame).\n\n• ⁠2 hangers on the back of the frame , can be hanged vertically or horizontally, but we suggest also can be sticked by double face tape “not included”",
    "price": "410, 665",
    "sizes": [
      "30×40",
      "50×70"
    ],
    "color": "Black frame",
    "images": [
      "https://freeimage.host/i/dWxFouV"
    ],
    "categories": [
      "Framed vinyls"
    ],
    "type": "Frame"
  },
  {
    "name": "Metallica framed vinyl",
    "keywords": [
      "Metallica"
    ],
    "desc": "Real vinyl into pvc frame\n\n• plastic PVC frame.\n\n• ⁠ zero pixelation design .\n\n• Real vinyl records \n\n• High Quality printed paper .\n\n• ⁠acrylic protection layer on top the printed paper ( for frame).\n\n• ⁠2 hangers on the back of the frame , can be hanged vertically or horizontally, but we suggest also can be sticked by double face tape “not included”",
    "price": "410, 665",
    "sizes": [
      "30×40",
      "50×70"
    ],
    "color": "Black frame",
    "images": [
      "https://freeimage.host/i/dWxFA6g"
    ],
    "categories": [
      "Framed vinyls"
    ],
    "type": "Frame"
  },
  {
    "name": "Arctic monkeys framed vinyl",
    "keywords": [
      "Arctic monkeys"
    ],
    "desc": "Real vinyl into pvc frame\n\n• plastic PVC frame.\n\n• ⁠ zero pixelation design .\n\n• Real vinyl records \n\n• High Quality printed paper .\n\n• ⁠acrylic protection layer on top the printed paper ( for frame).\n\n• ⁠2 hangers on the back of the frame , can be hanged vertically or horizontally, but we suggest also can be sticked by double face tape “not included”",
    "price": "410, 665",
    "sizes": [
      "30×40",
      "50×70"
    ],
    "color": "Black frame",
    "images": [
      "https://freeimage.host/i/dWxfM2s"
    ],
    "categories": [
      "Framed vinyls"
    ],
    "type": "Frame"
  },
  {
    "name": "Queen framed vinyl",
    "keywords": [
      "Queen"
    ],
    "desc": "Real vinyl into pvc frame\n\n• plastic PVC frame.\n\n• ⁠ zero pixelation design .\n\n• Real vinyl records \n\n• High Quality printed paper .\n\n• ⁠acrylic protection layer on top the printed paper ( for frame).\n\n• ⁠2 hangers on the back of the frame , can be hanged vertically or horizontally, but we suggest also can be sticked by double face tape “not included”",
    "price": "410, 665",
    "sizes": [
      "30×40",
      "50×70"
    ],
    "color": "Black frame",
    "images": [
      "https://freeimage.host/i/dWxFMMX"
    ],
    "categories": [
      "Framed vinyls"
    ],
    "type": "Frame"
  },
  {
    "name": "The Weeknd framed vinyl",
    "keywords": [
      "The Weeknd"
    ],
    "desc": "Real vinyl into pvc frame\n\n• plastic PVC frame.\n\n• ⁠ zero pixelation design .\n\n• Real vinyl records \n\n• High Quality printed paper .\n\n• ⁠acrylic protection layer on top the printed paper ( for frame).\n\n• ⁠2 hangers on the back of the frame , can be hanged vertically or horizontally, but we suggest also can be sticked by double face tape “not included”",
    "price": "410, 665",
    "sizes": [
      "30×40",
      "50×70"
    ],
    "color": "Black frame",
    "images": [
      "https://freeimage.host/i/dWxFVPn"
    ],
    "categories": [
      "Framed vinyls"
    ],
    "type": "Frame"
  },
  {
    "name": "Tame Impala framed vinyl",
    "keywords": [
      "Tame Impala"
    ],
    "desc": "Real vinyl into pvc frame\n\n• plastic PVC frame.\n\n• ⁠ zero pixelation design .\n\n• Real vinyl records \n\n• High Quality printed paper .\n\n• ⁠acrylic protection layer on top the printed paper ( for frame).\n\n• ⁠2 hangers on the back of the frame , can be hanged vertically or horizontally, but we suggest also can be sticked by double face tape “not included”",
    "price": "410, 665",
    "sizes": [
      "30×40",
      "50×70"
    ],
    "color": "Black frame",
    "images": [
      "https://freeimage.host/i/dWxFhcG"
    ],
    "categories": [
      "Framed vinyls"
    ],
    "type": "Frame"
  },
  {
    "name": "Umm Kulthum framed vinyl",
    "keywords": [
      "Umm Kulthum",
      "ام كلثوم"
    ],
    "desc": "Real vinyl into pvc frame\n\n• plastic PVC frame.\n\n• ⁠ zero pixelation design .\n\n• Real vinyl records \n\n• High Quality printed paper .\n\n• ⁠acrylic protection layer on top the printed paper ( for frame).\n\n• ⁠2 hangers on the back of the frame , can be hanged vertically or horizontally, but we suggest also can be sticked by double face tape “not included”",
    "price": "410, 665",
    "sizes": [
      "30×40",
      "50×70"
    ],
    "color": "Black frame",
    "images": [
      "https://freeimage.host/i/dWxFN94"
    ],
    "categories": [
      "Framed vinyls"
    ],
    "type": "Frame"
  },
  {
    "name": "Radiohead framed vinyl",
    "keywords": [
      "Radiohead"
    ],
    "desc": "Real vinyl into pvc frame\n\n• plastic PVC frame.\n\n• ⁠ zero pixelation design .\n\n• Real vinyl records \n\n• High Quality printed paper .\n\n• ⁠acrylic protection layer on top the printed paper ( for frame).\n\n• ⁠2 hangers on the back of the frame , can be hanged vertically or horizontally, but we suggest also can be sticked by double face tape “not included”",
    "price": "410, 665",
    "sizes": [
      "30×40",
      "50×70"
    ],
    "color": "Black frame",
    "images": [
      "https://freeimage.host/i/dWxFyla"
    ],
    "categories": [
      "Framed vinyls"
    ],
    "type": "Frame"
  },
  {
    "name": "IGOR framed vinyl",
    "keywords": [
      "IGOR",
      "tylor the creator"
    ],
    "desc": "Real vinyl into pvc frame\n\n• plastic PVC frame.\n\n• ⁠ zero pixelation design .\n\n• Real vinyl records \n\n• High Quality printed paper .\n\n• ⁠acrylic protection layer on top the printed paper ( for frame).\n\n• ⁠2 hangers on the back of the frame , can be hanged vertically or horizontally, but we suggest also can be sticked by double face tape “not included”",
    "price": "410, 665",
    "sizes": [
      "30×40",
      "50×70"
    ],
    "color": "Black frame",
    "images": [
      "https://freeimage.host/i/dWxKJHv"
    ],
    "categories": [
      "Framed vinyls"
    ],
    "type": "Frame"
  },
  {
    "name": "Taylor swift ( Red ) framed vinyl",
    "keywords": [
      "Taylor swift ( Red )"
    ],
    "desc": "Real vinyl into pvc frame\n\n• plastic PVC frame.\n\n• ⁠ zero pixelation design .\n\n• Real vinyl records \n\n• High Quality printed paper .\n\n• ⁠acrylic protection layer on top the printed paper ( for frame).\n\n• ⁠2 hangers on the back of the frame , can be hanged vertically or horizontally, but we suggest also can be sticked by double face tape “not included”",
    "price": "410, 665",
    "sizes": [
      "30×40",
      "50×70"
    ],
    "color": "Black frame",
    "images": [
      "https://freeimage.host/i/dWxKfVt"
    ],
    "categories": [
      "Framed vinyls"
    ],
    "type": "Frame"
  },
  {
    "name": "Blond framed vinyl",
    "keywords": [
      "Blond",
      "frank ocean"
    ],
    "desc": "Real vinyl into pvc frame\n\n• plastic PVC frame.\n\n• ⁠ zero pixelation design .\n\n• Real vinyl records \n\n• High Quality printed paper .\n\n• ⁠acrylic protection layer on top the printed paper ( for frame).\n\n• ⁠2 hangers on the back of the frame , can be hanged vertically or horizontally, but we suggest also can be sticked by double face tape “not included”",
    "price": "410, 665",
    "sizes": [
      "30×40",
      "50×70"
    ],
    "color": "Black frame",
    "images": [
      "https://freeimage.host/i/dWxKoUG"
    ],
    "categories": [
      "Framed vinyls"
    ],
    "type": "Frame"
  },
  {
    "name": "Stargirl framed vinyl",
    "keywords": [
      "Stargirl",
      "lana del ray",
      "the weeknd"
    ],
    "desc": "Real vinyl into pvc frame\n\n• plastic PVC frame.\n\n• ⁠ zero pixelation design .\n\n• Real vinyl records \n\n• High Quality printed paper .\n\n• ⁠acrylic protection layer on top the printed paper ( for frame).\n\n• ⁠2 hangers on the back of the frame , can be hanged vertically or horizontally, but we suggest also can be sticked by double face tape “not included”",
    "price": "410, 665",
    "sizes": [
      "30×40",
      "50×70"
    ],
    "color": "Black frame",
    "images": [
      "https://freeimage.host/i/dWxKXWP"
    ],
    "categories": [
      "Framed vinyls"
    ],
    "type": "Frame"
  },
  {
    "name": "The NBHD framed vinyl",
    "keywords": [
      "The NBHD"
    ],
    "desc": "Real vinyl into pvc frame\n\n• plastic PVC frame.\n\n• ⁠ zero pixelation design .\n\n• Real vinyl records \n\n• High Quality printed paper .\n\n• ⁠acrylic protection layer on top the printed paper ( for frame).\n\n• ⁠2 hangers on the back of the frame , can be hanged vertically or horizontally, but we suggest also can be sticked by double face tape “not included”",
    "price": "410, 665",
    "sizes": [
      "30×40",
      "50×70"
    ],
    "color": "Black frame",
    "images": [
      "https://freeimage.host/i/dWxKhs1"
    ],
    "categories": [
      "Framed vinyls"
    ],
    "type": "Frame"
  },
  {
    "name": "Nirvana framed vinyl",
    "keywords": [
      "Nirvana"
    ],
    "desc": "Real vinyl into pvc frame\n\n• plastic PVC frame.\n\n• ⁠ zero pixelation design .\n\n• Real vinyl records \n\n• High Quality printed paper .\n\n• ⁠acrylic protection layer on top the printed paper ( for frame).\n\n• ⁠2 hangers on the back of the frame , can be hanged vertically or horizontally, but we suggest also can be sticked by double face tape “not included”",
    "price": "410, 665",
    "sizes": [
      "30×40",
      "50×70"
    ],
    "color": "Black frame",
    "images": [
      "https://freeimage.host/i/dWxq2nI"
    ],
    "categories": [
      "Framed vinyls"
    ],
    "type": "Frame"
  }
]