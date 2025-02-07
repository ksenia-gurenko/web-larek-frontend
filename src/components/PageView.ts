import { IEvents } from './base/events';
import { Component } from './base/Component';
import { IPageView } from "../types";

// Класс страницы
export class PageView extends Component<IPageView> {
	// Элементы страницы
	private gallery: HTMLElement;
	private content: HTMLElement;

	// Конструктор класса
	constructor(pageContainer: HTMLElement, eventEmitter: IEvents) {
		super(pageContainer);
		this.gallery = pageContainer.querySelector('.gallery');
		this.content = pageContainer.querySelector('.page__wrapper');

	}

	// Сеттер для галереи
	set catalog(elements: HTMLElement[]) {
		this.gallery.replaceChildren(...elements);
	}

	// Сеттер для блокировки страницы
	set locked(value: boolean) {
		if (value) {
			this.content.classList.add('page__wrapper_locked');
		} else {
			this.content.classList.remove('page__wrapper_locked');
		}
	}
}
