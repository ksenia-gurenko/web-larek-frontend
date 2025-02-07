
import {
	IAppData,
	ICard,
	IOrder,
	IOrderForm,
	IProductItem,
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
	_basket: IProductItem[] = [];
	//каталог
	catalog: ICard[];
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

	constructor(events: IEvents) {
		this.events = events;
		this._productCards = [];
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
	set cards(cards: ICard[]) {
		this.catalog = cards;
		this.events.emit('cards:changed');
	}

	get cards() {
		return this.catalog;
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
		this.events.emit('orderInfo:ready', this.order);
	}

}
