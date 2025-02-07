import {
	ICard,
	ICardActions,
	IProductItem,
	IPreviewCard,
	IBasketCard
} from '../types';
import { Component } from './base/Component';
import { IEvents } from './base/events';

// Класс для карточек товаров
export class Card extends Component<ICard> {
	protected element?: HTMLElement | HTMLButtonElement;
	protected events?: IEvents;
	protected cardTitle: HTMLElement;
	protected cardCategory?: HTMLElement | undefined;
	protected cardPrice: HTMLElement;
	protected cardImage?: HTMLImageElement | undefined;
	protected deleteButton?: HTMLButtonElement | undefined;
	protected cardID?: string;

	constructor(
		protected container: HTMLElement,
		events: IEvents,
		actions?: ICardActions
	) {
		super(container);
		this.events = events;
		this.cardTitle = this.container.querySelector('.card__title');
		this.cardCategory = this.container.querySelector('.card__category');
		this.cardPrice = this.container.querySelector('.card__price');
		this.cardImage = this.container.querySelector('.card__image');
	}

	render(data?: Partial<ICard>): HTMLElement;
	render(cardData: Partial<ICard>): HTMLElement;

	render(cardData: Partial<ICard> | undefined) {
		if (!cardData) return this.container;

		const { ...otherCardData } = cardData;
		return super.render(otherCardData);
	}

	set category(value: string) {
		this.setText(this.cardCategory, value);
	}

	set title(value: string) {
		this.setText(this.cardTitle, value);
	}

	set id(value: string) {
		this.container.dataset.id = value;
	}

	set image(value: string) {
		this.setImage(this.cardImage, value);
	}

	set price(value: number | null) {
		const cardPrice = value || 0;
		this.setText(this.cardPrice, `${cardPrice} синапсов`);
	}

	get id(): string {
		return this.cardID;
	}

	deleteCard() {
		this.element.remove();
		this.element = null;
	}
}

// Класс для карточки в каталоге
export class CatalogueCard extends Card {
	constructor(container: HTMLElement, events: IEvents, actions?: ICardActions) {
		super(container, events);
		if (actions && actions.onClick) {
			container.addEventListener('click', actions.onClick);
		}
	}
	render(data?: Partial<ICard>): HTMLElement;
	render(cardData: Partial<ICard>): HTMLElement;

	render(cardData: Partial<ICard> | undefined) {
		if (!cardData) return this.container;

		const { ...otherCardData } = cardData;
		return super.render(otherCardData);
	}
}


// Класс для карточки корзины
export class BasketCard implements IBasketCard {
	public _basketCard: HTMLElement;
	public cardTitle: HTMLElement;
	public cardPrice: HTMLElement;
	public deleteButton: HTMLButtonElement;
	public index: HTMLElement;

	constructor(
		private readonly template: HTMLTemplateElement,
		private readonly events: IEvents,
		actions?: ICardActions
	) {
		this._basketCard = this.template.content
			.querySelector('.basket__item')
			.cloneNode(true) as HTMLElement;
		this.cardTitle = this._basketCard.querySelector('.card__title');
		this.cardPrice = this._basketCard.querySelector('.card__price');
		this.index = this._basketCard.querySelector('.basket__item-index');
		this.deleteButton = this._basketCard.querySelector('.basket__item-delete');

		if (actions && actions.onClick) {
			this.deleteButton.addEventListener('click', actions.onClick);
		}
	}

	protected setPrice(value: number | null): string {
		return value ? `${value} синапсов` : 'Бесценно';
	}

	public render(data: IProductItem, item: number): HTMLElement {
		this.index.textContent = String(item);
		this.cardTitle.textContent = data.title;
		this.cardPrice.textContent = this.setPrice(data.price);

		return this._basketCard;
	}
}

// Класс PreviewCard
export class PreviewCard implements IPreviewCard {
	protected element: HTMLElement;
	protected cardCategory: HTMLElement;
	protected cardTitle: HTMLElement;
	protected cardImage: HTMLImageElement;
	protected cardPrice: HTMLElement;
	protected cardID?: string;
	description: HTMLElement;
	button: HTMLElement;

	constructor(
		template: HTMLTemplateElement,
		protected events: IEvents,
		actions?: ICardActions
	) {
		this.element = template.content
			.querySelector('.card')
			.cloneNode(true) as HTMLElement;
		this.cardCategory = this.element.querySelector('.card__category');
		this.cardTitle = this.element.querySelector('.card__title');
		this.cardPrice = this.element.querySelector('.card__price');
		this.cardImage = this.element.querySelector('.card__image');
		if (actions?.onClick) {
			this.element.addEventListener('click', actions.onClick);
		}

		this.description = this.element.querySelector('.card__text');
		this.button = this.element.querySelector('.card__button');
		this.button.addEventListener('click', () =>
			this.events.emit('card:addBasket')
		);
	}

	// Метод установки текста
	protected setText(element: HTMLElement, value: unknown): string {
		if (element) {
			return (element.textContent = String(value));
		}
	}

	// Геттер для категории
	get category(): string {
		return this.cardCategory.textContent || '';
	}

	// Сеттер для категории
	set category(value: string) {
		this.setText(this.cardCategory, value);
	}

	// Метод установки цены
	protected setPrice(value: number | null): string {
		if (value === null) {
			return 'Бесценно';
		}
		return `${String(value)} синапсов`;
	}

	// Метод обработки отсутствия продажи
	notInSale(data: IProductItem) {
		if (data.price) {
			return 'Купить';
		} else {
			this.button.setAttribute('disabled', 'true');
			return 'Нет в продаже';
		}
	}

	// Метод рендеринга карточки
	render(data: IProductItem): HTMLElement {
		this.cardTitle.textContent = data.title;
		this.cardCategory.textContent = data.category;
		this.description.textContent = data.description;
		this.cardPrice.textContent = this.setPrice(data.price);
		this.cardImage.src = data.image;
		this.cardImage.alt = this.cardTitle.textContent;
		this.button.textContent = this.notInSale(data);
		return this.element;
	}
}
