import { renderOrderSummary } from "./checkout/orderSummary.js";
import { renderPaymentSummary } from "./checkout/paymentSummary.js";
import { loadProductsFetch, loadProducts } from "../data/products.js";
import { loadCart } from "../data/cart.js";
//import '../data/car.js';
//import '../data/backend-practice.js';


async function loadPage(){
    await loadProductsFetch();

    await new Promise ((resolve)=>{
        loadCart(()=>{
            resolve('value 2');
        });
    });

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
