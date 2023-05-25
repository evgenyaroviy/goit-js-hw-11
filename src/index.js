import Notiflix from 'notiflix';
import axios from 'axios';
// Описаний в документації
import SimpleLightbox from "simplelightbox";
// Додатковий імпорт стилів
import "simplelightbox/dist/simple-lightbox.min.css";



const BASE_URL = 'https://pixabay.com/api/';
const API_KEY = '36658431-70b367d2ef8581f2f498a1946';
const parameters = 'image_type=photo&orientation=horizontal&safesearch=true&per_page=40'

const refs = {
  form: document.querySelector('form'),
  input: document.querySelector('input'),
  button: document.querySelector('.btn'),
  buttonMore: document.querySelector('.more-btn'),
  gallery: document.querySelector('.gallery')
}

refs.form.addEventListener('submit', onInput)
refs.buttonMore.addEventListener('click', loadMorePhoto)


function onInput(e) {
  e.preventDefault();
  const params = refs.input.value;
  requestToBeckend(params)
}

function clearList() {
  refs.gallery.innerHTML = '';
}

// let options = {
//     root: null,
//     rootMargin: "400px",
//     threshold: 0,
// };

// let observer = new IntersectionObserver(handlerPagination, options);

// function handlerPagination(entries, observer) {
//   const guard = document.querySelector('.js-guard');
//   const params = refs.input.value;
//   entries.forEach((entry) => {
//         if (entry.isIntersecting) {
//           page += 1;
//           onInput(params)
//               .then(data => {
//                   console.log(data)
//                     refs.gallery.insertAdjacentHTML('beforeend', createCard(data.hitDataResp));
//                     let gallery = new SimpleLightbox('.gallery a');
//                     if (data.total_pages <= data.page) {
//                         observer.unobserve(guard);
//                     }
//                 })
//         }
//     })
// }

async function requestToBeckend(params) {
  clearList()
  try {
    const response = await axios.get(`${BASE_URL}?key=${API_KEY}&q=${params}&${parameters}&${page}`)
    const dataResp = response.data;
    const hitDataResp = response.data.hits;
    console.log(dataResp)
    console.log(hitDataResp)

    searchError(dataResp);
    addCard(hitDataResp);

  } catch (error) {
    Notiflix.Notify.failure('Sorry, there are no images matching your search query. Please try again.');
  };
}
// requestToBeckend()
//     .then(hitDataResp => {
//         refs.gallery.insertAdjacentHTML('beforeend', createCard(hitDataResp));
//         let gallery = new SimpleLightbox('.gallery a');
//         if (data.total_pages > data.page) {
//             observer.observe(guard);
//         }
//     })
//     .catch(err => console.log(err))

function createCard(hitDataResp) {
  console.log(hitDataResp)
  return hitDataResp.map(({ webformatURL, tags, likes, views, comments, downloads, largeImageURL }) => {
    return `
    <div class="photo-card">
    <a href="${largeImageURL}">
  <img src="${webformatURL}" alt="${tags}" loading="lazy" width="400px" height="250px" />
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
  const { total, totalHits, hits } = dataResp;
  if (Number(hits.length) === 0) {
    throw new Error('No results found');
  }
  Notiflix.Notify.success(`Hooray! We found ${dataResp.totalHits} images.`);
  return { total, totalHits, hits };
}



function addCard(hitDataResp) {
  refs.gallery.insertAdjacentHTML('beforeend', createCard(hitDataResp));
  let gallery = new SimpleLightbox('.gallery a');
  gallery.on('show.simplelightbox', function addCard() {
    const { height: cardHeight } = document
      .querySelector(".gallery")
      .firstElementChild.getBoundingClientRect();

    window.scrollBy({
      top: cardHeight * 2,
      behavior: "smooth",
    });
  });
}

function loadMorePhoto(params) {


}

