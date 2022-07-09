import View from './view';
import icon from 'url:../../img/icons.svg';

class PaginationView extends View {
  _parentElement = document.querySelector('.pagination');

  addHandlerPagination(handler) {
    this._parentElement.addEventListener('click', function (e) {
      const btn = e.target.closest('.btn--inline');
      if (!btn) return;
      const goto = +btn.dataset.goto;
      console.log(goto);
      handler(goto);
    });
  }
  _generateMarkup() {
    const numPages = Math.ceil(
      this._data.results.length / this._data.resultsPerPage
    );
    if (numPages === this._data.page && numPages == 1) return '';
    if (numPages === this._data.page) return this._generateMarkupPrev();
    if (this._data.page === 1) return this._generateMarkupNext();
    return this._generateMarkupPrev() + this._generateMarkupNext();
  }
  _generateMarkupPrev() {
    return `
        <button data-goto="${
          this._data.page - 1
        }" class="btn--inline pagination__btn--prev">
            <svg class="search__icon">
              <use href="${icon}#icon-arrow-left"></use>
            </svg>
            <span>Page ${this._data.page - 1}</span>
        </button>
    `;
  }
  _generateMarkupNext() {
    return `
        <button data-goto="${
          this._data.page + 1
        }" class="btn--inline pagination__btn--next">
            <span>Page ${this._data.page + 1}</span>
            <svg class="search__icon">
              <use href="${icon}#icon-arrow-right"></use>
            </svg>
        </button>
    `;
  }
}

export default new PaginationView();
