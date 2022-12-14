import './sass/index.scss';
import { markup } from './js/markup';
import { refs } from './js/refs';
import APIservice from './js/api';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const ApiService = new APIservice();

refs.form.addEventListener('submit', onFormSubmit);
refs.loadBtn.addEventListener('click', onLoadMoreBtn);

async function onFormSubmit(event) {
  event.preventDefault();
  //before find new results we must clear previous
  clearSearchResults();
  ApiService.query = event.target.searchQuery.value.trim();

  if (ApiService.query === '') {
    clearSearchResults();
    return Notify.info('Write something(*^_^*)');
  }
  //----------------------------FETCHING OUR SEARCH OF PHOTOS-------------------------------
  try {
    let photosData = await ApiService.fetchPosts();
    //totalHits - The number of images accessible through the API.(500)
    ApiService.NumberOfTotalPages(photosData.totalHits);
    //if there are no matches and backend return empty massive
    //(hits is a massive of objects(photos))the length of which is zero - give warning
    if (photosData.hits.length === 0) {
      refs.loadBtn.classList.add('is-hidden');
      return Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
    }
    render(photosData);
    //---------CHECKING FOR ACTIVE OR NOT LOAD-MORE-BUTTON
    if (ApiService.totalPages === 1) {
      refs.loadBtn.classList.add('is-hidden');
    } else {
      refs.loadBtn.classList.remove('is-hidden');
    }
    console.log(ApiService.NumberOfTotalPages(photosData.totalHits));
    console.log(photosData.hits.length);
    console.log(photosData.totalHits);

    //--------TELLING ABOUT SEARCH RESULTS
    Notify.info(`Hooray! We found ${photosData.totalHits} images.`);
  } catch (error) {
    Notify.failure('Something went wrong [*_*]');
  }
}
function render(photosData) {
  const listOfPhotos = photosData.hits.map(markup);
  refs.galleryList.insertAdjacentHTML('beforeend', listOfPhotos.join(''));
}

async function onLoadMoreBtn() {
  ApiService.incrementPage();
  let photosData = await ApiService.fetchPosts();
  if(photosData.hits.length <= photosData.totalHits){
    refs.loadBtn.classList.remove('is-hidden');
  }
  try {
    render(photosData)
  } catch (error){
    Notify.failure('Something went wrong [*_*]');
  }
}

function clearSearchResults() {
  //clearing markup of gallery results
  refs.galleryList.innerHTML = '';
  //start new searches from 1(first) page
  ApiService.resetPage();
}
