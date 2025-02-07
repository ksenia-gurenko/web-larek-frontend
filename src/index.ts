import '../src/scss/styles.scss';

import { EventEmitter } from './components/base/events';
import './scss/styles.scss';
import { BasketModel } from './components/BasketModel';
import { BasketView } from './components/BasketView';
import {
	IOrderForm,
	CatalogChangeEvent,
	IProductItem,
    ISuccessActions
} from './types';
import { NewAPI } from './components/NewApi';
import { API_URL, CDN_URL } from './utils/constants';
import { Modal, IModalData } from './components/common/Modal';
import {
	BasketCard,
	CatalogueCard,
	PreviewCard,
} from './components/Card';
import { PageView } from './components/PageView';
import { AppData } from './components/AppData';
import { Order, OrderStep2 } from './components/Order';
import { Success } from './components/Success';
import { cloneTemplate } from './utils/utils';

const events = new EventEmitter();
const api = new NewAPI(CDN_URL, API_URL);

// Чтобы мониторить все события, для отладки
events.onAll(({ eventName, data }) => {
	console.log(eventName, data);
});

// Все шаблоны
const cardTemplate: HTMLTemplateElement = document.getElementById(
	'card-catalog'
) as HTMLTemplateElement;
const cardCatalogTemplate: HTMLTemplateElement = document.getElementById(
	'card-catalog'
) as HTMLTemplateElement;
const previewCardTemplate: HTMLTemplateElement = document.getElementById(
	'card-preview'
) as HTMLTemplateElement;
const cardBasketTemplate: HTMLTemplateElement = document.getElementById(
	'card-basket'
) as HTMLTemplateElement;
const basketTemplate: HTMLTemplateElement = document.getElementById(
	'basket'
) as HTMLTemplateElement;
const contactsTemplate: HTMLTemplateElement = document.getElementById(
	'contacts'
) as HTMLTemplateElement;
const orderTemplate: HTMLTemplateElement = document.getElementById(
	'order'
) as HTMLTemplateElement;
const successTemplate = document.getElementById(
	'success'
) as HTMLTemplateElement;

// Модель данных приложения
const appData = new AppData( events);

// Глобальные контейнеры
const page = new PageView(document.body, events);
const modalContainer = document.getElementById('modal-container');
const modal = new Modal(modalContainer, events);

// Остальное
const basketView = new BasketView(basketTemplate, events);
const basketModel = new BasketModel();
const order = new Order(cloneTemplate(orderTemplate), events);
const orderStep2 = new OrderStep2(cloneTemplate(contactsTemplate), events);
class CustomEventEmitter extends EventEmitter {
	onClick() {
		console.log('Click by CustomEventEmitter');
		modal.close();
		basketModel.resetCounter();
		basketModel.cleanBasket();
		basketView.renderHeaderBasketCounter(basketModel.getCounter());
		basketView.render();
		basketView.renderHeaderBasketCounter;
	}
}
const customEvents = new CustomEventEmitter();
const successActions: ISuccessActions = {
	onClick: customEvents.onClick.bind(customEvents),
};
const success = new Success(cloneTemplate(successTemplate), successActions);

// Дальше идет бизнес-логика
// Поймали событие, сделали что нужно

// Получаем товары с сервера
api
	.getProductList()
	.then((data) => {
		appData.cards = data;
	})
	.catch((err) => {
		console.error(err);
	});

events.on('cards:changed', () => {
	console.log(appData.cards);
	page.catalog = appData.catalog.map((item) => {
		const card = new CatalogueCard(cloneTemplate(cardCatalogTemplate), events, {
			onClick: (event) => events.emit('card:select', item),
		});
		return card.render({
			title: item.title,
			image: item.image,
			description: item.description,
			id: item.id,
			category: item.category,
			price: item.price,
		});
	});
});

// Блокируем прокрутку страницы если открыта модалка
events.on('modal:open', () => {
	page.locked = true;
});

// ... и разблокируем
events.on('modal:close', () => {
	page.locked = false;
});

// Изменились элементы каталога
events.on<CatalogChangeEvent>('items:changed', () => {
	page.catalog = appData.catalog.map((item) => {
		const card = new CatalogueCard(cloneTemplate(cardCatalogTemplate), events, {
			onClick: (event) => events.emit('card:select', item),
		});
		return card.render({
			title: item.title,
			image: item.image,
			description: item.description,
			id: item.id,
			category: item.category,
			price: item.price,
		});
	});
});

// Обработчик события выбора карточки товара
events.on('card:select', (item: IProductItem) => {
	appData.setPreview(item);
});

// Открытие модального окна для просмотра карточки товара
events.on('modalCard:open', (item: IProductItem) => {
	const previewCard = new PreviewCard(previewCardTemplate, events);
	const сontent = previewCard.render(item);
	modal.render({ content: сontent });
});

// Добавление товара в корзину
events.on('card:addBasket', () => {
	basketModel.setСard(appData.selectedСard);
	basketView.renderHeaderBasketCounter(basketModel.getCounter());
	modal.close();
});

// Открытие модального окна корзины
events.on('basket:open', () => {
	basketView.renderSummaProducts(basketModel.getSummaProducts());
	let i = 0;
	basketView.items = basketModel.basketProducts.map((item) => {
		const basketCard = new BasketCard(cardBasketTemplate, events, {
			onClick: () => events.emit('basket:basketItemRemove', item),
		});
		i = i + 1;
		return basketCard.render(item, i);
	});
	// Формируем данные для отображения в модальном окне
	const data: IModalData = {
		content: basketView.render(),
	};

	// Показываем содержимое модального окна
	modal.render(data);
});

// Удаление товара из корзины
events.on('basket:basketItemRemove', (item: IProductItem) => {
	basketModel.removeCardFromBasket(item);
	basketView.renderHeaderBasketCounter(basketModel.getCounter());
	basketView.renderSummaProducts(basketModel.getSummaProducts());
	let index = 0;
	basketView.items = basketModel.basketProducts.map((product) => {
		const basketCard = new BasketCard(cardBasketTemplate, events, {
			onClick: () => events.emit('basket:basketItemRemove', product),
		});
		index++;
		return basketCard.render(product, index);
	});
});

// Оформить заказ
events.on('order:open', () => {
    appData.order.total = basketModel.getSummaProducts();
    appData.order.items = basketModel.basketProducts.map(item => item.id);
	modal.render({
		content: order.render({
			address: '',
			valid: false,
			errors: [],
		}),
	});
});

// Изменилось одно из полей
events.on(
	/^order\..*:change/,
	(data: { field: keyof IOrderForm; value: string }) => {
		appData.setOrderField(data.field, data.value);
	}
);

// Изменилось одно из полей
events.on(
	/^contacts\..*:change/,
	(data: { field: keyof IOrderForm; value: string }) => {
		appData.setOrderField(data.field, data.value);
	}
);

// Открыть форму заказа
events.on('order:open', () => {
	modal.render({
		content: order.render({
			address: '',
			valid: false,
			errors: [],
		}),
	});
});

let paymentChanged = false;
let addressChanged = false;

const handleModalRender = () => {
	if (paymentChanged && addressChanged) {
		order.valid = true;
	}
};

events.on('order.payment:change', () => {
	paymentChanged = true;
	handleModalRender();
});

events.on('order.address:change', () => {
	addressChanged = true;
	handleModalRender();
});

events.on('order:submit', () => {
	events.emit('userInfo:open');
});

events.on('userInfo:open', () => {
	modal.render({
		content: orderStep2.render({
			phone: '',
			email: '',
			valid: false,
			errors: [],
		}),
	});
});

let phoneChanged = false;
let emailChanged = false;

const handleModalRenderStep2 = () => {
	if (phoneChanged && emailChanged) {
		orderStep2.valid = true;
	}
};

events.on('contacts:submit', () => {
	events.emit('success:open');
});

events.on('contacts.phone:change', () => {
	phoneChanged = true;
	handleModalRenderStep2();
});

events.on('contacts.email:change', () => {
	emailChanged = true;
	handleModalRenderStep2();
});

events.on('success:open', () => {
	success.description = basketModel.getSummaProducts();
    console.log(appData.order);
	api
		.doOrder(appData.order)
		.then((result) => {
			console.log(result);
			const success = new Success(cloneTemplate(successTemplate), {
				onClick: () => {
					modal.close();
					basketModel.resetCounter();
					basketModel.cleanBasket();
					basketView.renderHeaderBasketCounter(basketModel.getCounter());
					basketView.render();
					events.emit('order:changed');
				},
			});
		})
		.catch((err) => {
			console.error(err);
		});
	modal.render({
		content: success.render({}),
	});
});

events.on('success:close', () => {
	modal.close();
});
