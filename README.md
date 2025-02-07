# Проектная работа "Веб-ларек"

Стек: HTML, SCSS, TS, Webpack

Структура проекта:

- src/ — исходные файлы проекта
- src/components/ — папка с JS компонентами
- src/components/base/ — папка с базовым кодом

Важные файлы:

- src/pages/index.html — HTML-файл главной страницы
- src/types/index.ts — файл с типами
- src/index.ts — точка входа приложения
- src/scss/styles.scss — корневой файл стилей
- src/utils/constants.ts — файл с константами
- src/utils/utils.ts — файл с утилитами

## Установка и запуск

Для установки и запуска проекта необходимо выполнить команды

```
npm install
npm run start
```

или

```
yarn
yarn start
```

## Сборка

```
npm run build
```

или

```
yarn build
```

## Данные и типы данных, используемые в приложении

Товар

```
export interface IProduct {
	id: string;
	price: number | null;
	title: string;
	category?: string;
	description?: string;
	image?: string;
}
```

Заказ

```
interface IOrderForm {
	email?: string;
	phone?: string;
	payment?: string;
	address?: string;
}

interface IOrder extends IOrderForm {
	items: string[];
	total: number;
}


```

## Архитектура приложения

Код приложения разделен на слои согласно парадигме MVP:

- слой представления, отвечает за отображение данных на странице,
- слой данных, отвечает за хранение и изменение данных
- презентер, отвечает за связь представления и данных.

### Базовый код

#### Класс Api

Содержит в себе базовую логику отправки запросов. В конструктор передается базовый адрес сервера и опциональный объект с заголовками запросов.
Методы:

- `get` - выполняет GET запрос на переданный в параметрах ендпоинт и возвращает промис с объектом, которым ответил сервер
- `post` - принимает объект с данными, которые будут переданы в JSON в теле запроса, и отправляет эти данные на ендпоинт переданный как параметр при вызове метода. По умолчанию выполняется `POST` запрос, но метод запроса может быть переопределен заданием третьего параметра при вызове.

#### Класс EventEmitter

Брокер событий позволяет отправлять события и подписываться на события, происходящие в системе. Класс используется в презентере для обработки событий и в слоях приложения для генерации событий.  
Основные методы, реализуемые классом описаны интерфейсом `IEvents`:

- `on` - подписка на событие
- `emit` - инициализация события
- `trigger` - возвращает функцию, при вызове которой инициализируется требуемое в параметрах событие

### Слой данных

#### Класс AppData

Класс AppData предназначен для хранения и управления данными о карточках товаров, заказе и информации о пользователе. Он также содержит методы для изменения этих данных и инициирует события через объект EventEmitter, когда происходят изменения.

Параметры:
- events: Экземпляр класса IEvents, который используется для передачи событий об изменениях данных.

В полях класса хранятся следующие данные:

- `productCards: IProductItem : Внутреннее хранилище для списка карточек продуктов.
-  productCards: IProductItem : Выбранная карточка товара для отображения в модальном окне.
-  _basket: IProductItem[]: Список товаров, добавленных в корзину.
-  catalog: ICard[]: Массив объектов карточек товаров.
-  card: ICard : Отдельный объект карточки товара.
-  order: IOrder : Объект, содержащий информацию о текущем заказе.
-  events: IEvents : Экземпляр класса IEvents для отправки событий при изменении данных.

Так же класс предоставляет набор методов для взаимодействия с этими данными:

##### get items()

Возвращает список всех элементов (ICard[]), хранящихся в классе.

##### setItems(items: ICard[])

Устанавливает новый список элементов.

##### getProduct(id: string)

Ищет карточку товара по её идентификатору (id) и возвращает её, если она найдена.

##### set cards(cards: ICard[])

Устанавливает новые значения для каталога карточек и отправляет событие 'cards:changed'.

##### get cards()

Возвращает текущий каталог карточек.

##### set productCards(data: IProductItem[])

Устанавливает новые значения для списка карточек продуктов и отправляет событие 'productCards:receive'.

##### get productCards()

Возвращает текущий список карточек продуктов.

##### setPreview(item: IProductItem)

Выбирает карточку продукта для показа в модальном окне и отправляет событие 'modalCard:open'.

##### setOrderField(field: keyof IOrderForm, value: string)

Обновляет значение поля заказа и отправляет событие 'orderInfo:ready'.

#### Класс BasketModel

Класс `BasketModel` предназначен для хранения и управления данными корзины покупок. Он включает методы для добавления, удаления и очистки товаров из корзины, а также вычисления общей стоимости товаров в корзине.

#### Поля

- **`_basketProducts: IProductItem[]`**: Внутренний массив, содержащий товары, добавленные в корзину.

#### Методы

##### `set basketProducts(data: IProductItem[])`
Задает новое содержимое корзины товарами.

##### `get basketProducts()`
Возвращает текущее содержимое корзины.

##### `getCounter()`
Возвращает количество товаров в корзине.

##### `resetCounter()`
Очищает корзину, удаляя все товары.

##### `getSummaProducts()`
Вычисляет общую стоимость всех товаров в корзине и возвращает результат.

##### `setСard(data: IProductItem)`
Добавляет товар в корзину.

##### `removeCardFromBasket(item: IProductItem)`
Удаляет указанный товар из корзины.

##### `cleanBasket()`
Полностью очищает корзину от всех товаров.



### Классы представления

Все классы представления отвечают за отображение внутри контейнера (DOM-элемент) передаваемых в них данных.

#### Базовый Класс Component

Класс является дженериком и родителем всех компонентов слоя представления. В дженерик принимает тип объекта, в котором данные будут передаваться в метод render для отображения данных в компоненте. В конструктор принимает элемент разметки, являющийся основным родительским контейнером компонента. Содержит метод render, отвечающий за сохранение полученных в параметре данных в полях компонентов через их сеттеры, возвращает обновленный контейнер компонента.

#### Класс Modal

Реализует модальное окно. Так же предоставляет методы `open` и `close` для управления отображением модального окна. Устанавливает слушатели на клавиатуру, для закрытия модального окна по Esc, на клик в оверлей и кнопку-крестик для закрытия попапа.

- constructor(selector: string, events: IEvents) Конструктор принимает селектор, по которому в разметке страницы будет идентифицировано модальное окно и экземпляр класса `EventEmitter` для возможности инициации событий.

Поля класса

- modal: HTMLElement - элемент модального окна
- events: IEvents - брокер событий

### Класс `Card`

**Описание:**  
Класс `Card` является базовым классом для представления карточек товаров. Он обеспечивает функционал для рендеринга и обновления данных карточки, а также для обработки событий.


**Параметры:**
- `container`: Родительский элемент, в котором будет размещена карточка.
- `events`: Экземпляр класса `IEvents`, который используется для отправки событий при взаимодействии с карточкой.
- `actions`: Опциональный параметр, определяющий действия, которые должны выполняться при клике на карточку.

#### Поля

- **`element: HTMLElement | HTMLButtonElement | undefined`**: Элемент карточки.
- **`events: IEvents | undefined`**: Экземпляр класса `IEvents` для отправки событий.
- **`cardTitle: HTMLElement`**: Элемент заголовка карточки.
- **`cardCategory: HTMLElement | undefined`**: Элемент категории карточки.
- **`cardPrice: HTMLElement`**: Элемент цены карточки.
- **`cardImage: HTMLImageElement | undefined`**: Элемент изображения карточки.
- **`deleteButton: HTMLButtonElement | undefined`**: Кнопка удаления карточки.
- **`cardID: string | undefined`**: Идентификатор карточки.

#### Методы

##### `render(data: Partial<ICard>)`
Рендерит карточку с переданными данными. Если данные отсутствуют, возвращается контейнер карточки.

##### `set category(value: string)`
Устанавливает категорию карточки.

##### `set title(value: string)`
Устанавливает заголовок карточки.

##### `set id(value: string)`
Устанавливает идентификатор карточки.

##### `set image(value: string)`
Устанавливает изображение карточки.

##### `set price(value: number | null)`
Устанавливает цену карточки.

##### `get id(): string`
Возвращает идентификатор карточки.

##### `deleteCard()`
Удаляет карточку из DOM.

---

### Класс `CatalogueCard`

**Описание:**  
Класс `CatalogueCard` расширяет базовый класс `Card` и добавляет специфичную функциональность для карточек в каталоге товаров.


**Параметры:**
- `container`: Родительский элемент, в котором будет размещена карточка.
- `events`: Экземпляр класса `IEvents`, который используется для отправки событий при взаимодействии с карточкой.
- `actions`: Опциональный параметр, определяющий действия, которые должны выполняться при клике на карточку.

#### Методы

##### `render(data: Partial<ICard>)`
Рендерит карточку с переданными данными. Если данные отсутствуют, возвращается контейнер карточки.

---

### Класс `BasketCard`

**Описание:**  
Класс `BasketCard` представляет карточку товара в корзине покупок. Он обеспечивает функционал для рендеринга и обновления данных карточки, а также для обработки событий.

**Параметры:**
- `template`: Шаблон элемента карточки, используемый для создания DOM-элементов.
- `events`: Экземпляр класса `IEvents`, который используется для отправки событий при взаимодействии с карточкой.
- `actions`: Опциональный параметр, определяющий действия, которые должны выполняться при клике на карточку.

#### Поля

- **`_basketCard: HTMLElement`**: Основной элемент карточки.
- **`cardTitle: HTMLElement`**: Элемент заголовка карточки.
- **`cardPrice: HTMLElement`**: Элемент цены карточки.
- **`deleteButton: HTMLButtonElement`**: Кнопка удаления карточки из корзины.
- **`index: HTMLElement`**: Элемент индекса карточки в списке корзины.

#### Методы

##### `setPrice(value: number | null): string`
Формирует строку с ценой карточки.

##### `render(data: IProductItem, item: number): HTMLElement`
Рендерит карточку с переданными данными и индексом в корзине.

### Класс PreviewCard

Описание:  
Класс PreviewCard представляет собой компонент для отображения подробной информации о товаре в модальном окне. Он обеспечивает функционал для рендеринга и обновления данных карточки, а также для обработки событий.

Параметры:
- template: Шаблон элемента карточки, используемый для создания DOM-элементов.
- events: Экземпляр класса IEvents, который используется для отправки событий при взаимодействии с карточкой.
- actions: Опциональный параметр, определяющий действия, которые должны выполняться при клике на карточку.

Поля

- `element: HTMLElement`: Основной элемент карточки.
- `cardCategory: HTMLElement`: Элемент категории карточки.
- `cardTitle: HTMLElement`: Элемент заголовка карточки.
- `cardImage: HTMLImageElement`: Элемент изображения карточки.
- `cardPrice: HTMLElement`: Элемент цены карточки.
- `cardID: string | undefined`: Идентификатор карточки.
- `description: HTMLElement`: Элемент описания карточки.
- `button: HTMLElement`: Кнопка для добавления карточки в корзину.

Методы

##### setText(element: HTMLElement, value: unknown): string
Устанавливает текстовое содержание указанного элемента.

##### get category(): string
Возвращает текущую категорию карточки.

##### set category(value: string)
Устанавливает новую категорию карточки.

##### setPrice(value: number | null): string
Формирует строку с ценой карточки.

##### notInSale(data: IProductItem)
Проверяет наличие товара в продаже и устанавливает соответствующее состояние кнопки.

##### render(data: IProductItem): HTMLElement
Рендерит карточку с переданными данными и возвращает основной элемент карточки.

### Класс PageView

Описание:  
Класс PageView представляет собой компонент, отвечающий за управление страницей приложения. Он наследует функциональность базового класса Component и реализует методы для работы с галереей и блокировкой контента страницы.

Параметры:
- pageContainer: Родительский элемент страницы, внутри которого будут размещаться компоненты.
- eventEmitter: Экземпляр класса IEvents, который используется для отправки событий при взаимодействии с элементами страницы.

Поля
- `gallery: HTMLElement`: Элемент галереи на странице.
- `content: HTMLElement`: Обертка основного контента страницы.

Методы

##### set catalog(elements: HTMLElement[])
Замещает содержимое галереи новыми элементами.

##### set locked(value: boolean)
Блокирует или разблокирует контент страницы, добавляя или убирая соответствующий CSS-класс.

Этот класс позволяет управлять содержимым страницы, включая работу с галереей и блокировку контента.

### Класс BasketView

Описание:  
Класс BasketView отвечает за визуализацию корзины покупок на странице. Он создает элементы интерфейса для отображения содержимого корзины, ее цены и кнопок для выполнения действий, таких как открытие формы заказа и просмотр корзины.

Параметры:
- template: Шаблон элемента корзины, используемый для создания DOM-элементов.
- events: Экземпляр класса IEvents, который используется для отправки событий при взаимодействии с элементами корзины.

Поля

- `basket: HTMLElement`: Основной элемент корзины.
- `title: HTMLElement`: Заголовок корзины.
- `basketPrice: HTMLElement`: Элемент для отображения итоговой суммы корзины.
- `basketList: HTMLElement`: Контейнер для списка товаров в корзине.
- `button: HTMLButtonElement`: Кнопка для открытия формы заказа.
- `headerBasketButton: HTMLButtonElement`: Кнопка корзины в шапке сайта.
- `headerBasketCounter: HTMLElement`: Элемент для отображения количества товаров в корзине.

Методы

##### set items(items: HTMLElement[])
Устанавливает элементы списка товаров в корзине. Если список не пустой, активирует кнопку оформления заказа, иначе деактивирует ее и показывает сообщение "Корзина пуста".

##### renderSummaProducts(summa: number)
Отображает итоговую сумму корзины в соответствующем элементе интерфейса.

##### renderHeaderBasketCounter(value: number)
Отображает количество товаров в корзине в шапке сайта.

##### render()
Создает и возвращает основной элемент корзины. Устанавливает заголовок корзины.

Этот класс позволяет управлять отображением корзины покупок и взаимодействовать с ней через пользовательский интерфейс.

### Класс Order

Описание:  
Класс Order представляет форму заказа и управляет обработкой ввода данных пользователем. Он наследуется от базового класса Form и добавляет специфичные для процесса заказа методы и свойства.

Конструктор

TypeScript

constructor(container: HTMLFormElement, events: IEvents)

Параметры:
- container: Родительский элемент формы заказа.
- events: Экземпляр класса IEvents, который используется для отправки событий при взаимодействии с формой.

Поля

- `card: HTMLButtonElement`: Кнопка выбора оплаты картой.
- `cash: HTMLButtonElement`: Кнопка выбора оплаты наличными.
- `button: HTMLButtonElement`: Основная кнопка отправки формы.

Методы

##### set address(value: string)
Устанавливает значение адреса в форме заказа.

---

### Класс OrderStep2

Описание:  
Класс OrderStep2 представляет вторую часть формы заказа и управляет обработкой ввода дополнительных данных пользователем. Он также наследуется от базового класса Form.

Параметры:
- container: Родительский элемент второй части формы заказа.
- events: Экземпляр класса IEvents, который используется для отправки событий при взаимодействии с формой.

Поля

- `button: HTMLButtonElement`: Основная кнопка отправки второй части формы.

Методы

##### set phone(value: string)
Устанавливает значение телефона в форме заказа.

##### set email(value: string)
Устанавливает значение электронной почты в форме заказа.


### Класс Success

Описание:  
Класс Success представляет собой компонент, который отображает сообщение об успешном выполнении операции (например, успешной оплате заказа). Он наследует функциональность базового класса Component и реализует методы для управления сообщением и взаимодействием с ним.

Параметры:
- container: Родительский элемент, в котором будет размещено сообщение об успехе.
- actions: Опциональный параметр, определяющий действия, которые должны выполняться при нажатии на кнопку закрытия сообщения.
- events: Опциональный параметр, представляющий экземпляр класса IEvents, который используется для отправки событий при взаимодействии с компонентом.

Поля

- `button: HTMLButtonElement`: Кнопка закрытия сообщения об успехе.
- `total: HTMLElement_: Элемент, в котором отображается информация о списанных средствах.
- _events: IEvents`: Экземпляр класса IEvents, который используется для отправки событий.

Методы

##### set description(value: number)
Устанавливает текстовое содержание элемента _total с информацией о списанной сумме средств.


### Слой коммуникации


### Класс NewAPI

Описание:  
Класс NewAPI представляет собой API-клиент, который расширяет базовый класс Api и реализует интерфейс INewAPI. Этот класс предназначен для взаимодействия с серверными API, предоставляющими доступ к продуктам и обработке заказов. Он также обрабатывает преобразование путей к изображениям продуктов, используя заданный URL CDN.

Параметры:
- cdn: URL CDN, который будет использоваться для построения полных ссылок на изображения продуктов.
- baseUrl: Базовый URL сервера, с которым будет происходить взаимодействие.
- options: Дополнительные параметры конфигурации HTTP-запросов.

Поля

- `cdn: string`: Приватное неизменяемое поле, содержащее URL CDN.

Методы

##### getProductList()
Метод для получения списка продуктов. Возвращает промис массива объектов типа IProduct, где каждое изображение имеет полный путь, включающий URL CDN.

##### getProduct(id: string)
Метод для получения конкретного продукта по его идентификатору. Возвращает промис объекта типа IProduct, где изображение также имеет полный путь, включающий URL CDN.

##### doOrder(order: IOrder)
Метод для размещения заказа. Принимает объект типа IOrder и выполняет POST-запрос к серверу. Возвращает промис объекта типа IOrderResponse, содержащего информацию о результате выполнения заказа.

Этот класс предоставляет удобный способ взаимодействия с серверными API для работы с продуктами и заказами, обеспечивая корректную обработку изображений через CDN.

## Взаимодействие компонентов

Код, описывающий взаимодействие представления и данных между собой находится в файле `index.ts`, выполняющем роль презентера.\
Взаимодействие осуществляется за счет событий генерируемых с помощью брокера событий и обработчиков этих событий, описанных в `index.ts`\
В `index.ts` сначала создаются экземпляры всех необходимых классов, а затем настраивается обработка событий.

_Список всех событий, которые могут генерироваться в системе:_\
_События изменения данных (генерируются классами моделями данных)_

- `items:changed` - изменились элементы каталога
- `cards:changed` - изменение массива карточек
- `basket:changed` - изменение массива корзины

_События, возникающие при взаимодействии пользователя с интерфейсом (генерируются классами, отвечающими за представление)_

- `modal:open` - открытие модального окна
- `modal:close` - закрытие модального окна
- `basket:open` - открытие корзины
- `Order:open` - открытие модального окна создания заказа
- `modalCard:open` - Открытие модального окна для просмотра карточки товара
- `card:select` - выбор карточки для отображения в модальном окне
- `basket:basketItemRemove` - удаление товара из корзины
- `order.payment:change` - изменение данных о способе оплаты
- `order.address:change` - изменение данных в форме с адресом
- `contacts.email:change` - изменение данных в форме с данными электронной почты
- `contacts.phone:change` - изменение данных в форме с номером телефона
- `userInfo:open` - открытие формы с номером телефона и адресом электронной почты
- `contacts:submit` - сохранение данных о заказе в модальном окне
