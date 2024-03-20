const addedElements = document.querySelector(".added");
const searchInput = document.querySelector(".search-field");
const searchList = document.querySelector(".search-list");
const getReposDebounce = debounce(getRepos, 300);

async function getRepos(user) {
  try {
    const response = await fetch(
      `https://api.github.com/search/repositories?q=${user}`
    );
    if (response.ok) {
      const data = await response.json();

      showSuggestions(data.items.slice(0, 5));
    } else throw new Error("response was not ok");
  } catch (error) {
    console.log(error);
  }
}

function removesuggestions(params) {
  searchList.innerHTML = "";
}

function showSuggestions(repositories) {
  removesuggestions();
  for (let i = 0; i < repositories.length; i++) {
    let name = repositories[i].name;
    let owner = repositories[i].owner.login;
    let stars = repositories[i].stargazers_count;

    let newLi = `<li class="search-item" data-owner="${owner}" data-stars="${stars}">${name}</li>`;
    searchList.innerHTML += newLi;
  }
}

searchInput.addEventListener("input", function () {
  const inputTxt = this.value.trim();
  if (inputTxt === "") {
    searchList.innerHTML = "";
    return;
  }

  getReposDebounce(inputTxt);
});

function addItem(target) {
  addedElements.innerHTML += `<div class='added__element'>Name: ${target.textContent}<br>Owner: ${target.dataset.owner}<br>Stars: ${target.dataset.stars}<button class='btn-close'></button></div>`;
}

searchList.addEventListener("click", function (event) {
  let target = event.target;
  if (!target.classList.contains("search-item")) {
    return;
  }
  addItem(target);
  searchInput.value = "";
  searchList.innerHTML = "";
});

addedElements.addEventListener("click", function (event) {
  let target = event.target;
  if (!target.classList.contains("btn-close")) return;
  target.parentElement.remove();
});

function debounce(fn, timeout) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    return new Promise((resolve) => {
      timer = setTimeout(() => resolve(fn(...args)), timeout);
    });
  };
}

