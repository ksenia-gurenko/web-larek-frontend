

export abstract class Component<T> {
    constructor(protected readonly container: HTMLElement) {}

    // Метод для установки текста в элементе
    protected setText(element: HTMLElement, text: unknown) {
        if (element) {
            element.textContent = String(text);
        }
    }

    // Установка источника изображения и альтернативного текста
    protected setImage(imgElement: HTMLImageElement, imgUrl: string, altText?: string) {
        if (imgElement) {
            imgElement.src = imgUrl;
            if (altText) {
                imgElement.alt = altText;
            }
        }
    }

   // Переключение класса элемента
   switchClass(element: HTMLElement, className: string, enable: boolean) {
    element.classList.toggle(className, enable);
}  

    render(data?: Partial<T>): HTMLElement {
        Object.assign(this as object, data ?? {});
        return this.container;
    }
}




