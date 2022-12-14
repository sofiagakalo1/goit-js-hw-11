import axios from 'axios';
import { refs } from './refs';

const API_KEY = '32028238-0a619196cedefed84fa876d4b';
const BASE_URL = 'https://pixabay.com/api/';
const searchParametrs =
  'image_type=photo&orientation=horizontal&safesearch=true';

export default class APIservice {
  constructor() {
    this.page = 1;
    this.perPage = 40;
    this.searchQuery = '';
    this.totalPages = 0;
  }

  async fetchPosts() {
    const query = await axios.get(
      `${BASE_URL}?key=${API_KEY}&q=${this.searchQuery}&${searchParametrs}&per_page=${this.perPage}&page=${this.page}`
    );
    return await query.data;
  }

  incrementPage() {
    this.page += 1;
  }

  resetPage() {
    this.page = 1;
  }

  get query() {
    return this.searchQuery;
  }

  set query(newQuery){
    return this.searchQuery = newQuery;
  }
  //У відповіді бекенд повертає властивість totalHits - загальна кількість зображень,
  // які відповідають критерію пошуку (totalHits=total)
  NumberOfTotalPages(total){
    return (this.totalPages = Math.ceil(total/this.perPage));
  }
}
