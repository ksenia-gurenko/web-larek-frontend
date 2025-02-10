import { Component } from './base/Component';
import { IEvents } from './base/events';
import { ISuccess, ISuccessActions } from '../types';

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
                this.button.addEventListener('click', () => {
                    actions.onClick();
                    this.onClose(); // Вызываем метод onClose
                });
            }
        }
    }

    set description(value: number) {
        this.setText(this._total, `Списано ${value} синапсов`);
    }

    onClose() {
        this._events.emit('success:close'); // Вызываем событие 'success:close'
    }
}