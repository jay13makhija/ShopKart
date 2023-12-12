// Taking UsersList and ItemsList from local storage
let usersList = JSON.parse(localStorage.getItem("usersList"));
let itemList = JSON.parse(localStorage.getItem("itemsList"));
let searchBar = document.getElementById("searchBar");
let searchSuggestions = document.getElementById("searchSuggestions");
let searchList = [];

// To handle LogIn functionality
const handleLogin = () => {
  let username = document.getElementById("userName");
  let password = document.getElementById("passcode");
  let userFound = false;
  usersList.forEach((element) => {
    user = element.username;
    passcode = element.passcode;
    if (username.value === user && password.value === passcode) {
      userFound = true;
      document.getElementById("invalidName").className = "d-none";
      document.getElementById("userName").className =
        "form-control rounded-pill is-valid";
      document.getElementById("passcode").className =
        "form-control rounded-pill is-valid";
      let login = JSON.stringify(element);
      sessionStorage.setItem("LoggedInUser", login);
      setTimeout((window.location.href = "index.html"), 2000);
      document.getElementById("successAlert").className =
        "alert alert-success mt-2 me-auto ms-auto w-25 justify-content-center d-flex";
    }
  });
  if (userFound == false) {
    document.getElementById("userName").className =
      "form-control rounded-pill is-invalid";
    document.getElementById("passcode").className =
      "form-control rounded-pill is-invalid";
    document.getElementById("invalidName").className =
      "d-block alert alert-danger text-center m-5 mt-3 mb-1";
  }
};

// Taking current loggedin user form session storage
let currentUser = JSON.parse(sessionStorage.getItem("LoggedInUser"));
// Updating current username on profile menu
document.getElementById("profileName").innerHTML += currentUser.name;

// Updating the home page item list according to current users already added to cartlist and wishlist
itemList.forEach((element) => {
  element.Count = 0;
});
for (let index = 0; index < currentUser.cartList.length; index++) {
  const element = currentUser.cartList[index];
  itemList.forEach((element2) => {
    if (element.Id == element2.Id) {
      element2.Count = element.Count;
    }
  });
}

// To handle logout
const handleLogout = () => {
  for (let index = 0; index < usersList.length; index++) {
    let element = usersList[index];
    if (element.username == currentUser.username) {
      element.cartList = currentUser.cartList;
      element.wishList = currentUser.wishList;
    }
  }
  localStorage.setItem("usersList", JSON.stringify(usersList));
  sessionStorage.clear();
  window.location.href = "login.html";
};

// To handle added to wishlist or liked functionality
const handleLiked = (itemId) => {
  listItemAddRemove(itemId, itemList, currentUser.wishList);
  checkItems("wishList" + itemId, itemId);
  sessionStorage.setItem("LoggedInUser", JSON.stringify(currentUser));

  if (searchBar.value == "") {
    searchSuggestions.innerHTML = null;
    renderItems(currentUser.wishList, document.getElementById("wishlistPage"));
    renderItems(currentUser.cartList, document.getElementById("cartPage"));
    renderItems(itemList, document.getElementById("homePage"));
  } else {
    renderItems(searchList, document.getElementById("wishlistPage"));
    renderItems(searchList, document.getElementById("cartPage"));
    renderItems(searchList, document.getElementById("homePage"));
  }
};

// Function to increment item count to cart
function addCartItem(itemId) {
  let itemFound = false;
  for (let index = 0; index < currentUser.cartList.length; index++) {
    const element = currentUser.cartList[index];
    if (element.Id == itemId) {
      itemFound = true;
      element.Count += 1;
      itemList[itemId - 1].Count = element.Count;
      currentUser.wishList.forEach((wishListItem) => {
        if (wishListItem.Id == itemId) {
          wishListItem.Count = element.Count;
        }
      });
    }
  }
  if (itemFound == false) {
    listItemAddRemove(itemId, itemList, currentUser.cartList);
    for (let index = 0; index < currentUser.cartList.length; index++) {
      const element = currentUser.cartList[index];
      if (element.Id == itemId) {
        itemFound = true;
        element.Count += 1;
        itemList[itemId - 1].Count = element.Count;
        currentUser.wishList.forEach((wishListItem) => {
          if (wishListItem.Id == itemId) {
            wishListItem.Count = element.Count;
          }
        });
      }
    }
  }
  localStorage.setItem("itemsList", JSON.stringify(itemList));
  sessionStorage.setItem("LoggedInUser", JSON.stringify(currentUser));

  if (searchBar.value == "") {
    searchSuggestions.innerHTML = null;
    renderItems(currentUser.wishList, document.getElementById("wishlistPage"));
    renderItems(currentUser.cartList, document.getElementById("cartPage"));
    renderItems(itemList, document.getElementById("homePage"));
  } else {
    renderItems(searchList, document.getElementById("wishlistPage"));
    renderItems(searchList, document.getElementById("cartPage"));
    renderItems(searchList, document.getElementById("homePage"));
  }
}

// Function to decrement item count to cart
function removeCartItem(itemId) {
  for (let index = 0; index < currentUser.cartList.length; index++) {
    const element = currentUser.cartList[index];
    if (element.Id == itemId) {
      element.Count -= 1;
      itemList[itemId - 1].Count = element.Count;
      currentUser.wishList.forEach((wishListItem) => {
        if (wishListItem.Id == itemId) {
          wishListItem.Count = element.Count;
        }
      });
      if (element.Count == 0) {
        listItemAddRemove(itemId, itemList, currentUser.cartList);
      }
    }
  }
  localStorage.setItem("itemsList", JSON.stringify(itemList));
  sessionStorage.setItem("LoggedInUser", JSON.stringify(currentUser));

  if (searchBar.value == "") {
    searchSuggestions.innerHTML = null;
    renderItems(currentUser.wishList, document.getElementById("wishlistPage"));
    renderItems(currentUser.cartList, document.getElementById("cartPage"));
    renderItems(itemList, document.getElementById("homePage"));
  } else {
    renderItems(searchList, document.getElementById("wishlistPage"));
    renderItems(searchList, document.getElementById("cartPage"));
    renderItems(searchList, document.getElementById("homePage"));
  }
}

// To handle to Profile menu section
const handleProfileDropDown = () => {
  profilePopUp = document.getElementById("profileDropDown");
  profilePopUp.className == "d-none"
    ? (profilePopUp.className =
        "bg-body-secondary shadow border border-2 border-dark-subtle rounded-5 p-4")
    : (profilePopUp.className = "d-none");
};

// Function to render all items of the provided list
function renderItems(list, divElement) {
  divElement.innerHTML = null;
  divElement.innerHTML =
    "<div class='mt-5 row ps-4 fw-bold fs-5 w-100'>Books <i class='bi bi-book col text-success'></i></div>";
  list.forEach((element) => {
    divElement.innerHTML +=
      '<div class="rounded-3 shadow col-auto m-auto p-4 mt-5 mb-3 pt-1">' +
      '<div class="justify-content-center row mt-3">' +
      '<img src="./assets/images/item-' +
      element.Id +
      '.jpg" id="cardImage" /> </div>' +
      '<div class="row fw-bold fs-4 mt-3 ms-1 me-1" id="cardTitle">' +
      element.Title +
      "</div>" +
      '<div class="row mt-1 mb-3 me-1">' +
      '<div class="col fw-bold fs-5 mt-2">' +
      "<div> Price: <span>" +
      element.Price +
      "</span> </div>" +
      "</div>" +
      '<div class="col-2 mt-2 pe-5">' +
      '<a name="Like ' +
      element.Id +
      '" onClick="handleLiked(' +
      element.Id +
      ')"><i class="bi bi-heart fs-5" name="wishList' +
      element.Id +
      '"></i></a></div>' +
      '<div class="col row bg-secondary-subtle border rounded-pill h-100" name="addToCart"> <div onclick="addCartItem(' +
      element.Id +
      ')"' +
      (element.Count == 0
        ? `<div style="cursor: pointer" class="pt-1 pb-1 p-0 m-0 mt-1 mb-1 fs-6 fw-bold">Add to cart<i class="bi bi-cart4 text-primary ms-1"></i></div>`
        : 'style="cursor: pointer" class="col w-25 fw-bold p-2 me-2"> <i class="bi bi-plus-lg"></i> </div>    <div class="col fw-bold p-2 text-center bg-light" id="cartCount">' +
          element.Count +
          '</div>   <div onclick="removeCartItem(' +
          element.Id +
          ')" style="cursor: pointer" class="col w-25 me-2 fw-bold p-2"> <i class="bi bi-dash-lg"></i> </div> </div>');
  });

  if (list.length == 0) {
    divElement.innerHTML = `<div style="display: flex; align-items: center; height: 90vh"> <div class="alert alert-info offset-3 w-50 text-center" role="alert">
    <i class="bi bi-ban text-primary"></i> No Item Present Here !! <i class="bi bi-ban text-primary"></i>
  </div> </div>`;
  }

  currentUser.wishList.forEach((element) => {
    checkItems("wishList" + element.Id, element.Id);
  });
  updateBadge();
}

// Function to update badge of cart and wishlist
function updateBadge() {
  let cartListCount = 0;
  currentUser.cartList.forEach((element) => {
    cartListCount += element.Count;
  });
  let wishListCount = currentUser.wishList.length;
  document.getElementById("cartListBadge").innerText = cartListCount;
  document.getElementById("wishListBadge").innerText = wishListCount;
}

// To handle to functionality of home page
const handleMainPage = () => {
  renderItems(itemList, document.getElementById("homePage"));
  scroll(0, 0);
};
handleMainPage();

// To handle to functionality of wishlist page
const handleWishPage = () => {
  renderItems(currentUser.wishList, document.getElementById("wishlistPage"));
  scroll(0, 0);
};

// To handle to functionality of cartlist page
const handleCartPage = () => {
  renderItems(currentUser.cartList, document.getElementById("cartPage"));
  scroll(0, 0);
};

// Function to add item to the provided list
function listItemAddRemove(itemIndex, currentList, toList) {
  currentList.forEach((element) => {
    if (element.Id == itemIndex) {
      if (toList.length == 0) {
        toList.push(element);
      } else {
        let isPop = false;
        for (let index = 0; index < toList.length; index++) {
          const element2 = toList[index];
          if (element2.Id == element.Id) {
            toList.splice(index, 1);
            isPop = true;
          }
        }
        if (isPop == false) {
          toList.push(element);
        }
      }
    }
  });

  updateBadge();
}

// Function to check if item is present and mark the icons accordingly
function checkItems(elementId, Id) {
  let itemFound = false;
  currentUser.wishList.forEach((element) => {
    if (element.Id == Id) {
      itemFound = true;
    }
  });
  document.getElementsByName(elementId).forEach((element) => {
    itemFound
      ? (element.className = "bi bi-heart-fill fs-5 text-danger")
      : (element.className = "bi bi-heart fs-5");
  });
}

// Function to insert values to view profile modal
const handleViewProfile = () => {
  document.getElementById("name").innerText = currentUser.name;
  document.getElementById("username").innerText = currentUser.username;
};

// Function to update the data list of input field according to the values searched
function updateDataListSearch() {
  searchSuggestions.innerHTML = null;
  searchList = [];
  itemList.forEach((element) => {
    if (element.Title.toLowerCase().includes(searchBar.value.toLowerCase())) {
      searchSuggestions.innerHTML += `<option value="${element.Title}">`;
      searchList.push(element);
      renderItems(searchList, document.getElementById("wishlistPage"));
      renderItems(searchList, document.getElementById("cartPage"));
      renderItems(searchList, document.getElementById("homePage"));
    }
  });
  if (searchBar.value == "") {
    searchSuggestions.innerHTML = null;
    renderItems(currentUser.wishList, document.getElementById("wishlistPage"));
    renderItems(currentUser.cartList, document.getElementById("cartPage"));
    renderItems(itemList, document.getElementById("homePage"));
  }
}
