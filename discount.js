// importing product.js
import { getProductById } from './product.js';

// Available coupons
const coupons = {
    'WELCOME10': { type: 'percentage', value: 10, minAmount: 1000 },
    'FLAT500': { type: 'flat', value: 500, minAmount: 5000 },
    'ELECTRONICS20': { type: 'percentage', value: 20, minAmount: 10000, category: 'electronics' }
};

// Validate if coupon can be applied
export function validateCoupon(couponCode,cartTotal,cartItems) {
    let coupon=coupons[couponCode];
    if(!coupon){
        // Returning false if coupon is not valid
        return {valid:false,message:"Coupon not valid"};
    }

    // Check minimum cart amount
    if(cartTotal<coupon.minAmount) {
        // Returning false if cart total is less than min amount
        return {valid:false,message:`Minimum cart total of ${coupon.minAmount} required`};
    }

    // Check category restriction if any
    if(coupon.category) {
        // Check if any product in cart belongs to the category
        const hasCategory = cartItems.some(item => getProductById(item.id).category === coupon.category);
        if (!hasCategory) {
            // Returning false if no product in cart belongs to the category
            return { valid: false, message: `Coupon valid only for ${coupon.category} products` };
        }
    }
    //Returning true if coupon is valid
    return{ valid: true, message: "Coupon is valid" };
}

// Calculate discount for a given coupon
export function calculateDiscount(couponCode, cartItems) {
    let coupon = coupons[couponCode];

    // Calculate total of eligible products
    let applicableTotal = cartItems.reduce((total, item) => {
        const product = getProductById(item.id);
        if (coupon.category && product.category !== coupon.category){
            // Exclude products not in the category
            return total;
        }
        // add eligible product total to total
        return total + product.price * item.quantity;
    }, 0);

    if (coupon.type === "percentage"){
        return (applicableTotal * coupon.value) / 100; // Percentage discount
    } else {
        return coupon.value; // Flat discount
    }
}

// Apply coupon and return final totals
export function applyDiscount(cartTotal, cartItems, couponCode) {
    const validation = validateCoupon(couponCode, cartTotal, cartItems);
    if (!validation.valid) {
        // Return original total if coupon is not valid
        return {
            originalTotal: cartTotal,
            discount: 0,
            finalTotal: cartTotal,
            message: validation.message
        };
    }

    const discount = calculateDiscount(couponCode, cartItems);

    return {
        // Return discounted total if coupon is valid
        originalTotal: cartTotal,
        discount,
        finalTotal: cartTotal - discount,
        message: `Coupon "${couponCode}" applied successfully`
    };
}