//importing product.js
import { getProductById, checkStock } from './product.js';

// Array to store cart items
let cartItems = [];

// Add a product to the cart or update quantity
export function addToCart(productId, quantity) {
    // 1. Get product details
    const product = getProductById(productId);
    if (!product) {
        return { success: false, message: "Product not found" }; // Product doesn't exist
    }

    // 2. Check stock availability
    if (!checkStock(productId, quantity)) {
        return { success: false, message: "Insufficient Stock" }; // Not enough stock
    }

    // 3. Check if product already in cart
    const existingItem = cartItems.find((prod) => prod.id === productId);
    if (existingItem) {
        if (!checkStock(productId, existingItem.quantity + quantity)) {
            return { success: false, message: "Stock is not available for the new quantity" }; // Stock check
        }
        existingItem.quantity += quantity; // Update quantity
    } else {
        cartItems.push({ id: productId, quantity: quantity }); // Add new item
    }

    // 4. Return success message
    return { success: true, message: "Product added to cart" };
}

// Remove product from cart
export function removeFromCart(productId) {
    let indexOfProduct = cartItems.findIndex((prod) => prod.id === productId);
    if (indexOfProduct === -1) {
        return { success: false, message: "Product not in cart" }; // Product not in cart
    }
    cartItems.splice(indexOfProduct, 1); // Remove item
    return { success: true, message: "Product removed" };
}

// Update quantity of product in cart
export function updateQuantity(productId, newQuantity) {
    const product = cartItems.find(prod => prod.id === productId);
    if (!product) {
        return { success: false, message: "Product not in cart" }; // Product not in cart
    }
    if (!checkStock(productId, newQuantity)) {
        return { success: false, message: "Insufficient stock" }; // Stock unavailable
    }
    product.quantity = newQuantity; // Update quantity
    return { success: true, message: "Quantity updated" };
}

// Get all cart items with product details
export function getCartItems() {
    return cartItems.map(item => {
        const product = getProductById(item.id);
        return {
            id: item.id,
            name: product.name,       // Product name
            price: product.price,     // Unit price
            quantity: item.quantity,  // Quantity in cart
            total: product.price * item.quantity // Total price
        };
    });
}

// Calculate total price of cart items
export function getCartTotal() {
    let total = cartItems.reduce(
        (total, prod) => total + prod.quantity * getProductById(prod.id).price, 
        0
    );
    return total;
}

// Clear all items from the cart
export function clearCart() {
    cartItems = [];
}