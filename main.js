let carts= document.querySelectorAll('.add-cart');

//this queryselectorAll selects all the buttons of add cart so it is stotred as a array.
let products = [
    {
        name:'Hiphop hoodie',
        tag:'hod1',
        price:23,
        incart:0

    },
    {
        name:'Black hoodie',
        tag:'hod3',
        price:15,
        incart:0

    },
    {
        name:'Rogue tees',
        tag:'hod5',
        price:20,
        incart:0

    },
    {
        name:'Grey hoodie',
        tag:'hod6',
        price:17,
        incart:0

    }

];
for(let i=0;i<carts.length;i++)
{
    //this is to listen only when add cart button is clicked.
    carts[i].addEventListener('click',() =>{
        cartnumbers(products[i]);
        totalcost(products[i]);
    })
}
//this function is to retain num of items in cart 
function onLoadcartnumbers(){
    let productnumbers=localStorage.getItem('cartnumbers');

    if(productnumbers){
        document.querySelector('.cart span').textContent= productnumbers;
    }

}
//to show num of items in cart
function cartnumbers(product){
    let productnumbers=localStorage.getItem('cartnumbers');
    //because the carnumbers get as a string so we have to parse it to integer to increment items in cart.
    productnumbers=parseInt(productnumbers);
    /*this is to check whether there are other products in cart already if it so we hve to increment num of items 
    in cart, otherwise simply giving value of 1 to cartnumbers..*/

    if( productnumbers )
    {
        localStorage.setItem('cartnumbers',productnumbers+1);
        //updating it to cart span.
        document.querySelector('.cart span').textContent=productnumbers+1;
    }else{
        localStorage.setItem('cartnumbers',1);
        document.querySelector('.cart span').textContent= 1;
    }
    setItems(product);
    
}
//to show which iitems are in the cart

function setItems(product){
    let cartitems = localStorage.getItem('productsincart');
    cartitems = JSON.parse(cartitems);

    if(cartitems != null){
        if(cartitems[product.tag] == undefined)
        {
           cartitems={
            ...cartitems,
            [product.tag]:product
           }
            
        }
        cartitems[product.tag].incart += 1;
    }
    else{
        product.incart=1;

        cartitems ={
            [product.tag]:product
        }
    }
    
    //to parse object in json format.
    localStorage.setItem('productsincart',JSON.stringify(cartitems));
}

//this function is to calculate total cost

function totalcost(product){
    let cartcost= localStorage.getItem('totalcost')
    
    if(cartcost != null){
        cartcost= parseInt(cartcost);
        localStorage.setItem('totalcost',cartcost + product.price);

    }else{
        localStorage.setItem('totalcost',product.price);
    }

    
}

//to display items in cart
function displayCart(){
    let cartItems=localStorage.getItem("productsincart");
    cartItems= JSON.parse(cartItems);
    let productContainer = document.querySelector(".products"); 
    let cartcost= localStorage.getItem('totalcost')
    
    //check whether any elements in cart and it is in the cart page container not in the index page 
    if(cartItems && productContainer){
        productContainer.innerHTML='';
        Object.values(cartItems).map(item =>{
            productContainer.innerHTML +=  `
            <div class="product">
                <ion-button onclick="close()">
                    <ion-icon name="close-circle"></ion-icon>
                </ion-button>
                <img src="./images/${item.tag}.jpg">
                <span>${item.name}</span>
            </div>
            <div class="price">$${item.price},00</div>
            <div class="quantity">
                <ion-button onclick="decrease()">
                     <ion-icon name="arrow-dropleft-circle"></ion-icon>
                </ion-button>
                <span>${item.incart}</span>
                <ion-button onclick="increase()">
                    <ion-icon name="arrow-dropright-circle"></ion-icon>
                </ion-button>
            </div>
            <div class="total">
                $${item.incart * item.price},00
            </div>
            `;
        });
        productContainer.innerHTML += `
            <div class="baskettotalcontainer">
                    <h4 class="baskettotaltitle">
                            Basket Total         :
                    </h4>
                    <h4 class="baskettotal">
                        $${cartcost},00
                    </h4>
            </div>
        `;
    }
}
function close(){
    alert("close");
}



onLoadcartnumbers();
displayCart();