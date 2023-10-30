import localforage from 'localforage';
import { ProductData } from 'types';

const DB = '__wb-favotite';

class CartFavorite {
  init() {
    this._updateFavoritesButtonVisibility();
  }

  async addProduct(product: ProductData) {
    const products = await this.get();
    await this.set([...products, product]);
      this._updateFavoritesButtonVisibility();
  }

  async removeProduct(product: ProductData) {
    const products = await this.get();
    await this.set(products.filter(({ id }) => id !== product.id));
    this._updateFavoritesButtonVisibility();
  }
  async _updateFavoritesButtonVisibility() {
    const button = document.getElementById('favorites__btn'); 
    if (button) {
      const products = await this.get();
      if (products.length > 0) {
        button.style.display = 'contents';
      } else {
        button.style.display = 'none'; 
      }
    }
  }
  async clear() {
    await localforage.removeItem(DB);
  }

  async get(): Promise<ProductData[]> {
    return (await localforage.getItem(DB)) || [];
  }

  async set(data: ProductData[]) {
    await localforage.setItem(DB, data);
  }

  async isInCart(product: ProductData) {
    const products = await this.get();
    return products.some(({ id }) => id === product.id);
  }
}

export const cartFavorite = new CartFavorite();
