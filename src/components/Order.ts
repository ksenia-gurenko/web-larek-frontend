import { Form } from './common/Form';
import { IOrderForm } from '../types';
import { IEvents } from './base/events';

export class Order extends Form<IOrderForm> {
	protected card: HTMLButtonElement;
	protected cash: HTMLButtonElement;
	button: HTMLButtonElement;
	formErrors: HTMLElement;

	constructor(container: HTMLFormElement, events: IEvents) {
		super(container, events);

		this.card = container.elements.namedItem('card') as HTMLButtonElement;
		this.cash = container.elements.namedItem('cash') as HTMLButtonElement;
		this.button = container.querySelector('order__button');

		if (this.cash) {
			this.cash.addEventListener('click', () => {
				this.cash.classList.add('button_alt-active');
				this.card.classList.remove('button_alt-active');
				this.onInputChange('payment', 'cash');
			});
		}
		if (this.card) {
			this.card.addEventListener('click', () => {
				this.card.classList.add('button_alt-active');
				this.cash.classList.remove('button_alt-active');
				this.onInputChange('payment', 'card');
			});
		}
	}

	set address(value: string) {
		(this.container.elements.namedItem('address') as HTMLInputElement).value =
			value;
	}

}

export class Contacts extends Form<IOrderForm> {
	button: HTMLButtonElement;
	constructor(container: HTMLFormElement, events: IEvents) {
		super(container, events);
		this.button = container.querySelector('button');
	}
	set phone(value: string) {
		(this.container.elements.namedItem('phone') as HTMLInputElement).value =
			value;
	}

	set email(value: string) {
		(this.container.elements.namedItem('email') as HTMLInputElement).value =
			value;
	}

}
