// Function to set a cookie
export function setCookie(name, value, days) {
  const expires = new Date();
  expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);
  document.cookie = name + '=' + JSON.stringify(value) + ';expires=' + expires.toUTCString() + ';path=/';
}

// Function to get a cookie
function getCookie(name) {
  const nameEQ = name + "=";
  const ca = document.cookie.split(';');
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) === ' ') c = c.substring(1, c.length);
    if (c.indexOf(nameEQ) === 0) return JSON.parse(c.substring(nameEQ.length, c.length));
  }
  return null;
}

// Function to get the cart
export function getCart() {
  const cart = getCookie('cart') || [];
  return cart;
}

 


// Function to add an item to the cart
export function addToCart(product, size, color, type, price) {
  let cart = getCookie('cart') || [];

  const existingItemIndex = cart.findIndex(item => item.id === product.id && item.size === size && item.color === color && item.type === type);

  if (existingItemIndex !== -1) {
    cart[existingItemIndex].quantity += 1;
  } else {
    const { id } = product;
    // price = Math.ceil(price)
    cart.push({ id, size, color, type, price, quantity: 1 });
  }

  setCookie('cart', cart, 7); // Store for 7 days
}

// Function to remove an item from the cart
export function removeFromCart(id, size, color, setCart) {
  let cart = getCookie('cart') || [];
  cart = cart.filter(item => !(item.id === id && item.size === size && item.color === color));
  setCookie('cart', cart, 7); // Update the cookie with the new cart
  setCart(cart); // Update the state
}

// Function to update an item quantity in the cart
export function updateCart(id, size, color, type, newQuantity) {
  let cart = getCookie('cart') || [];
  cart = cart.map(item => 
    item.id === id && item.size === size && item.color === color && item.type === type
      ? { ...item, quantity: newQuantity }
      : item
  ).filter(item => item.quantity > 0);
  setCookie('cart', cart, 7); // Update the cookie with the new cart

}
