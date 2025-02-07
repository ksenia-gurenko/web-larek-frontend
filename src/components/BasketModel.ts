import { IProductItem, IBasketModel } from '../types';

export class BasketModel implements IBasketModel {
	protected _basketProducts: IProductItem[];

	constructor() {
		this._basketProducts = [];
	}

	set basketProducts(data: IProductItem[]) {
		this._basketProducts = data;
	}

	get basketProducts() {
		return this._basketProducts;
	}

	// количество товаров в корзине
	getCounter() {
		return this._basketProducts.length;
	}

	resetCounter() {
		this._basketProducts.length = 0;
	}

	getSummaProducts() {
		let summa = 0;
		this._basketProducts.forEach((item) => {
			summa = summa + item.price;
		});
		return summa;
	}

	// добавить карточку в корзину
	setСard(data: IProductItem) {
		this._basketProducts.push(data);
	}

	// удалить карточку из корзины
	removeCardFromBasket(item: IProductItem) {
		const index = this._basketProducts.indexOf(item);
		if (index >= 0) {
			this._basketProducts.splice(index, 1);
		}
	}

	cleanBasket() {
		this._basketProducts = [];
	}
}
