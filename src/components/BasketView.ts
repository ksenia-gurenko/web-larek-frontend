import { createElement } from '../utils/utils';
import { IEvents } from './base/events';
import { IBasketView } from '../types';

export class BasketView implements IBasketView {
	public basket: HTMLElement;
	public title: HTMLElement;
	public basketPrice: HTMLElement;
	public basketList: HTMLElement;
	public button: HTMLButtonElement;
	public headerBasketButton: HTMLButtonElement;
	public headerBasketCounter: HTMLElement;

	constructor(private template: HTMLTemplateElement, private events: IEvents) {
		this.basket = this.template.content
			.querySelector('.basket')
			.cloneNode(true) as HTMLElement;
		this.title = this.basket.querySelector('.modal__title');
		this.basketPrice = this.basket.querySelector('.basket__price');
		this.headerBasketButton = document.querySelector('.header__basket');
		this.basketList = this.basket.querySelector('.basket__list');
		this.button = this.basket.querySelector('.basket__button');
		this.headerBasketCounter = document.querySelector(
			'.header__basket-counter'
		);
		this.button.addEventListener('click', () => this.events.emit('order:open'));
		this.headerBasketButton.addEventListener('click', () =>
			this.events.emit('basket:open')
		);
	}

	public set items(items: HTMLElement[]) {
		if (items.length > 0) {
			this.basketList.replaceChildren(...items);
			this.button.removeAttribute('disabled');
		} else {
			this.button.setAttribute('disabled', 'disabled');
			this.basketList.replaceChildren(
				createElement<HTMLElement>('p', { textContent: 'Корзина пуста' })
			);
		}
	}

	public renderSummaProducts(summa: number): void {
		this.basketPrice.textContent = `${summa} синапсов`;
	}

	public renderHeaderBasketCounter(value: number): void {
		this.headerBasketCounter.textContent = String(value);
	}

	public render(): HTMLElement {
		this.title.textContent = 'Корзина';
		return this.basket;
	}
}
