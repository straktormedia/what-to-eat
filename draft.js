"use strict";

// SELECTORS

// Config
const API_URL = "https://api.spoonacular.com/recipes/random?number=1&tags=";
const API_KEY = "apiKey=c775252224704fb8a95b9c88ce4a164f";
const ERR_MESSAGE_FILTERS =
  "Oops... The filters you have chosen cannot be combined. Please choose something else.";
const ERR_MESSAGE_LIMIT_API = "You can do it only 150 times a day";

// Dynamic Elements
const foodTitle = document.querySelector(".food-title");
const foodImg = document.querySelector(".food-img");
const recipe = document.querySelector(".recipe");
const selectedFiltersText = document.querySelector(".selected-filters-text");

// Containers
const containerIntro = document.querySelector(".container-intro");
const containerFood = document.querySelector(".container-food");
const containerLoading = document.querySelector(".container-loading");
const containerInfo = document.querySelector(".container-info");
const containerError = document.querySelector(".container-error");
const overlay = document.querySelector("#overlay");

// Boxes
const filterBox = document.querySelector(".filter-box");
const recipeBox = document.querySelector(".recipe-box");
const loading = document.querySelector(".loading");
const infoBox = document.querySelector(".info-box");
const errorText = document.querySelector(".error-text");

// Buttons
const toggleFilters = document.querySelector("#toggle-filters");
const btnChoose = document.querySelector(".btn-choose");
const btnSubmitFilters = document.querySelector(".btn-submit-filters");
const btnRecipe = document.querySelector(".btn-recipe");
const btnAnother = document.querySelector(".btn-another");
const btnClearFilters = document.querySelector(".clear-filters");
const catFull = document.querySelector(".cat-full");

// Filters
const filterCheckbox = document.querySelectorAll(".filter-checkbox");
const checkboxes = document.querySelector('input[type="checkbox"]');
// const searchForm = document.querySelector(".search-form");

// Empty arrays  to collect the selected filters each time
let checkedBoxesArr = [];
let notCheckedBoxesArr = [];
let selectedFilters = [];

// Variables used for API Calls
let response;
let data;

// FUNCTIONS

// Select Filters
const selectFilters = function () {
  const checkedBoxes = document.querySelectorAll(
    "input[type=checkbox]:checked"
  );
  const notCheckedBoxes = document.querySelectorAll(
    "input[type=checkbox]:not(:checked)"
  );

  checkedBoxes.forEach((box) => checkedBoxesArr.push(box.name));
  notCheckedBoxes.forEach((box) => notCheckedBoxesArr.push(box.name));

  // Reset Selected Filters from the previous time
  selectedFilters = [];
  selectedFilters.push(...checkedBoxesArr);

  // Show Selected Filters in UI
  selectedFiltersText.textContent = `Selected Filters: ${selectedFilters}`;

  if (selectedFilters.length < 1) {
    selectedFiltersText.style.display = "none";
    btnClearFilters.style.display = "none";
  } else {
    selectedFiltersText.style.display = "flex";
    btnClearFilters.style.display = "flex";
  }

  checkedBoxesArr = [];
  notCheckedBoxesArr = [];
};

// Reset Filters
const resetFilters = function () {
  const checkedBoxes = document.querySelectorAll("input[type=checkbox]");
  checkedBoxes.forEach((box) => (box.checked = false));
  selectedFilters = [];
  selectedFiltersText.style.display = "none";
  btnClearFilters.style.display = "none";
};

// If it's flex, hide and vice versa
const showHide = function (div) {
  div.style.display === "none"
    ? (div.style.display = "flex")
    : (div.style.display = "none");
  filterBox.style.display === "flex" || infoBox.style.display === "flex"
    ? (overlay.style.display = "flex")
    : (overlay.style.display = "none");
};

// If it's back, put it front and vice versa
const frontBack = function (div) {
  div.style.zIndex < "3" ? (div.style.zIndex = "3") : (div.style.zIndex = "1");
};

// Show Photo Box
const showFood = function () {
  containerFood.style.display = "flex";
  containerIntro.style.display =
    filterBox.style.display =
    containerLoading.style.display =
    containerInfo.style.display =
    overlay.style.display =
      "none";
  selectFilters();
  recipe.innerHTML = "";
  getRandomFoods();

  // searchForm.value.length === 0 ? getRandomFood() : getFoodbyName();
  // searchForm.value = "";
};

// Show Food Info
const showInfo = function () {
  showHide(infoBox);
  showHide(overlay);
};

// Show Loading Box
const showLoading = function () {
  [containerIntro, filterBox, containerFood].forEach(
    (el) => (el.style.display = "none")
  );
  overlay.style.display = "flex";
  containerLoading.style.display = "flex";
  // showHide(containerLoading);
};

// Wait and Show
const waitAndShow = function () {
  showLoading();
  loading.classList.add("leave");
  setTimeout(() => {
    overlay.style.display = "none";
    showFood();
  }, 2300);
};

// Loading SVG
const loadingSVG = function () {
  foodImg.src = "svg/loading-circle.svg";
  foodTitle.textContent = "";
};

// UI
const sucessUI = function () {
  foodTitle.textContent = data.recipes[0].title;
  foodImg.src = data.recipes[0].image;
  data.recipes[0].analyzedInstructions[0].steps.forEach((el, i) => {
    let html = `• ${el.step} <br>`;
    recipe.insertAdjacentHTML("beforeend", html);
    errorText.textContent = "";
  });
};
const wrongFiltersUI = function () {
  containerFood.style.display = "none";
  filterBox.style.display = "flex";
  errorText.classList.remove("hidden");
  errorText.textContent = ERR_MESSAGE_FILTERS;
};

// Fetch
const fetchURL = fetch(`${API_URL}${selectedFilters}&${API_KEY}`);

// ASYNCHRONOUS

//Get random food
const getRandomFoods = async function () {
  //Loading
  loadingSVG();

  //Promise 1
  try {
    response = await fetchURL;
    if (response.status === 402) {
      alert(ERR_MESSAGE_LIMIT_API);
      location.reload();
    }
  } catch (err) {
    console.log(err);
  }

  // Promise 2
  try {
    data = await response.json();
    sucessUI();
  } catch (err) {
    if (data.recipes[0] === undefined) {
      wrongFiltersUI();
      throw new Error(ERR_MESSAGE_FILTERS);
    }
  }
};

// EVENT LISTENERS

btnChoose.addEventListener("click", showFood);
btnAnother.addEventListener("click", showFood);
btnSubmitFilters.addEventListener("click", showFood);

toggleFilters.addEventListener("click", function () {
  showHide(filterBox);
  frontBack(toggleFilters);
  // toggleFilters.style.zIndex = "3";
});
btnRecipe.addEventListener("click", function () {
  // showHide(recipeBox);
  recipeBox.classList.toggle("hidden");
  btnRecipe.style.backgroundColor = recipeBox.classList.contains("hidden")
    ? "#ee7888"
    : "white";
});
btnClearFilters.addEventListener("click", resetFilters);
overlay.addEventListener("click", function () {
  if (filterBox.style.display === "flex" || infoBox.style.display === "flex") {
    filterBox.style.display = "none";
    infoBox.style.display = "none";
    overlay.style.display = "none";
  }
  toggleFilters.style.zIndex = catFull.style.zIndex = "1";
});
catFull.addEventListener("click", function () {
  showHide(infoBox);
  frontBack(catFull);
  // catFull.style.zIndex = "3";
});

/*
//////////////////////////////////////
//Get Food by Search Form
/////////////////////////////////////

let foodID;
const getFoodbyName = function () {
  fetch(
    `https://api.spoonacular.com/recipes/complexSearch?query=${searchForm.value}&apiKey=c775252224704fb8a95b9c88ce4a164f`
  )
    .then(function (response) {
      return response.json();
    })
    .then(function (dataFoodTitle) {
      foodTitle.textContent = dataFoodTitle.results[0].title;
      foodImg.src = dataFoodTitle.results[0].image;

      // console.log(dataFoodTitle.results[0].id);
      foodID = dataFoodTitle.results[0].id;
    });

  setTimeout(() => {
    fetchIt(foodID);
  }, 2300);
};

// Fetch function

const fetchIt = function (ID) {
  fetch(
    `https://api.spoonacular.com/recipes/${ID}/analyzedInstructions?apiKey=c775252224704fb8a95b9c88ce4a164f`
  )
    .then(function (response) {
      return response.json();
    })
    .then(function (dataFoodTitleRecipe) {
      dataFoodTitleRecipe[0].steps.forEach((s) => {
        let html = `• ${s.step} <br>`;
        recipe.insertAdjacentHTML("beforeend", html);
      });
    });
};

*/
