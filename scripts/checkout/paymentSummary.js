import { cart,calculateCartQuantity, removeFromCart, resetCart} from "../../data/cart.js";
import { getProduct } from "../../data/products.js";
import { getDeliveryOption } from "../../data/deliveryOptions.js";
import { formatCurrency } from "../utils/money.js";
import { addOrder } from "../../data/orders.js";

export function renderPaymentSummary(){
    let productPriceCents = 0;
    let shippingPriceCents = 0;

    cart.forEach((cartItem) => {
        const product = getProduct(cartItem.productId);
        productPriceCents += product.priceCents * cartItem.quantity;

        const deliveryOption = getDeliveryOption(cartItem.deliveryOptionId);
        shippingPriceCents += deliveryOption.priceCents;
    });
    
    const totalBeforeTaxCents = productPriceCents + shippingPriceCents;
    const TaxCents = totalBeforeTaxCents *0.1;
    const TotalCents = TaxCents + totalBeforeTaxCents;
    const quantity = calculateCartQuantity();

    const paymentSummaryHTML = `
        <div class="payment-summary-title">
            Order Summary
        </div>

        <div class="payment-summary-row">
            <div>Items (${quantity}):</div>
            <div class="payment-summary-money">$${formatCurrency(productPriceCents)}</div>
        </div>

        <div class="payment-summary-row">
            <div>Shipping &amp; handling:</div>
            <div class="payment-summary-money">$${formatCurrency(shippingPriceCents)}</div>
        </div>

        <div class="payment-summary-row subtotal-row">
            <div>Total before tax:</div>
            <div class="payment-summary-money">$${formatCurrency(totalBeforeTaxCents)}</div>
        </div>

        <div class="payment-summary-row">
            <div>Estimated tax (10%):</div>
            <div class="payment-summary-money">$${formatCurrency(TaxCents)}</div>
        </div>

        <div class="payment-summary-row total-row">
            <div>Order total:</div>
            <div class="payment-summary-money">$${formatCurrency(TotalCents)}</div>
        </div>

        <button class="place-order-button button-primary js-place-order">
        Place your order
        </button>
    `;

    document.querySelector('.js-payment-summary')
        .innerHTML = paymentSummaryHTML;

    document.querySelector('.js-place-order')
        .addEventListener('click',async ()=>{
            const cartQuantity = calculateCartQuantity();
            if (cartQuantity > 0){
                try {
                    const response = await fetch('https://supersimplebackend.dev/orders',{
                        method : 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body : JSON.stringify({
                            cart : cart
                        })
                    });
                    const order = await response.json();
                    addOrder(order);
                    resetCart();

                    const toast = document.querySelector('.js-toast');
                    toast.classList.add('show');

                    setTimeout(() => {
                        window.location.href = 'orders.html';
                    }, 2000);
  
                }catch(error){
                    alert('Failed to place order. Please try again later.');
                }
                
            }
            else{
                alert('Add Items to Cart!!!');
                window.location.href = 'amazon.html';
            }  
        }   
    );
}