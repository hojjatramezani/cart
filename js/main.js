
const partProducts = document.querySelector('.part-products');
const drawerCaartItem = document.querySelector('.drawer-cart-item');
const cartNumber = document.querySelector('.cart-number');
const drawerCartItem = document.querySelector('.drawer-cart-item');

let cart = [];

class Products {

    async getProductJSON() {
        try {
            const result = await fetch('/products.json');
            const data = await result.json();

            let products = data.items;

            products = products.map((item) => {
                const id = item.sys.id;
                const { title, price } = item.fields;
                const image = item.fields.image.fields.file.url;
                return { id, title, price, image };
            });
            return products;
        }
        catch {
            console.log("Error: can not get json");
        }
    }

}
class View {
    printProducts(data) {
        console.log(data);
        let result = '';
        data.forEach((item) => {
            result += `
                <div class="w-72 rounded-sm shadow-lg mb-10">
                    <img src=${ item.image } class="w-full h-64 object-cover" />
                    <div class="px-3 py-1 flex justify-right">${ item.title }</div>
                    <div class="px-3 py-1 flex justify-between">
                        <div class="">price: </div>
                        <div class="">$${ item.price }</div>
                    </div>
                    <div class="px-3 pt-3 pb-2 flex justify-between">
                        <button data-id=${ item.id } class="btn-buy rounded-md px-3 py-2 bg-cyan-500 w-40">BUY</button>
                    </div>
                </div>
            `;

        });
        partProducts.innerHTML = result;
    }
    cartNumber() {
        cartNumber.innerHTML = cart.length;
    }
    getCartButtons() {
        const buttons = [...document.querySelectorAll('.btn-buy')];
        buttons.forEach((item) => {
            const id = item.dataset.id;
            item.addEventListener('click', (event) => {
                cart = [...cart, { ...Storage.getLocalStorage(id), amount: 0 }];
                console.log(cart);
                this.cartNumber();
                Storage.saveCartToLocalstorage(cart);
                this.printCartItem(cart);
            });
        });
    }
    printCartItem(data) {
        let result = '';
        data.forEach((item) => {
            result += `
                    <div class="flex justify-between px-4 py-2 border-b">
                    <div class="flex justify-left">
                        <div class="flex-col justify-center">
                            <img src=${ item.image } class="w-14 h-14 object-cover" />
                            <button data-id=${ item.id } class="rounded-sm px-1 text-white bg-red-400 text-sm w-14">delele</button>
                        </div>
                        <div class="pl-4">
                            <p>${ item.title }</p>
                            <p>price: ${ item.price }$</p>
                        </div>

                    </div>
                    <div class="flex-col justify-center">

                        <svg data-id=${ item.id } xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 cursor-pointer plus-item" viewBox="0 0 20 20" fill="currentColor">
                            <path fill-rule="evenodd" d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z" clip-rule="evenodd" />
                        </svg>

                        <p class="text-center">${ item.amount }</p>

                        <svg data-id=${ item.id } xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 cursor-pointer" viewBox="0 0 20 20" fill="currentColor">
                            <path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd" />
                        </svg>

                    </div>
                </div>
            `;
            drawerCaartItem.innerHTML = result;
        });
    }

    drawerCartItem(){
        drawerCartItem.addEventListener('click', (event) => {
            let detailsItem = event.target
            let id = detailsItem.dataset.id

        })
    }
    


}
class Storage {
    saveToLocalstorage(products) {
        localStorage.setItem('products', JSON.stringify(products));
    }
    static getLocalStorage(id) {
        const products = JSON.parse(localStorage.getItem('products'));
        return products.find(item => item.id === id);
    }
    static saveCartToLocalstorage(cart) {
        localStorage.setItem('cart', JSON.stringify(cart));
    }
    checkLocalstorage() {
        const localstorageValue = localStorage.getItem('cart');
        if (Boolean(localstorageValue)) {
            cart = JSON.parse(localStorage.getItem('cart'));
        }
    }
}


document.addEventListener('DOMContentLoaded', () => {

    const view = new View();
    const products = new Products();
    const storage = new Storage();

    storage.checkLocalstorage();

    products.getProductJSON().then((data) => {
        storage.saveToLocalstorage(data);
        view.printProducts(data);
        view.cartNumber();
    }).then(() => {
        view.getCartButtons();
        view.printCartItem(cart);
        view.drawerCartItem();
    });





});