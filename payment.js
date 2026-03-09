//importing product.js, cart.js, discount.js
import { reduceStock } from './product.js';
import { getCartItems, getCartTotal, clearCart } from './cart.js';
import { applyDiscount } from './discount.js';

// Process payment and return order summary
export function processPayment(paymentMethod, couponCode = null) {
    // 1. Get cart items and total
    const cartItems = getCartItems();
    const total = getCartTotal();

    // 2. Apply discount if coupon provided
    let discount = 0;
    let finalTotal = total;
    if (couponCode) {
        const discountInfo = applyDiscount(total, cartItems, couponCode);
        discount = discountInfo.discount;       // Discount amount
        finalTotal = discountInfo.finalTotal;  // Total after discount
    }

    // 3. Validate payment method
    let isValid = validatePaymentMethod(paymentMethod);
    if (!isValid.valid) {
        // Return error message and status 'failed' if payment method is invalid
        return {
            orderId: generateOrderId(),  // Generate order ID
            items: cartItems,
            subtotal: total,
            discount: 0,
            total: total,
            paymentMethod: paymentMethod,
            status: 'failed',
            message: 'Payment failed: Invalid payment method'
        };
    }

    // 4. Process payment (simulated)

    // 5. Reduce stock for purchased items
    cartItems.forEach(item => reduceStock(item.id, item.quantity));

    // 6. Clear cart
    clearCart();

    // 7. Generate order summary
    let orderSummary = {
        orderId: generateOrderId(),
        items: cartItems,
        subtotal: total,
        discount: discount,
        total: finalTotal,
        paymentMethod: paymentMethod,
        status: 'success',
        message: 'Payment successful'
    };

    // 8. Return order summary
    return orderSummary;
}

// Validate allowed payment methods
export function validatePaymentMethod(method) {
    if (method === 'card' || method === 'upi' || method === 'cod') {
        return { valid: true, message: 'Payment method is valid' };
    } else {
        return { valid: false, message: 'Invalid payment method' };
    }
}

// Generate unique order ID
function generateOrderId() {
    return 'ORD' + Date.now();
}