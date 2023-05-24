import Notiflix from 'notiflix';


const BASE_URL = 'https://pixabay.com/api/';
const API_KEY = '36658431-70b367d2ef8581f2f498a1946';
const parameters = 'image_type=photo&orientation=horizontal&safesearch=true&per_page=40'
const refs = {
    form: document.querySelector('form'),
    input: document.querySelector('input'),
    button: document.querySelector('button'),
    gallery: document.querySelector('.gallery')
}

refs.form.addEventListener('submit', onInput)


function onInput(e) {
    e.preventDefault();
    const params = refs.input.value;
    requestToBeckend(params)
    console.log(params);
    // return params;
}

function requestToBeckend(params) {
    return fetch(`${BASE_URL}?key=${API_KEY}&q=${params}&${parameters}`)
    .then((response) => {
      if (!response.ok) {
        throw new Error(response.statusText)
      } 
      return response.json();
    })
      .then(searchError)
      .then(addCard)
    // .catch((error) => {
    //     Notiflix.Notify.failure('Sorry, there are no images matching your search query. Please try again.');
    //   });
}

function searchError(response) {
  const { total, totalHits, hits } = response;
  console.log(hits.length)
    if (Number(hits.length) === 0) {
        throw new Error('No results found');
      }
      return { total, totalHits, hits };
    }

    function createCard(hits) {
  return hits.map(({ webformatURL, tags, likes, views, comments, downloads }) => {
    return `
    <div class="photo-card">
  <img src="${webformatURL}" alt="${tags}" loading="lazy" />
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

function addCard(data) {
  return refs.gallery.insertAdjacentHTML('beforeend', createCard(data));
}