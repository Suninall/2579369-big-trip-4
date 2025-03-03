import { pointEmpty } from '../mock/point.js';
import { destinations } from '../mock/destination.js';
import { formatDateTimeLong } from '../utils.js';
import AbstractView from '../framework/view/abstract-view.js';

function createTripPointEditTemplate({point,pointOffers}){
  const {
    type,cost,dateStart,dateEnd,offers,cityInformation
  } = point;

  const eventTypes = [
    'Taxi',
    'Bus',
    'Train',
    'Ship',
    'Drive',
    'Flight',
    'Check-in',
    'Sightseeing',
    'Restaurant'
  ];

  const TypeElement = eventTypes.map((eventType) => {
    const isChecked = type === eventType ? 'checked' : '';
    return `<div class="event__type-item">
             <input id="event-type-${eventType.charAt(0).toLowerCase() + eventType.slice(1)}-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="${eventType}" ${isChecked}>
             <label class="event__type-label  event__type-label--${eventType.charAt(0).toLowerCase() + eventType.slice(1)}" for="event-type-${eventType.charAt(0).toLowerCase() + eventType.slice(1)}-1">${eventType}</label>
            </div>`;
  }).join('');

  const OfferSelectorsElement = pointOffers.map((offer) => {
    const isChecked = offers.some((offerItem) => offerItem.id === offer.id) ? 'checked' : '';
    return `<div class="event__offer-selector">
              <input class="event__offer-checkbox  visually-hidden" id="event-offer-${offer.type}-${offer.id}" type="checkbox" name="event-offer-${offer.type}" ${isChecked}>
              <label class="event__offer-label" for="event-offer-${offer.type}-${offer.id}">
                <span class="event__offer-title">${offer.title}</span>
                &plus;&euro;&nbsp;
                <span class="event__offer-price">${offer.price}</span>
              </label>
            </div>`;
  }).join('');

  const destinationElement = destinations.map((destin) =>
    `<option value="${destin.cityName}"></option>`
  ).join('');

  const photoImgElement = cityInformation.photos.map((photo) =>
    `<img class="event__photo" src="${photo.src}" alt="${photo.description}">`
  ).join('');

  return`<li class="trip-events__item">
              <form class="event event--edit" action="#" method="post">
                <header class="event__header">
                  <div class="event__type-wrapper">
                    <label class="event__type  event__type-btn" for="event-type-toggle-1">
                      <span class="visually-hidden">Choose event type</span>
                      <img class="event__type-icon" width="17" height="17" src="img/icons/${type}.png" alt="Event type icon">
                    </label>
                    <input class="event__type-toggle  visually-hidden" id="event-type-toggle-1" type="checkbox">

                    <div class="event__type-list">
                      <fieldset class="event__type-group">
                        <legend class="visually-hidden">Event type</legend>
                        ${TypeElement}
                      </fieldset>
                    </div>
                  </div>

                  <div class="event__field-group  event__field-group--destination">
                    <label class="event__label  event__type-output" for="event-destination-1">
                      ${type}
                    </label>
                    <input class="event__input  event__input--destination" id="event-destination-1" type="text" name="event-destination" value="${point.cityInformation.cityName}" list="destination-list-1">
                    <datalist id="destination-list-1">
                      ${destinationElement}
                    </datalist>
                  </div>

                  <div class="event__field-group  event__field-group--time">
                    <label class="visually-hidden" for="event-start-time-1">From</label>
                    <input class="event__input  event__input--time" id="event-start-time-1" type="text" name="event-start-time" value="${formatDateTimeLong(dateStart)}">
                    &mdash;
                    <label class="visually-hidden" for="event-end-time-1">To</label>
                    <input class="event__input  event__input--time" id="event-end-time-1" type="text" name="event-end-time" value="${formatDateTimeLong(dateEnd)}">
                  </div>

                  <div class="event__field-group  event__field-group--price">
                    <label class="event__label" for="event-price-1">
                      <span class="visually-hidden">Price</span>
                      &euro;
                    </label>
                    <input class="event__input  event__input--price" id="event-price-1" type="text" name="event-price" value="${cost || ''}">
                  </div>

                  <button class="event__save-btn  btn  btn--blue" type="submit">Save</button>
                  <button class="event__reset-btn" type="reset">Delete</button>
                  <button class="event__rollup-btn" type="button">
                    <span class="visually-hidden">Open event</span>
                  </button>
                </header>
                <section class="event__details">
                  <section class="event__section  event__section--offers">
                    <h3 class="event__section-title  event__section-title--offers">Offers</h3>

                    <div class="event__available-offers">
                      ${OfferSelectorsElement}
                    </div>
                  </section>

                  <section class="event__section  event__section--destination">
                    <h3 class="event__section-title  event__section-title--destination">Destination</h3>
                    <p class="event__destination-description">${point.cityInformation.description}</p>

                    <div class="event__photos-container">
                      <div class="event__photos-tape">
                        ${photoImgElement}
                      </div>
                    </div>
                  </section>
                </section>
              </form>
            </li>`;
}

export default class TripPointEditView extends AbstractView{
  #point = null;
  #pointOffers = null;
  #onSubmitClick = null;
  #onResetClick = null;

  constructor({point = pointEmpty, onSubmitClick,onResetClick,pointOffers}){
    super();
    this.#point = point;
    this.#pointOffers = pointOffers;
    this.#onSubmitClick = onSubmitClick;
    this.#onResetClick = onResetClick;

    this.element
      .querySelector('.event__reset-btn')
      .addEventListener('click',this.#resetButtonClickHandler);

    this.element
      .querySelector('.event__rollup-btn')
      .addEventListener('click',this.#resetButtonClickHandler);

    this.element
      .querySelector('form')
      .addEventListener('submit',this.#submitFormHandler);
  }

  get template(){
    return createTripPointEditTemplate({
      point: this.#point,
      pointOffers:this.#pointOffers

    });
  }

  #resetButtonClickHandler = (evt) => {
    evt.preventDefault();
    this.#onResetClick();
  };

  #submitFormHandler = (evt) => {
    evt.preventDefault();
    this.#onSubmitClick(this.#point);
  };
}
