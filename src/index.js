import Notiflix from 'notiflix';
import axios from 'axios';
// Описаний в документації
import SimpleLightbox from "simplelightbox";
// Додатковий імпорт стилів
import "simplelightbox/dist/simple-lightbox.min.css";

const BASE_URL = 'https://pixabay.com/api/';
const API_KEY = '36658431-70b367d2ef8581f2f498a1946';
const parameters = 'image_type=photo&orientation=horizontal&safesearch=true&per_page=40'
let page = 1;
const refs = {
  form: document.querySelector('form'),
  input: document.querySelector('input'),
  button: document.querySelector('.btn'),
  buttonMore: document.querySelector('.more-btn'),
  gallery: document.querySelector('.gallery'),
}

refs.form.addEventListener('submit', onInput);
refs.buttonMore.addEventListener('click', loadMorePhoto);

function onInput(e) {
  e.preventDefault();
  const params = refs.input.value;
  console.log(params)
  requestToBeckend(params)
}

function clearList() {
  refs.gallery.innerHTML = '';
}

async function requestToBeckend(params) {
  console.log(params)
  clearList()
  try {
    const response = await axios.get(`${BASE_URL}?key=${API_KEY}&q=${params}&${parameters}&${page}`)
    const dataResp = response.data;
    // const hitDataResp = response.data.hits;
    // console.log(dataResp)
    // console.log(hitDataResp.length)

    searchError(dataResp);
    addCard(dataResp.hits);
    if (Number(dataResp.hits.length) >= 40) {
      refs.buttonMore.classList.remove("is-hidden");
    }
  } catch (error) {
    Notiflix.Notify.failure('Sorry, there are no images matching your search query. Please try again.');
  };
}

function createCard(hitDataResp) {
  // console.log(hitDataResp)
  return hitDataResp.map(({ webformatURL, tags, likes, views, comments, downloads, largeImageURL }) => {
    return `
    <div class="photo-card">
    <a href="${largeImageURL}">
  <img src="${webformatURL}" alt="${tags}" loading="lazy"/>
  </a>
  <div class="info">
    <p class="info-item">
      <b>Likes</b>
      ${likes}
    </p>
    <p class="info-item">
      <b>Views</b>
      ${views}
    </p>
    <p class="info-item">
      <b>Comments</b>
      ${comments}
    </p>
    <p class="info-item">
      <b>Downloads</b>
      ${downloads}
    </p>
  </div>
</div>
  `;
  }).join('');
}

function searchError(dataResp) {
  const { totalHits, hits } = dataResp;
  // console.log({ totalHits, hits })
  if (Number(hits.length) === 0) {
    throw new Error('No results found');
  }
  Notiflix.Notify.success(`Hooray! We found ${dataResp.totalHits} images.`);
  return { totalHits, hits };
}

function addCard(hitDataResp) {
  // console.log(hitDataResp)
  refs.gallery.insertAdjacentHTML('beforeend', createCard(hitDataResp));
  let gallery = new SimpleLightbox('.gallery a');
  gallery.on('show.simplelightbox', function addCard() {
  });
}

async function loadMorePhoto() {
  try {
    page += 1;
    const params = refs.input.value;
    const response = await axios.get(`${BASE_URL}?key=${API_KEY}&q=${params}&${parameters}&page=${page}`);
    const dataResp = response.data;
    const hitDataResp = response.data.hits;
    refs.gallery.insertAdjacentHTML('beforeend', createCard(hitDataResp));
    onScroll()
    let gallery = new SimpleLightbox('.gallery a');
    gallery.refresh();
    if (refs.gallery.childElementCount >= dataResp.totalHits) {
      refs.buttonMore.classList.add("is-hidden");
      Notiflix.Notify.failure(`We're sorry, but you've reached the end of search results.`);
    }
  } catch (error) {
    console.log(error);
  }
}

function onScroll() {
  const { height: cardHeight } = document.querySelector(".gallery")
    .firstElementChild.getBoundingClientRect();

  window.scrollBy({
    top: cardHeight * 2,
    behavior: "smooth",
  });
}