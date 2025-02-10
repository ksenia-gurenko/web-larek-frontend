import '../src/scss/styles.scss';

import { EventEmitter, CustomEventEmitter } from './components/base/events';
import './scss/styles.scss';
import { BasketView } from './components/BasketView';
import {
	IOrderForm,
	IFormErrors,
	IProductItem,
	ISuccessActions,
} from './types';
import { NewAPI } from './components/NewApi';
import { API_URL, CDN_URL } from './utils/constants';
import { Modal, IModalData } from './components/common/Modal';
import { BasketCard, CatalogueCard, PreviewCard } from './components/Card';
import { PageView } from './components/PageView';
import { AppData } from './components/AppData';
import { Order, Contacts } from './components/Order';
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
const appData = new AppData(events);

// Глобальные контейнеры
const page = new PageView(document.body, events);
const modalContainer = document.getElementById('modal-container');
const modal = new Modal(modalContainer, events);

// Остальное
const basketView = new BasketView(basketTemplate, events);
const order = new Order(cloneTemplate(orderTemplate), events);
const contacts = new Contacts(cloneTemplate(contactsTemplate), events);
const customEvents = new CustomEventEmitter(modal, appData, basketView);
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
		appData.catalog = data;
	})
	.catch((err) => {
		console.error(err);
	});

events.on('cards:changed', () => {
	console.log(appData.catalog);
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

// Обновляем корзину при изменении ее содержимого
events.on('basket:change', () => {
	basketView.renderHeaderBasketCounter(appData.getCounter());
	basketView.renderSummaProducts(appData.getSummaProducts());
	let index = 0;
	basketView.items = appData.basketProducts.map((product) => {
		const basketCard = new BasketCard(cardBasketTemplate, events, {
			onClick: () => events.emit('basket:basketItemRemove', product),
		});
		index++;
		return basketCard.render(product, index);
	});
});

// Обработчик события выбора карточки товара
events.on('card:select', (item: IProductItem) => {
	appData.setPreview(item);
});

// Открытие модального окна для просмотра карточки товара
events.on('modalCard:open', (item: IProductItem) => {
	const previewCard = new PreviewCard(previewCardTemplate, events);
	const content = previewCard.render(item);
	modal.render({ content });
	modal.open();
});

// Добавление товара в корзину
events.on('card:addBasket', () => {
	appData.setСard(appData.selectedСard);
	events.emit('basket:change');
	modal.close();
});

// Открытие модального окна корзины
events.on('basket:open', () => {
	modal.render({ content: basketView.render() });
	modal.open();
});

// Удаление товара из корзины
events.on('basket:basketItemRemove', (item: IProductItem) => {
	appData.removeCardFromBasket(item);
	events.emit('basket:change');
});

// Оформить заказ
events.on('order:open', () => {
	appData.order.total = appData.getSummaProducts();
	appData.order.items = appData.basketProducts.map((item) => item.id);
	modal.render({
		content: order.render({
			address: '',
			valid: false,
			errors: [],
		}),
	});
	modal.open();
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

// Изменилось состояние валидации заказа
events.on('orderFormErrors:change', (errors: Partial<IOrderForm>) => {
	const { payment, address } = errors;
	order.valid = !payment && !address;
	order.errors = Object.values({ payment, address })
		.filter((i) => !!i)
		.join('; ');
});

// Изменилось состояние валидации контактов
events.on('contactsFormErrors:change', (errors: Partial<IOrderForm>) => {
	const { email, phone } = errors;
	contacts.valid = !email && !phone;
	contacts.errors = Object.values({ phone, email })
		.filter((i) => !!i)
		.join('; ');
});

// Обрабатывает изменения в форме заказа
events.on('orderValidation:change', (errors: Partial<IFormErrors>) => {
	const fieldsWithErrors = Object.entries(errors).reduce((a, entry) => {
		if (entry[1]) {
			a.push(entry[1]);
		}
		return a;
	}, []);

	order.valid = fieldsWithErrors.length === 0;
	order.errors = fieldsWithErrors.join(', ');
});

// Обрабатывает изменения в форме контактов
events.on('contactsValidation:change', (errors: Partial<IFormErrors>) => {
	const fieldsWithErrors = Object.entries(errors).reduce((a, entry) => {
		if (entry[1]) {
			a.push(entry[1]);
		}
		return a;
	}, []);

	contacts.valid = fieldsWithErrors.length === 0;
	contacts.errors = fieldsWithErrors.join(', ');
});

events.on('order:submit', () => {
	events.emit('userInfo:open');
});

events.on('userInfo:open', () => {
	modal.render({
		content: contacts.render({
			phone: '',
			email: '',
			valid: false,
			errors: [],
		}),
	});
	modal.open();
});

events.on('contacts:submit', () => {
    events.emit('success:open');
});

events.on('success:open', () => {
    console.log(appData.order);

    api.doOrder(appData.order)
        .then((result) => {
            console.log(result);
            const success = new Success(cloneTemplate(successTemplate), {
                onClick: () => {
                    modal.close();
                },
            }, events); // Передаем события в конструктор Success

            success.description = appData.getSummaProducts();
            modal.render({
                content: success.render({}),
            });
            modal.open();

            // Очистка данных после успешного запроса
            appData.resetCounter();
            appData.cleanBasket();
            basketView.renderHeaderBasketCounter(appData.getCounter());
            basketView.render();
            events.emit('order:changed');
        })
        .catch((err) => {
            console.error(err);
            alert('Произошла ошибка при отправке заказа. Проверьте ваше подключение к интернету.');
        });
});

events.on('success:close', () => {
    modal.close();
});