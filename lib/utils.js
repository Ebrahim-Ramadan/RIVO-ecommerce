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
    // else if (categoryParam.toLowerCase() === "Ar musics"){
    //   lowercaseCategoryParam = categoryParam.toLowerCase()
    //   .trim()
    //   .split(' ') 
    //   .map(word => word.charAt(0).toUpperCase() + word.slice(1)) 
    //   .join(' '); 
    // }
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
      const q = query(collectionRef, where('categories', 'array-contains', 'Ar Musics'));
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
    "name": "Netflix series posters set",
    "keywords": "Better call saul, breaking bad, peaky blinders, rick&morty, stranger things",
    "desc": "Set of same size posters \nThick plastic paper and strong material \nHigh quality modified design\nSafe for your wall, Can be sticked with double tape ( not included )",
    "type": "Posters",
    "price": "375, 450",
    "sizes": [
      "20×30",
      "30×40"
    ],
    "color": "Black",
    "images": [
      "https://freeimage.host/i/djM099a"
    ],
    "categories": [
      "posters set"
    ]
  },
  {
    "name": "Van gogh posters set",
    "keywords": "Van gogh",
    "desc": "Set of different sized posters \nThick plastic paper and strong material \nHigh quality modified design\nSafe for your wall, Can be sticked with double tape ( not included )",
    "type": "Posters",
    "price": "320",
    "sizes": [
      "30×40",
      "10×15"
    ],
    "color": "Black",
    "images": [
      "https://freeimage.host/i/djMlA3F"
    ],
    "categories": [
      "posters set"
    ]
  },
  {
    "name": "Billie eillish posters set",
    "keywords": "Billie eillish",
    "desc": "Set of different sized posters \nThick plastic paper and strong material \nHigh quality modified design\nSafe for your wall, Can be sticked with double tape ( not included )",
    "type": "Posters",
    "price": "370",
    "sizes": [
      "30×40",
      "10×15"
    ],
    "color": "Black",
    "images": [
      "https://freeimage.host/i/djMlmcF"
    ],
    "categories": [
      "posters set"
    ]
  },
  {
    "name": "Harry styles posters set",
    "keywords": "Harry styles",
    "desc": "Set of different sized posters \nThick plastic paper and strong material \nHigh quality modified design\nSafe for your wall, Can be sticked with double tape ( not included )",
    "type": "Posters",
    "price": "370",
    "sizes": [
      "30×40",
      "10×15"
    ],
    "color": "Black",
    "images": [
      "https://freeimage.host/i/djMlbF1"
    ],
    "categories": [
      "posters set"
    ]
  },
  {
    "name": "Eminem posters set",
    "keywords": "Eminem",
    "desc": "Set of different sized posters \nThick plastic paper and strong material \nHigh quality modified design\nSafe for your wall, Can be sticked with double tape ( not included )",
    "type": "Posters",
    "price": "370",
    "sizes": [
      "30×40",
      "10×15"
    ],
    "color": "Black",
    "images": [
      "https://freeimage.host/i/djM0xAG"
    ],
    "categories": [
      "posters set"
    ]
  },
  {
    "name": "Al Pacino films posters set",
    "keywords": "Al Pacino, god father, scarface",
    "desc": "Set of same size posters \nThick plastic paper and strong material \nHigh quality modified design\nSafe for your wall, Can be sticked with double tape ( not included )",
    "type": "Posters",
    "price": "375, 450",
    "sizes": [
      "20×30",
      "30×40"
    ],
    "color": "Black",
    "images": [
      "https://freeimage.host/i/djM0UVp"
    ],
    "categories": [
      "posters set"
    ]
  },
  {
    "name": "Theweeknd posters set",
    "keywords": "The weeknd",
    "desc": "Set of different sized posters \nThick plastic paper and strong material \nHigh quality modified design\nSafe for your wall, Can be sticked with double tape ( not included )",
    "type": "Posters",
    "price": "320",
    "sizes": [
      "30×40",
      "10×15"
    ],
    "color": "Black",
    "images": [
      "https://freeimage.host/i/djM0giN"
    ],
    "categories": [
      "posters set"
    ]
  },
  {
    "name": "Frank ocean posters set",
    "keywords": "Frank ocean",
    "desc": "Set of different sized posters \nThick plastic paper and strong material \nHigh quality modified design\nSafe for your wall, Can be sticked with double tape ( not included )",
    "type": "Posters",
    "price": "320",
    "sizes": [
      "30×40",
      "10×15"
    ],
    "color": "Black",
    "images": [
      "https://freeimage.host/i/djM06lt"
    ],
    "categories": [
      "posters set"
    ]
  },
  {
    "name": "Lana del rey posters set",
    "keywords": "Lana del ray",
    "desc": "Set of different sized posters \nThick plastic paper and strong material \nHigh quality modified design\nSafe for your wall, Can be sticked with double tape ( not included )",
    "type": "Posters",
    "price": "370",
    "sizes": [
      "30×40",
      "10×15"
    ],
    "color": "Black",
    "images": [
      "https://freeimage.host/i/djM1Hg9"
    ],
    "categories": [
      "posters set"
    ]
  },
  {
    "name": "Art posters set",
    "keywords": "Art",
    "desc": "Set of different sized posters \nThick plastic paper and strong material \nHigh quality modified design\nSafe for your wall, Can be sticked with double tape ( not included )",
    "type": "Posters",
    "price": "370",
    "sizes": [
      "30×40",
      "10×15"
    ],
    "color": "Black",
    "images": [
      "https://freeimage.host/i/djM0Zbf"
    ],
    "categories": [
      "posters set"
    ]
  },
  {
    "name": "Pulp fiction posters set",
    "keywords": "Pulp fiction",
    "desc": "Set of different sized posters \nThick plastic paper and strong material \nHigh quality modified design\nSafe for your wall, Can be sticked with double tape ( not included )",
    "type": "Posters",
    "price": "320",
    "sizes": [
      "30×40",
      "10×15"
    ],
    "color": "Black",
    "images": [
      "https://freeimage.host/i/djM1v29"
    ],
    "categories": [
      "posters set"
    ]
  },
  {
    "name": "Top movies posters set",
    "keywords": "Inglourious basterds, pulp fuction, kill bill",
    "desc": "Set of same size posters \nThick plastic paper and strong material \nHigh quality modified design\nSafe for your wall, Can be sticked with double tape ( not included )",
    "type": "Posters",
    "price": "375, 450",
    "sizes": [
      "20×30",
      "30×40"
    ],
    "color": "Black",
    "images": [
      "https://freeimage.host/i/djM1o0P"
    ],
    "categories": [
      "posters set"
    ]
  },
  {
    "name": "Cr7 posters set",
    "keywords": "Cr7",
    "desc": "Set of different sized posters \nThick plastic paper and strong material \nHigh quality modified design\nSafe for your wall, Can be sticked with double tape ( not included )",
    "type": "Posters",
    "price": "195",
    "sizes": [
      "30×40",
      "10×15"
    ],
    "color": "Black",
    "images": [
      "https://freeimage.host/i/djM1xg1"
    ],
    "categories": [
      "posters set"
    ]
  },
  {
    "name": "Radiohead posters set",
    "keywords": "Radiohead",
    "desc": "Set of same size posters \nThick plastic paper and strong material \nHigh quality modified design\nSafe for your wall, Can be sticked with double tape ( not included )",
    "type": "Posters",
    "price": "375, 450",
    "sizes": [
      "20×30",
      "30×40"
    ],
    "color": "Black",
    "images": [
      "https://freeimage.host/i/djM1NB2"
    ],
    "categories": [
      "posters set"
    ]
  },
  {
    "name": "The wolf of wall street posters set",
    "keywords": "The wolf of wall street",
    "desc": "Set of different sized posters \nThick plastic paper and strong material \nHigh quality modified design\nSafe for your wall, Can be sticked with double tape ( not included )",
    "type": "Posters",
    "price": "320",
    "sizes": [
      "30×40",
      "10×15"
    ],
    "color": "Black",
    "images": [
      "https://freeimage.host/i/djM1LrP"
    ],
    "categories": [
      "posters set"
    ]
  },
  {
    "name": "Stranger things posters set",
    "keywords": "Stranger things",
    "desc": "Set of different sized posters \nThick plastic paper and strong material \nHigh quality modified design\nSafe for your wall, Can be sticked with double tape ( not included )",
    "type": "Posters",
    "price": "195",
    "sizes": [
      "30×40",
      "10×15"
    ],
    "color": "Black",
    "images": [
      "https://freeimage.host/i/djM1tYF"
    ],
    "categories": [
      "posters set"
    ]
  },
  {
    "name": "Ac/dc posters set",
    "keywords": "AC DC",
    "desc": "Set of different sized posters \nThick plastic paper and strong material \nHigh quality modified design\nSafe for your wall, Can be sticked with double tape ( not included )",
    "type": "Posters",
    "price": "195",
    "sizes": [
      "30×40",
      "10×15"
    ],
    "color": "Black",
    "images": [
      "https://freeimage.host/i/djME9QR"
    ],
    "categories": [
      "posters set"
    ]
  },
  {
    "name": "American psycho posters set",
    "keywords": "American psycho",
    "desc": "Set of different sized posters \nThick plastic paper and strong material \nHigh quality modified design\nSafe for your wall, Can be sticked with double tape ( not included )",
    "type": "Posters",
    "price": "320",
    "sizes": [
      "30×40",
      "10×15"
    ],
    "color": "Black",
    "images": [
      "https://freeimage.host/i/djM1yhv"
    ],
    "categories": [
      "posters set"
    ]
  },
  {
    "name": "Avengers posters set",
    "keywords": "Marvel, avengers",
    "desc": "Set of different sized posters \nThick plastic paper and strong material \nHigh quality modified design\nSafe for your wall, Can be sticked with double tape ( not included )",
    "type": "Posters",
    "price": "320",
    "sizes": [
      "30×40",
      "10×15"
    ],
    "color": "Black",
    "images": [
      "https://freeimage.host/i/djMEKYX"
    ],
    "categories": [
      "posters set"
    ]
  },
  {
    "name": "Arctic monkeys posters set",
    "keywords": "Arctic monkeys",
    "desc": "Set of same size posters \nThick plastic paper and strong material \nHigh quality modified design\nSafe for your wall, Can be sticked with double tape ( not included )",
    "type": "Posters",
    "price": "375, 450",
    "sizes": [
      "20×30",
      "30×40"
    ],
    "color": "Black",
    "images": [
      "https://freeimage.host/i/djMEIG2"
    ],
    "categories": [
      "posters set"
    ]
  },
  {
    "name": "Wanted posters set",
    "keywords": "Wanted",
    "desc": "Set of same size posters \nThick plastic paper and strong material \nHigh quality modified design\nSafe for your wall, Can be sticked with double tape ( not included )",
    "type": "Posters",
    "price": "375, 450",
    "sizes": [
      "20×30",
      "30×40"
    ],
    "color": "Black",
    "images": [
      "https://freeimage.host/i/djMElZx"
    ],
    "categories": [
      "posters set"
    ]
  },
  {
    "name": "Fight club posters set",
    "keywords": "Fight club",
    "desc": "Set of different sized posters \nThick plastic paper and strong material \nHigh quality modified design\nSafe for your wall, Can be sticked with double tape ( not included )",
    "type": "Posters",
    "price": "320",
    "sizes": [
      "30×40",
      "10×15"
    ],
    "color": "Black",
    "images": [
      "https://freeimage.host/i/djME7yu"
    ],
    "categories": [
      "posters set"
    ]
  },
  {
    "name": "Got and house of dragons posters set",
    "keywords": "Game of thrones, house of the dragon",
    "desc": "Set of different sized posters \nThick plastic paper and strong material \nHigh quality modified design\nSafe for your wall, Can be sticked with double tape ( not included )",
    "type": "Posters",
    "price": "370",
    "sizes": [
      "30×40",
      "10×15"
    ],
    "color": "Black",
    "images": [
      "https://freeimage.host/i/djMEX8F"
    ],
    "categories": [
      "posters set"
    ]
  },
  {
    "name": "Got and house of dragons posters set",
    "keywords": "Game of thrones, house of the dragon",
    "desc": "Set of different sized posters \nThick plastic paper and strong material \nHigh quality modified design\nSafe for your wall, Can be sticked with double tape ( not included )",
    "type": "Posters",
    "price": "195",
    "sizes": [
      "30×40",
      "10×15"
    ],
    "color": "Black",
    "images": [
      "https://freeimage.host/i/djMEOZv"
    ],
    "categories": [
      "posters set"
    ]
  },
  {
    "name": "Messi posters set",
    "keywords": "Messi",
    "desc": "Set of different sized posters \nThick plastic paper and strong material \nHigh quality modified design\nSafe for your wall, Can be sticked with double tape ( not included )",
    "type": "Posters",
    "price": "370",
    "sizes": [
      "30×40",
      "10×15"
    ],
    "color": "Black",
    "images": [
      "https://freeimage.host/i/djMEr8X"
    ],
    "categories": [
      "posters set"
    ]
  },
  {
    "name": "Harry potter posters set",
    "keywords": "Harry potter",
    "desc": "Set of different sized posters \nThick plastic paper and strong material \nHigh quality modified design\nSafe for your wall, Can be sticked with double tape ( not included )",
    "type": "Posters",
    "price": "370",
    "sizes": [
      "30×40",
      "10×15"
    ],
    "color": "Black",
    "images": [
      "https://freeimage.host/i/djMEstf"
    ],
    "categories": [
      "posters set"
    ]
  },
  {
    "name": "Classic posters set",
    "keywords": "Classic",
    "desc": "Set of different sized posters \nThick plastic paper and strong material \nHigh quality modified design\nSafe for your wall, Can be sticked with double tape ( not included )",
    "type": "Posters",
    "price": "370",
    "sizes": [
      "30×40",
      "10×15"
    ],
    "color": "Black",
    "images": [
      "https://freeimage.host/i/djMEZMl"
    ],
    "categories": [
      "posters set"
    ]
  },
  {
    "name": "Deftones posters set",
    "keywords": "Deftones",
    "desc": "Set of different sized posters \nThick plastic paper and strong material \nHigh quality modified design\nSafe for your wall, Can be sticked with double tape ( not included )",
    "type": "Posters",
    "price": "320",
    "sizes": [
      "30×40",
      "10×15"
    ],
    "color": "Black",
    "images": [
      "https://freeimage.host/i/djMEQn4"
    ],
    "categories": [
      "posters set"
    ]
  },
  {
    "name": "Egyptian rappers posters set 1",
    "keywords": "Egyptian rappers",
    "desc": "Set of different sized posters \nThick plastic paper and strong material \nHigh quality modified design\nSafe for your wall, Can be sticked with double tape ( not included )",
    "type": "Posters",
    "price": "195",
    "sizes": [
      "30×40",
      "10×15"
    ],
    "color": "Black",
    "images": [
      "https://freeimage.host/i/djjdazG"
    ],
    "categories": [
      "posters set"
    ]
  },
  {
    "name": "Egyptian rappers posters set 2",
    "keywords": "Egyptian rappers",
    "desc": "Set of same size posters \nThick plastic paper and strong material \nHigh quality modified design\nSafe for your wall, Can be sticked with double tape ( not included )",
    "type": "Posters",
    "price": "375, 450",
    "sizes": [
      "20×30",
      "30×40"
    ],
    "color": "Black",
    "images": [
      "https://freeimage.host/i/djjd7bs"
    ],
    "categories": [
      "posters set"
    ]
  },
  {
    "name": "Egyptian rappers posters set 3",
    "keywords": "Egyptian rappers",
    "desc": "Set of different sized posters \nThick plastic paper and strong material \nHigh quality modified design\nSafe for your wall, Can be sticked with double tape ( not included )",
    "type": "Posters",
    "price": "370",
    "sizes": [
      "30×40",
      "10×15"
    ],
    "color": "Black",
    "images": [
      "https://freeimage.host/i/djjdcXf"
    ],
    "categories": [
      "posters set"
    ]
  },
  {
    "name": "Egyptian rappers posters set 4",
    "keywords": "Egyptian rappers",
    "desc": "Set of different sized posters \nThick plastic paper and strong material \nHigh quality modified design\nSafe for your wall, Can be sticked with double tape ( not included )",
    "type": "Posters",
    "price": "320",
    "sizes": [
      "30×40",
      "10×15"
    ],
    "color": "Black",
    "images": [
      "https://freeimage.host/i/djjdR5X"
    ],
    "categories": [
      "posters set"
    ]
  }
]