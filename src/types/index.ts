export type CatalogChangeEvent = {
	catalog: ICard[];
};

export interface IAppData {
	// Свойства
	_basket: ICard[];
	catalog: ICard[];
	productCards: IProductItem[];
	selectedСard: IProductItem;

	// Методы
	set cards(cards: ICard[]);
	get cards(): ICard[];
	setPreview(item: IProductItem): void;
}

export interface ICard {
	id: string;
	description?: string;
	image?: string;
	title: string;
	category?: string;
	price: number | null;
	index?: number;
}

export interface IOrderForm {
	email?: string;
	phone?: string;
	payment?: string;
	address?: string;
}

export interface IOrder extends IOrderForm {
	items: string[];
	total: number;
}

export interface IProductItem {
	id: string;
	description?: string;
	image?: string;
	title: string;
	category?: string;
	price: number | null;
}

export interface IBasketModel {
	basketProducts: IProductItem[];
	getCounter: () => number;
	getSummaProducts: () => number;
	setСard(data: IProductItem): void;
	removeCardFromBasket(item: IProductItem): void;
	cleanBasket(): void;
}

export interface IBasketView {
	basket: HTMLElement;
	button: HTMLButtonElement;
	basketPrice: HTMLElement;
	title: HTMLElement;
	basketList: HTMLElement;
	headerBasketButton: HTMLButtonElement;
	headerBasketCounter: HTMLElement;
	renderSummaProducts(sumAll: number): void;
	renderHeaderBasketCounter(value: number): void;
	render(): HTMLElement;
}

export interface ICardActions {
	onClick: (event: MouseEvent) => void;
}

export interface IPreviewCard {
	description: HTMLElement;
	button: HTMLElement;
	render(data: IProductItem): HTMLElement;
}

export interface IBasketCard {
	_basketCard: HTMLElement;
	cardTitle: HTMLElement;
	cardPrice: HTMLElement;
	deleteButton: HTMLButtonElement;
	index: HTMLElement;
	render(data: IProductItem, item: number): HTMLElement;
}

export interface INewAPI {
	getProductList(): Promise<IProduct[]>;
	getProduct(id: string): Promise<IProduct>;
	doOrder(order: IOrder): Promise<IOrderResponse>;
}

export interface IProduct {
	id: string;
	price: number | null;
	title: string;
	category?: string;
	description?: string;
	image?: string;
}

export interface IOrderResponse {
	orderId: string;
	totalAmount: number | null;
}

export interface IPageView {
	gallery: HTMLElement;
	content: HTMLElement;
	galleryElements: HTMLElement[];
	isLocked: boolean;
}

export interface ISuccess {
	total: number;
}

export interface ISuccessActions {
	onClick: () => void;
}

export interface ICardsData {
	// Свойства
	_cards: ICard[];
	_preview: string | null;
	_basket: ICard[];
	total: number;

	// Методы
	set cards(cards: ICard[]);
	get cards(): ICard[];
	addItem(cardId: string): void;
	deleteItem(cardId: string): void;
	getCard(cardId: string): ICard | undefined;
	checkInBasket(cardId: string): boolean;
	get basket(): ICard[];
	updateIndex(cart: ICard[]): void;
	getTotal(): number;
	getSum(): number;
	getIdList(): string[];
	resetBasket(): void;
}

export interface IOrderData {
	payment: string;
	address: string;
}

export interface IEventEmitter {
	emit(event: string, data: unknown): void;
	on(event: string, listener: (data: unknown) => void): void;
}

export interface IView {
	render(data?: object): HTMLElement;
}

export interface IFormErrors {
	payment?: string;
	address?: string;
	phone?: string;
	email?: string;
}

export interface IViewConstructor {
	new (container: HTMLElement, events?: IEventEmitter): IView;
}

export interface IApi {
	baseUrl: string;
	get<T>(url: string): Promise<T>;
	post<T>(url: string, data: object, method?: ApiMethods): Promise<T>;
}

export interface IUserData {
	getUserInfo(): TUserBaseInfo;
	getOrderInfo(): TUserOrderInfo;
	setUserInfo(userData: IUser): void;
	setPaymentFields(field: keyof IOrderData, value: string): void;
	setContactFields(field: keyof IOrderData, value: string): void;
	checkOrderForm(): boolean;
	checkUserForm(): boolean;
	resetOrder(): void;
}

export interface IUser {
	thisPayment: string;
	thisEmail: string;
	thisPhone: string;
	thisAddress: string;
}

export type TUserBaseInfo = Pick<IUser, 'thisEmail' | 'thisPhone'>;

export type TUserOrderInfo = Pick<IOrderData, 'payment' | 'address'>;

export type ApiMethods = 'POST' | 'PUT' | 'DELETE';

export interface ICatalogModel {
	items: IProduct[];
	setItems(items: IProduct[]): void; 
	getProduct(id: string): IProduct | undefined;
} 
