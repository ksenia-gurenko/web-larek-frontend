import {
	INewAPI,
	IProduct,
	IOrderResponse,
	IOrder
} from '../types';
import { Api, ApiListResponse } from './base/api';


// Экспортируем новый класс, который расширяет базовый класс Api и реализует интерфейс INewAPI.
export class NewAPI extends Api implements INewAPI {
	// Приватная неизменяемая строка для хранения URL CDN.
	private readonly cdn: string;
   
	// Конструктор класса принимает URL CDN, базовый URL и необязательные параметры запроса.
	constructor(cdn: string, baseUrl: string, options?: RequestInit) {
	 // Вызывает конструктор родительского класса с передачей базового URL и параметров запроса.
	 super(baseUrl, options);
	 // Присваивает переданное значение URL CDN к приватному полю.
	 this.cdn = cdn;
	}
   
	// Метод для получения списка продуктов. Возвращает промис массива интерфейсов IProduct.
	getProductList(): Promise<IProduct[]> {
	 // Выполняем GET-запрос к конечной точке '/product'.
	 return this.get('/product')
	  // Преобразуем ответ в массив объектов типа IProduct, добавляя путь к изображению через CDN.
	  .then((data: ApiListResponse<IProduct>) => {
	   return data.items.map((item) => ({
		...item,
		image: this.cdn + item.image,
	   }));
	  });
	}
   
	// Метод для получения продукта по идентификатору. Возвращает промис интерфейса IProduct.
	getProduct(id: string): Promise<IProduct> {
	 // Выполняем GET-запрос к конечной точке '/product/{id}'.
	 return this.get(`/product/${id}`)
	  // Добавляем путь к изображению через CDN и возвращаем объект типа IProduct.
	  .then((item: IProduct) => ({
	   ...item,
	   image: this.cdn + item.image,
	  }));
	}
   
	// Метод для размещения заказа. Возвращает промис интерфейса IOrderResponse.
	doOrder(order: IOrder): Promise<IOrderResponse> {
	 // Выполняем POST-запрос к конечной точке '/order' с данными заказа.
	 return this.post('/order', order)
	  // Возвращаем данные ответа типа IOrderResponse.
	  .then((data: IOrderResponse) => data);
	}
   }