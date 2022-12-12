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
    console.log(query.data);
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

  totalPagesNumber(total) {
    return (this.totalPages = Math.round(total / this.perPage));
  }
}