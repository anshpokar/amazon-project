import { cart,removeFromCart,updateQuantity,calculateCartQuantity,updateDeliveryOption } from "../../data/cart.js";
import { products,getProduct } from "../../data/products.js";
import { formatCurrency } from "../utils/money.js";
import  dayjs  from "https://unpkg.com/supersimpledev@8.5.0/dayjs/esm/index.js";
import { deliveryOptions, getDeliveryOption} from "../../data/deliveryOptions.js";
import { renderPaymentSummary } from "./paymentSummary.js";


export function renderOrderSummary(){
    const emptyMessage = document.querySelector('[data-testid="empty-cart-message"]');
    const viewLink = document.querySelector('[data-testid="view-products-link"]');

    if (cart.length === 0) {
        emptyMessage.style.display = 'block';
        viewLink.style.display = 'inline-block';
        document.querySelector('.js-payment-summary').innerHTML = '';
        return;
    } else {
        emptyMessage.style.display = 'none';
        viewLink.style.display = 'none';
    }

    let cartSummaryHTMl = '';

    cart.forEach((cartItem) => {
        const productId = cartItem.productId;
        // console.log(productId);

        const matchingProduct = getProduct(productId);

        const deliveryOptionId = cartItem.deliveryOptionId;

        const deliveryOption = getDeliveryOption(deliveryOptionId);

        const today = dayjs();
        const deliveryDate =today.add(deliveryOption.deliveryDays,'days');
        const dateString = deliveryDate.format('dddd, MMMM D');

        cartSummaryHTMl += `
        <div class="cart-item-container js-cart-item-container js-cart-item-container-${matchingProduct.id}">
            <div class="delivery-date">
                Delivery date: ${dateString}
            </div>

            <div class="cart-item-details-grid">
                <img class="product-image"
                src="${matchingProduct.image}" alt="${matchingProduct.name}>

                <div class="cart-item-details">
                <div class="product-name">
                    ${matchingProduct.name}
                </div>
                <div class="product-price">
                    ${matchingProduct.getPrice()}
                </div>
                <div class="product-quantity">
                    <span>
                    Quantity: <span class="quantity-label  
                                js-quantity-label-${matchingProduct.id}">
                                ${cartItem.quantity}
                            </span>
                    </span>
                    <span class="update-quantity-link link-primary js-update-link" 
                        data-product-id ="${matchingProduct.id}">
                        Update
                    </span>
                    <input class="quantity-input js-quantity-input-${matchingProduct.id}">
                    <span class="save-quantity-link link-primary js-save-link"
                        data-product-id = "${matchingProduct.id}">
                        Save
                    </span>
                    <span class="delete-quantity-link link-primary js-delete-link" 
                        data-product-id ="${matchingProduct.id}">
                        Delete
                    </span>
                </div>
                </div>

                <div class="delivery-options">
                <div class="delivery-options-title">
                    Choose a delivery option:
                </div>
                ${deliveryOptionHTML(matchingProduct,cartItem)}
                </div>
            </div>
        </div>
        `;
    });

    function deliveryOptionHTML(matchingProduct,cartItem){
        let html = '';

        deliveryOptions.forEach((deliveryOption)=>{
            const today = dayjs();
            const deliveryDate =today.add(deliveryOption.deliveryDays,'days');
            const dateString = deliveryDate.format('dddd, MMMM D');

            const priceString = deliveryOption.priceCents === 0
            ?'FREE'
            : `$${formatCurrency(deliveryOption.priceCents)} -`;

            const isChecked = deliveryOption.id===cartItem.deliveryOptionId;

            html+=`
                <div class="delivery-option js-delivery-option" data-product-id ="${matchingProduct.id}" data-delivery-option-id= "${deliveryOption.id}">
                    <input type="radio"
                    ${isChecked?'checked':''}
                    class="delivery-option-input"
                    name="delivery-option-${matchingProduct.id}">
                    <div>
                    <div class="delivery-option-date">
                        ${dateString}
                    </div>
                    <div class="delivery-option-price">
                        ${priceString} Shipping
                    </div>
                    </div>
                </div>
            `
        });
        return html;
    }

    document.querySelector('.js-order-summary').innerHTML= cartSummaryHTMl;


    document.querySelectorAll('.js-delete-link')
    .forEach((link) =>{
        link.addEventListener('click',()=>{
            const productId=link.dataset.productId;
            removeFromCart(productId);

            const container = document.querySelector(
                `.js-cart-item-container-${productId}`
            );
            container.remove();
            renderPaymentSummary();
            updateCartQuantity();
        });
    });

    document.querySelectorAll('.js-update-link')
    .forEach((link)=>{
        link.addEventListener('click', () =>{
            const productId = link.dataset.productId;
            const container=document.querySelector(
                `.js-cart-item-container-${productId}`
            );
            container.classList.add('is-editing-quantity');
        });
    })

    document.querySelectorAll('.js-save-link')
    .forEach((link) => {
        link.addEventListener('click', () => {
            handleQuantityUpdate(link);
        });

        const productId = link.dataset.productId;
        const quantityInput = document.querySelector(`.js-quantity-input-${productId}`);

        quantityInput.addEventListener('keydown', (event) => {
            if (event.key === 'Enter') {
                handleQuantityUpdate(link);
            }
        });
    });

    function handleQuantityUpdate(link) {
        const productId = link.dataset.productId;

        const quantityInput = document.querySelector(
            `.js-quantity-input-${productId}`
        );

        const newQuantity = parseInt(quantityInput.value.trim(),10);
        if (isNaN(newQuantity) || newQuantity < 1 || newQuantity > 99) {
            alert("Quantity must be between 1 and 99.");
            return;
        }

        if (newQuantity <= 0 || newQuantity >= 100) {
            alert("Quantity should be more than 0 and less than 100");
            return;
        }

        updateQuantity(productId, newQuantity);

        const container = document.querySelector(
            `.js-cart-item-container-${productId}`
        );
        container.classList.remove('is-editing-quantity');

        const quantityLabel = document.querySelector(
            `.js-quantity-label-${productId}`
        );
        quantityLabel.innerHTML = newQuantity;

        updateCartQuantity();
        renderPaymentSummary();
    }
    updateCartQuantity();

    function updateCartQuantity (){
        const cartQuantity = calculateCartQuantity();
        
        document.querySelector('.js-return-to-home-link')
            .innerHTML = `${cartQuantity} items`;
        
    }
    updateCartQuantity();

    document.querySelectorAll('.js-delivery-option')
    .forEach((element)=>{
        element.addEventListener('click',()=>{
            const {productId, deliveryOptionId} = element.dataset
            updateDeliveryOption(productId, deliveryOptionId);
            renderOrderSummary();
            renderPaymentSummary();
        });
    });
}

