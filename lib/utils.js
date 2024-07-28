export async function get3Frames() {
    const products = await fetch('https://jsonplaceholder.typicode.com/photos?limit=10')
    const data = await products.json();
    return data.slice(0, 10);
  }
  
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