import { Component } from './base/Component';
import { IEvents } from './base/events';
import { ISuccess, ISuccessActions } from "../types";

export class Success extends Component<ISuccess> {
	protected button: HTMLButtonElement;
	protected _total: HTMLElement;
	_events: IEvents;

	constructor(
		container: HTMLElement,
		actions?: ISuccessActions,
		events?: IEvents
	) {
		super(container);

		this._events = events;
		this.button = container.querySelector('.order-success__close');
		this._total = container.querySelector('.order-success__description');

		if (actions?.onClick) {
			if (this.button) {
				this.button.addEventListener('click', actions.onClick);
			}
		}
	}

	set description(value: number) {
		this._total.textContent = String(`Списано ${value} синапсов`);
	}
}
