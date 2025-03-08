import AbstractView from '../framework/view/abstract-view.js';

function createTripFilterItemTemplate(filter,currentFilterType){
  const {type,count} = filter;

  return (
    `<div class="trip-filters__filter">
      <input
      id="filter-${type}"
      class="trip-filters__filter-input  visually-hidden"
      type="radio" name="trip-filter"
      value="${type}"
      ${type === currentFilterType ? 'checked' : ''}
      ${count === 0 ? 'disabled' : ''}
      >
      <label class="trip-filters__filter-label"
       for="filter-${type}">${type.charAt(0).toUpperCase() + type.slice(1)}</label>
    </div>`
  );
}

function createTripFilterTemplate(filterItems, currentFilterType){
  const filterItemsTemplate = filterItems
    .map((filter) => createTripFilterItemTemplate(filter, currentFilterType))
    .join('');

  return (
    `<form class="trip-filters" action="#" method="get">
        ${filterItemsTemplate}
        <button class="visually-hidden" type="submit">Accept filter</button>
      </form>`
  );
}
export default class TripFiltersView extends AbstractView {
  #filters = null;
  #currentFilter = null;
  #handleFilterTypeChange = null;

  constructor({filters, currentFilterType, onFilterTypeChange}) {
    super();
    this.#filters = filters;
    this.#currentFilter = currentFilterType;
    this.#handleFilterTypeChange = onFilterTypeChange;

    this.element.addEventListener('change', this.#filterTypeChangeHandler);
  }

  get template(){
    return createTripFilterTemplate(this.#filters, this.#currentFilter);
  }

  #filterTypeChangeHandler = (evt) => {
    evt.preventDefalt();
    this.#handleFilterTypeChange(evt.target.value);
  };
}
