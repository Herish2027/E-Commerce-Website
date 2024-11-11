let cartData = JSON.parse(localStorage.getItem("cartData")) || []; // Load the cart data from localStorage or initialize it as an empty array
if (localStorage.getItem('authToken')) {
  const account = document.getElementById('account');
  if (account) account.style.display = 'none';
  const navIcons = document.querySelector('.nav-icons');

  const profileLink = document.createElement('a');
  const pRound = document.createElement('div');
  pRound.classList.add('p-round');
  const pData = document.createElement('p');
  pData.id = 'p-data';
  const userData = JSON.parse(localStorage.getItem('userData'));
  pData.textContent = userData ? userData[0] : 'User'; 

  
  pRound.appendChild(pData);

 
  profileLink.appendChild(pRound);
  const usernameSpan = document.createElement('span');
  usernameSpan.id = 'username';
  usernameSpan.textContent = userData.length>6?userData.slice(0,6)+'...':userData;
  profileLink.appendChild(usernameSpan);
  navIcons.appendChild(profileLink);
  const logoutButton = document.createElement('button');
  logoutButton.id = 'logout';
  logoutButton.type = 'submit';
  logoutButton.textContent = 'Logout';
  logoutButton.addEventListener('click', function(e) {
    e.preventDefault();
    localStorage.removeItem('authToken'); 
    window.location.href = 'http://127.0.0.1:5500/client/landingPage.html'; 
  });
  navIcons.appendChild(logoutButton);
}

const product_container = document.querySelector(".product-grid");

async function loadRingsData() {
  try {
    // Fetch the data from the JSON file
    const ringsdata = await fetch("./bracelets.json").then((res) => res.json());

    product_container.innerHTML = ringsdata
      .map((x) => {
        const cartItem = cartData.find((item) => item.id === x.id) || {
          quantity: 0,
        };
        return `<div class="product-card" id="product-id-${x.id}">
          <div class="img">
            <img src="${x.img}" />
          </div>
          <div class="info">
            <h4>${x.name}</h4>
            <p>₹${x.price}</p>
          </div>
          <div class="cartwrapper">
            <div class="addToCart" id="quantity-controls">
              <button onclick="decrement('${x.id}')"><i class="bi bi-dash-lg"></i></button>
              <span id="${x.id}" class="hello">${cartItem.quantity}</span>
              <button onclick="increment('${x.id}')"><i class="bi bi-plus-lg"></i></button>
            </div>
            <div class="clickToAdd hidden">
              <button id="add-to-cart-btn">Add To Cart</button>
            </div>
          </div>
        </div>`;
      })
      .join("");
  } catch (error) {
    console.error("Failed to load the ring data:", error);
  }
}

let increment = (id) => {
  let search = cartData.find((x) => x.id === id);
  if (search === undefined) {
    cartData.push({
      id: id,
      quantity: 1,
    });
  } else {
    search.quantity += 1;
  }
  updateQuantityDisplay(id);
  localStorage.setItem("cartData", JSON.stringify(cartData));
  if(localStorage.getItem('authToken')){
    calculateCartIcon();
  }
};

let decrement = (id) => {
  let search = cartData.find((x) => x.id === id);
  if (search === undefined || search.quantity === 0) return;

  search.quantity -= 1;

  if (search.quantity <= 0) {
    cartData = cartData.filter((x) => x.id !== id);
  }
  
  updateQuantityDisplay(id);
  localStorage.setItem("cartData", JSON.stringify(cartData));
  if(localStorage.getItem('authToken')){
    calculateCartIcon();
  }
};

let updateQuantityDisplay = (id) => {
  let quantitySpan = document.getElementById(id);
  let search = cartData.find((x) => x.id === id);
  quantitySpan.innerHTML = search ? search.quantity : 0;
};

function calculateCartIcon() {
  let cartIcon = document.getElementById('cart-icon');
  cartIcon.innerText = cartData.reduce((total, item) => total + item.quantity, 0);
}

window.onload = loadRingsData;
