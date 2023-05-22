import './css/styles.css';
import { fetchCountries } from "./fetchCountries";
import Notiflix from 'notiflix';
var debounce = require('lodash.debounce');

const DEBOUNCE_DELAY = 300;

const inputRef = document.querySelector('#search-box');
const listRef = document.querySelector('.country-list');
const infoRef = document.querySelector('.country-info');

inputRef.addEventListener('input', debounce(onInputValue, DEBOUNCE_DELAY))

function onInputValue(e) {
  const name = inputRef.value.trim();
  clearList()
  if (Number(name.length) === 0) {
    clearList();
    return;
  } if (Number(name.length) >= 1) {
    fetchCountries(name)
      .then(data => {
        if (data.status === 404) {
          throw new Error();
        }
        console.log(data)
        return data;
      })
      .then(addCard)
      .catch((error) => {
        Notiflix.Notify.failure('Oops, there is no country with that name');;
      });;
  }

}

function createList(arr) {
  return arr.map(({ name: { official }, flags: { png } }) => {
    return `
      <li>
        <img src="${png}" alt="${official}" width = "40px" height = "20px">
        <p>${official}</p>
      </li >
  `;
  }).join('');
}

function createCard(arr) {
  return arr.map(({ name: { official }, capital, population, flags: { png }, languages }) => {
    const language = Object.values(languages)
    return `
    <div class = "card-title">
        <img src="${png}" alt="${official}"width = "60px" height = "30px">
        <h2>${official}</h2>
    </div>
        <p><span class = "card-info">Capital:</span> ${capital}</p>
        <p><span class = "card-info">Population:</span> ${population}</p>
        <p><span class = "card-info">Languages:</span> ${language}</p >
  `;
  }).join('');
}

function addCard(data) {
  if (data.length > 10 || data.length < 1) {
    Notiflix.Notify.info('Too many matches found. Please enter a more specific name.');
    return;
  } if (data.length > 2 || data.length <= 10) {
    clearList()
    listRef.insertAdjacentHTML('beforeend', createList(data));
  } if (data.length === 1) {
    clearList()
    infoRef.insertAdjacentHTML('beforeend', createCard(data));
  }
}

function clearList() {
  infoRef.innerHTML = '';
  listRef.innerHTML = '';
}


