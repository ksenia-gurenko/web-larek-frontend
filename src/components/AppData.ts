
import {
	IAppData,
	ICard,
	IOrder,
	IOrderForm,
	IProductItem,
	ValidationErrors
} from '../types';
import { IEvents } from './base/events';



export class Product implements IProductItem {
	id: string;
	price: number | null;
	title: string;
	category: string;
	description: string;
	image: string;
	selected: boolean;
}

export class AppData implements IAppData {
	protected _productCards: IProductItem[];
	//выбранная карточка
	selectedСard: IProductItem;
    _basketProducts: IProductItem[];
	//каталог
	_catalog: ICard[];
	card: ICard;
	//заказ
	order: IOrder = {
		email: '',
		phone: '',
		address: '',
		payment: '',
		items: [],
        total: 0
	};
	events: IEvents;
	validationErrors: ValidationErrors = {};

	constructor(events: IEvents) {
		this.events = events;
		this._productCards = [];
		this._basketProducts = [];
	}
	private _items: ICard[] = [];
	public get items(): ICard[] {
		return this._items;
	}

	public setItems(items: ICard[]): void {
		this._items = items;
	}

	public getProduct(id: string): ICard | undefined {
		return this.items.find((item) => item.id === id);
	}

	//карточки
	set catalog(cards: ICard[]) {
		this._catalog = cards;
		this.events.emit('cards:changed');
	}

	get catalog() {
		return this._catalog;
	}

	set productCards(data: IProductItem[]) {
		this._productCards = data;
		this.events.emit('productCards:receive');
	}

	get productCards() {
		return this._productCards;
	}

	//выбор карточки
	setPreview(item: IProductItem) {
		this.selectedСard = item;
		this.events.emit('modalCard:open', item);
	}

	//поля заказа 
	setOrderField(field: keyof IOrderForm, value: string) {
		this.order[field] = value;
		//this.events.emit('orderInfo:ready', this.order);
		if (this.validateContactsForm()) {
			this.events.emit('contacts:ready', this.order)
		  }
		  if (this.validateOrderForm()) {
			this.events.emit('order:ready', this.order);
		  }
	}

	//ниже классы для данных корзины

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

	getOrder(): IOrder {
        return this.order;
    }

	validateContactsForm() {
		const errors: typeof this.validationErrors = {};
		if (!this.order.email) {
		  errors.email = 'Поле "email" обязательно для заполнения';
		}
		if (!this.order.phone) {
		  errors.phone = 'Поле "телефон" обязательно для заполнения';
		}
		this.validationErrors = errors;
		this.events.emit('contactsValidation:change', this.validationErrors);
		return Object.keys(errors).length === 0;
	  }
	
	  validateOrderForm() {
		const errors: typeof this.validationErrors = {};
		if (!this.order.address) {
		  errors.address = 'Поле "адрес" обязательно для заполнения';
		}
		if (!this.order.payment) {
		  errors.payment = 'Поле "способ оплаты" обязательно для заполнения';
		}
		this.validationErrors = errors;
		this.events.emit('orderValidation:change', this.validationErrors);
		return Object.keys(errors).length === 0;
	  }
	
	}