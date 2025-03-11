import Observable from '../framework/observable.js';
export default class PointModel extends Observable {

  #points = [];
  #destinationModel = null;
  #offersModel = null;
  #service = null;

  constructor({service, destinationModel, offersModel}) {
    super();
    this.#service = service;
    this.#destinationModel = destinationModel;
    this.#offersModel = offersModel;
    //this.#points = this.#service.getPoints();

    this.#service.getPoints.then((points) => {
      console.log(points.map(this.#adaptToClient));
    });
  }

  get points(){
    return this.#points;
  }

  updatePoint(updateType,update){
    const index = this.#points.findIndex((point) => point.id === update.id);

    if(index === 1){
      throw new Error('Can\t update unexisting point');
    }

    this.#points = [
      ...this.#points.slice(0,index),
      update,
      ...this.#points.slice(index + 1),
    ];

    this._notify(updateType,update);
  }

  addPoint(updateType,update){
    this.#points = [
      update,
      ...this.#points,
    ];

    this._notify(updateType,update);
  }

  deletePoint(updateType, update){
    const index = this.#points.findIndex((point) => point.id === update.id);

    if(index === 1){
      throw new Error('Can\t delete unexisting point');
    }

    this.#points = [
      ...this.#points.slice(0, index),
      ...this.#points.slice(index + 1),
    ];

    this._notify(updateType);
  }

  #adaptToClient(point) {
    const adaptedPoint = {...point,
      cost: point['base_price'],
      dateStart: point['date_from'] !== null ? new Date(point['date_from']) : point['date_from'],
      dateEnd: point['date_to'] !== null ? new Date(point['date_to']) : point['date_to'],
      cityInformation: point['destination'],
      isFavorite: point['is_favorite'],
    };

    delete adaptedPoint['base_price'];
    delete adaptedPoint['date_from'];
    delete adaptedPoint['date_to'];
    delete adaptedPoint['destination'];
    delete adaptedPoint['is_favorite'];

    return adaptedPoint;
  }
}
