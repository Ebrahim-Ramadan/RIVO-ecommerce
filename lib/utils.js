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

if (categoryParam.toLowerCase() === "cairokee frames") {
  lowercaseCategoryParam = categoryParam.trim(); // No capitalization
} else {
  lowercaseCategoryParam =
    categoryParam.charAt(0).toUpperCase() + categoryParam.slice(1).toLowerCase().trim();
}
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
    "name": "Ala bab el cima frame",
    "keywords": "Ala bab el cima , rivo, cairokee",
    "desc": "plastic PVC frame Or Tableau on MDF wood.\n\n• ⁠ zero pixelation design .\n\n• High Quality printed paper .\n\n• ⁠acrylic protection layer on top the printed paper ( for frame).\n\n• ⁠2 hangers on the back of the tableau/frame , can be hanged vertically or horizontally, but we suggest also can be sticked by double face tape “not included”",
    "type": "FRAME, Wooden Tableau",
    "price": "240, 270, 380, 450, 490",
    "sizes": [
      "20×30",
      "30×40",
      "40×50",
      "50×60",
      "50×70",
      "60×90"
    ],
    "color": "White, Black",
    "images": [
      "https://freeimage.host/i/dWBPOHQ"
    ],
    "categories": [
      "cairokee frames"
    ]
  },
  {
    "name": "Ana negm frame",
    "keywords": "Ana negm , rivo, cairokee",
    "desc": "plastic PVC frame Or Tableau on MDF wood.\n\n• ⁠ zero pixelation design .\n\n• High Quality printed paper .\n\n• ⁠acrylic protection layer on top the printed paper ( for frame).\n\n• ⁠2 hangers on the back of the tableau/frame , can be hanged vertically or horizontally, but we suggest also can be sticked by double face tape “not included”",
    "type": "FRAME, Wooden Tableau",
    "price": "240, 270, 380, 450, 490",
    "sizes": [
      "20×30",
      "30×40",
      "40×50",
      "50×60",
      "50×70",
      "60×90"
    ],
    "color": "White, Black",
    "images": [
      "https://freeimage.host/i/dWBPjlj"
    ],
    "categories": [
      "cairokee frames"
    ]
  },
  {
    "name": "Basrh w atoh frame",
    "keywords": "Basrh w atoh , rivo, cairokee",
    "desc": "plastic PVC frame Or Tableau on MDF wood.\n\n• ⁠ zero pixelation design .\n\n• High Quality printed paper .\n\n• ⁠acrylic protection layer on top the printed paper ( for frame).\n\n• ⁠2 hangers on the back of the tableau/frame , can be hanged vertically or horizontally, but we suggest also can be sticked by double face tape “not included”",
    "type": "FRAME, Wooden Tableau",
    "price": "240, 270, 380, 450, 490",
    "sizes": [
      "20×30",
      "30×40",
      "40×50",
      "50×60",
      "50×70",
      "60×90"
    ],
    "color": "White, Black",
    "images": [
      "https://freeimage.host/i/dWBPWiu"
    ],
    "categories": [
      "cairokee frames"
    ]
  },
  {
    "name": "Rivo series frame",
    "keywords": "Rivo series , rivo, cairokee",
    "desc": "plastic PVC frame Or Tableau on MDF wood.\n\n• ⁠ zero pixelation design .\n\n• High Quality printed paper .\n\n• ⁠acrylic protection layer on top the printed paper ( for frame).\n\n• ⁠2 hangers on the back of the tableau/frame , can be hanged vertically or horizontally, but we suggest also can be sticked by double face tape “not included”",
    "type": "FRAME, Wooden Tableau",
    "price": "240, 270, 380, 450, 490",
    "sizes": [
      "20×30",
      "30×40",
      "40×50",
      "50×60",
      "50×70",
      "60×90"
    ],
    "color": "White, Black",
    "images": [
      "https://freeimage.host/i/dWBPVVe"
    ],
    "categories": [
      "cairokee frames"
    ]
  },
  {
    "name": "Marbot b astek frame",
    "keywords": "Marbot b astek , rivo, cairokee",
    "desc": "plastic PVC frame Or Tableau on MDF wood.\n\n• ⁠ zero pixelation design .\n\n• High Quality printed paper .\n\n• ⁠acrylic protection layer on top the printed paper ( for frame).\n\n• ⁠2 hangers on the back of the tableau/frame , can be hanged vertically or horizontally, but we suggest also can be sticked by double face tape “not included”",
    "type": "FRAME, Wooden Tableau",
    "price": "240, 270, 380, 450, 490",
    "sizes": [
      "20×30",
      "30×40",
      "40×50",
      "50×60",
      "50×70",
      "60×90"
    ],
    "color": "White, Black",
    "images": [
      "https://freeimage.host/i/dWB6Qne"
    ],
    "categories": [
      "cairokee frames"
    ]
  },
  {
    "name": "Cairokee logo frame",
    "keywords": "Cairokee logo, rivo, cairokee",
    "desc": "plastic PVC frame Or Tableau on MDF wood.\n\n• ⁠ zero pixelation design .\n\n• High Quality printed paper .\n\n• ⁠acrylic protection layer on top the printed paper ( for frame).\n\n• ⁠2 hangers on the back of the tableau/frame , can be hanged vertically or horizontally, but we suggest also can be sticked by double face tape “not included”",
    "type": "FRAME, Wooden Tableau",
    "price": "240, 270, 380, 450, 490",
    "sizes": [
      "20×30",
      "30×40",
      "40×50",
      "50×60",
      "50×70",
      "60×90"
    ],
    "color": "White, Black",
    "images": [
      "https://freeimage.host/i/dWB6st9"
    ],
    "categories": [
      "cairokee frames"
    ]
  },
  {
    "name": "Rivo characters frame",
    "keywords": "Rivo characters, rivo, cairokee",
    "desc": "plastic PVC frame Or Tableau on MDF wood.\n\n• ⁠ zero pixelation design .\n\n• High Quality printed paper .\n\n• ⁠acrylic protection layer on top the printed paper ( for frame).\n\n• ⁠2 hangers on the back of the tableau/frame , can be hanged vertically or horizontally, but we suggest also can be sticked by double face tape “not included”",
    "type": "FRAME, Wooden Tableau",
    "price": "240, 270, 380, 450, 490",
    "sizes": [
      "20×30",
      "30×40",
      "40×50",
      "50×60",
      "50×70",
      "60×90"
    ],
    "color": "Black,White",
    "images": [
      "https://freeimage.host/i/dWB6wuI"
    ],
    "categories": [
      "cairokee frames"
    ]
  },
  {
    "name": "Rivo poster frame",
    "keywords": "Rivo poster , rivo, cairokee",
    "desc": "plastic PVC frame Or Tableau on MDF wood.\n\n• ⁠ zero pixelation design .\n\n• High Quality printed paper .\n\n• ⁠acrylic protection layer on top the printed paper ( for frame).\n\n• ⁠2 hangers on the back of the tableau/frame , can be hanged vertically or horizontally, but we suggest also can be sticked by double face tape “not included”",
    "type": "FRAME, Wooden Tableau",
    "price": "240, 270, 380, 450, 490",
    "sizes": [
      "20×30",
      "30×40",
      "40×50",
      "50×60",
      "50×70",
      "60×90"
    ],
    "color": "Black,White",
    "images": [
      "https://freeimage.host/i/dWB6OZX"
    ],
    "categories": [
      "cairokee frames"
    ]
  },
  {
    "name": "Ana negm lyrics frame",
    "keywords": "Ana negm lyrics , rivo, cairokee",
    "desc": "plastic PVC frame Or Tableau on MDF wood.\n\n• ⁠ zero pixelation design .\n\n• High Quality printed paper .\n\n• ⁠acrylic protection layer on top the printed paper ( for frame).\n\n• ⁠2 hangers on the back of the tableau/frame , can be hanged vertically or horizontally, but we suggest also can be sticked by double face tape “not included”",
    "type": "FRAME, Wooden Tableau",
    "price": "240, 270, 380, 450, 490",
    "sizes": [
      "20×30",
      "30×40",
      "40×50",
      "50×60",
      "50×70",
      "60×90"
    ],
    "color": "Black,White",
    "images": [
      "https://freeimage.host/i/dWB6aTP"
    ],
    "categories": [
      "cairokee frames"
    ]
  },
  {
    "name": "Cairokee gray logo frame",
    "keywords": "Cairokee gray logo , rivo, cairokee",
    "desc": "plastic PVC frame Or Tableau on MDF wood.\n\n• ⁠ zero pixelation design .\n\n• High Quality printed paper .\n\n• ⁠acrylic protection layer on top the printed paper ( for frame).\n\n• ⁠2 hangers on the back of the tableau/frame , can be hanged vertically or horizontally, but we suggest also can be sticked by double face tape “not included”",
    "type": "FRAME, Wooden Tableau",
    "price": "240, 270, 380, 450, 490",
    "sizes": [
      "20×30",
      "30×40",
      "40×50",
      "50×60",
      "50×70",
      "60×90"
    ],
    "color": "Black,White",
    "images": [
      "https://freeimage.host/i/dWB6A3x"
    ],
    "categories": [
      "cairokee frames"
    ]
  },
  {
    "name": "Rivo original frame",
    "keywords": "Rivo original , rivo, cairokee",
    "desc": "plastic PVC frame Or Tableau on MDF wood.\n\n• ⁠ zero pixelation design .\n\n• High Quality printed paper .\n\n• ⁠acrylic protection layer on top the printed paper ( for frame).\n\n• ⁠2 hangers on the back of the tableau/frame , can be hanged vertically or horizontally, but we suggest also can be sticked by double face tape “not included”",
    "type": "FRAME, Wooden Tableau",
    "price": "240, 270, 380, 450, 490",
    "sizes": [
      "20×30",
      "30×40",
      "40×50",
      "50×60",
      "50×70",
      "60×90"
    ],
    "color": "Black,White",
    "images": [
      "https://freeimage.host/i/dWB6qpS"
    ],
    "categories": [
      "cairokee frames"
    ]
  },
  {
    "name": "Roma frame",
    "keywords": "Roma , rivo, cairokee",
    "desc": "plastic PVC frame Or Tableau on MDF wood.\n\n• ⁠ zero pixelation design .\n\n• High Quality printed paper .\n\n• ⁠acrylic protection layer on top the printed paper ( for frame).\n\n• ⁠2 hangers on the back of the tableau/frame , can be hanged vertically or horizontally, but we suggest also can be sticked by double face tape “not included”",
    "type": "FRAME, Wooden Tableau",
    "price": "240, 270, 380, 450, 490",
    "sizes": [
      "20×30",
      "30×40",
      "40×50",
      "50×60",
      "50×70",
      "60×90"
    ],
    "color": "Black,White",
    "images": [
      "https://freeimage.host/i/dWB69Qn"
    ],
    "categories": [
      "cairokee frames"
    ]
  },
  {
    "name": "Rivo bills",
    "keywords": "Rivo, rivo, cairokee",
    "desc": "plastic PVC frame Or Tableau on MDF wood.\n\n• ⁠ zero pixelation design .\n\n• High Quality printed paper .\n\n• ⁠acrylic protection layer on top the printed paper ( for frame).\n\n• ⁠2 hangers on the back of the tableau/frame , can be hanged vertically or horizontally, but we suggest also can be sticked by double face tape “not included”",
    "type": "FRAME, Wooden Tableau",
    "price": "240, 270, 380, 450, 490",
    "sizes": [
      "20×30",
      "30×40",
      "40×50",
      "50×60",
      "50×70",
      "60×90"
    ],
    "color": "Black,White",
    "images": [
      "https://freeimage.host/i/dWB6KYl"
    ],
    "categories": [
      "cairokee frames"
    ]
  },
  {
    "name": "Shady fakhr eldin frame",
    "keywords": "Shady fakhr eldin , rivo, cairokee",
    "desc": "plastic PVC frame Or Tableau on MDF wood.\n\n• ⁠ zero pixelation design .\n\n• High Quality printed paper .\n\n• ⁠acrylic protection layer on top the printed paper ( for frame).\n\n• ⁠2 hangers on the back of the tableau/frame , can be hanged vertically or horizontally, but we suggest also can be sticked by double face tape “not included”",
    "type": "FRAME, Wooden Tableau",
    "price": "240, 270, 380, 450, 490",
    "sizes": [
      "20×30",
      "30×40",
      "40×50",
      "50×60",
      "50×70",
      "60×90"
    ],
    "color": "Black,White",
    "images": [
      "https://freeimage.host/i/dWB6dEG"
    ],
    "categories": [
      "cairokee frames"
    ]
  },
  {
    "name": "Hatlena bl b2ay lban frame",
    "keywords": "Hatlena bl b2ay lban , rivo, cairokee",
    "desc": "plastic PVC frame Or Tableau on MDF wood.\n\n• ⁠ zero pixelation design .\n\n• High Quality printed paper .\n\n• ⁠acrylic protection layer on top the printed paper ( for frame).\n\n• ⁠2 hangers on the back of the tableau/frame , can be hanged vertically or horizontally, but we suggest also can be sticked by double face tape “not included”",
    "type": "FRAME, Wooden Tableau",
    "price": "240, 270, 380, 450, 490",
    "sizes": [
      "20×30",
      "30×40",
      "40×50",
      "50×60",
      "50×70",
      "60×90"
    ],
    "color": "Black,White",
    "images": [
      "https://freeimage.host/i/dWB4DkN"
    ],
    "categories": [
      "cairokee frames"
    ]
  },
  {
    "name": "Cairokee bts frame",
    "keywords": "Cairokee bts , rivo, cairokee",
    "desc": "plastic PVC frame Or Tableau on MDF wood.\n\n• ⁠ zero pixelation design .\n\n• High Quality printed paper .\n\n• ⁠acrylic protection layer on top the printed paper ( for frame).\n\n• ⁠2 hangers on the back of the tableau/frame , can be hanged vertically or horizontally, but we suggest also can be sticked by double face tape “not included”",
    "type": "FRAME, Wooden Tableau",
    "price": "240, 270, 380, 450, 490",
    "sizes": [
      "20×30",
      "30×40",
      "40×50",
      "50×60",
      "50×70",
      "60×90"
    ],
    "color": "Black,White",
    "images": [
      "https://freeimage.host/i/dWB4iBa"
    ],
    "categories": [
      "cairokee frames"
    ]
  },
  {
    "name": "Amir eid roma album frame",
    "keywords": "Amir eid roma album , rivo, cairokee",
    "desc": "plastic PVC frame Or Tableau on MDF wood.\n\n• ⁠ zero pixelation design .\n\n• High Quality printed paper .\n\n• ⁠acrylic protection layer on top the printed paper ( for frame).\n\n• ⁠2 hangers on the back of the tableau/frame , can be hanged vertically or horizontally, but we suggest also can be sticked by double face tape “not included”",
    "type": "FRAME, Wooden Tableau",
    "price": "240, 270, 380, 450, 490",
    "sizes": [
      "20×30",
      "30×40",
      "40×50",
      "50×60",
      "50×70",
      "60×90"
    ],
    "color": "Black,White",
    "images": [
      "https://freeimage.host/i/dWB44hF"
    ],
    "categories": [
      "cairokee frames"
    ]
  },
  {
    "name": "Amir eid orange frame",
    "keywords": "Amir eid orange , rivo, cairokee",
    "desc": "plastic PVC frame Or Tableau on MDF wood.\n\n• ⁠ zero pixelation design .\n\n• High Quality printed paper .\n\n• ⁠acrylic protection layer on top the printed paper ( for frame).\n\n• ⁠2 hangers on the back of the tableau/frame , can be hanged vertically or horizontally, but we suggest also can be sticked by double face tape “not included”",
    "type": "FRAME, Wooden Tableau",
    "price": "240, 270, 380, 450, 490",
    "sizes": [
      "20×30",
      "30×40",
      "40×50",
      "50×60",
      "50×70",
      "60×90"
    ],
    "color": "Black,White",
    "images": [
      "https://freeimage.host/i/dWB4rI1"
    ],
    "categories": [
      "cairokee frames"
    ]
  },
  {
    "name": "Roxi album frame",
    "keywords": "Roxi album , rivo, cairokee",
    "desc": "plastic PVC frame Or Tableau on MDF wood.\n\n• ⁠ zero pixelation design .\n\n• High Quality printed paper .\n\n• ⁠acrylic protection layer on top the printed paper ( for frame).\n\n• ⁠2 hangers on the back of the tableau/frame , can be hanged vertically or horizontally, but we suggest also can be sticked by double face tape “not included”",
    "type": "FRAME, Wooden Tableau",
    "price": "240, 270, 380, 450, 490",
    "sizes": [
      "20×30",
      "30×40",
      "40×50",
      "50×60",
      "50×70",
      "60×90"
    ],
    "color": "Black,White",
    "images": [
      "https://freeimage.host/i/dWB4UmP"
    ],
    "categories": [
      "cairokee frames"
    ]
  }
]