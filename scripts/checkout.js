import { renderOrderSummary } from "./checkout/orderSummary.js";
import { renderPaymentSummary } from "./checkout/paymentSummary.js";
import { loadProductsFetch } from "../data/products.js";
import { loadCartFetch } from "../data/cart.js";
import { cart } from "../data/cart.js";
//import '../data/car.js';
//import '../data/backend-practice.js';

// if(cart.length === 0){
//     emptyCartMessage.style.display = 'block';
//     viewProductsLink.style.display = 'inline-block';
// }else{
//     emptyCartMessage.style.display = 'none';
//     viewProductsLink.style.display = 'none';
// }

async function loadPage(){
    try{
        await Promise.all([
            loadProductsFetch(),
            loadCartFetch()
        ]);
        
    } catch(error){
        console.log('Unexpected error. Plaese try again later.');
    }
    
    renderOrderSummary();
    renderPaymentSummary();
}
loadPage();
 
/*
Promise.all([
    loadProductsFetch(),
    new Promise ((resolve)=>{
        loadCart(()=>{
            resolve('value 2');
        });
    })
]).then((value)=>{
    console.log(value); 
    renderOrderSummary();
    renderPaymentSummary();
});
*/

/*
new Promise((resolve)=>{
    loadProducts( () =>{
        resolve();
    });

}).then(()=>{
    return new Promise ((resolve)=>{
        loadCart(()=>{
            resolve();
        });
    });

}).then(()=>{
    renderOrderSummary();
    renderPaymentSummary();
});
*/
    
/*
loadProducts(()=>{
    loadCart(()=>{
        renderOrderSummary();
        renderPaymentSummary();
    });
});
*/


