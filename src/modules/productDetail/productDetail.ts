import { Component } from '../component';
import { ProductList } from '../productList/productList';
import { formatPrice } from '../../utils/helpers';
import { ProductData } from 'types';
import html from './productDetail.tpl.html';
import { cartService } from '../../services/cart.service';
import { cartFavorite } from '../../services/cartFavorite.service';
import { sendEvent } from '../../services/event.service';

class ProductDetail extends Component {
  more: ProductList;
  product?: ProductData;

  constructor(props: any) {
    super(props);

    this.more = new ProductList();
    this.more.attach(this.view.more);
  }

  async render() {
    const urlParams = new URLSearchParams(window.location.search);
    const productId = Number(urlParams.get('id'));

    const productResp = await fetch(`/api/getProduct?id=${productId}`);
    this.product = await productResp.json();

    if (!this.product) return;

    const { id, src, name, description, salePriceU } = this.product;

    this.view.photo.setAttribute('src', src);
    this.view.title.innerText = name;
    this.view.description.innerText = description;
    this.view.price.innerText = formatPrice(salePriceU);
    this.view.btnBuy.onclick = this._addToCart.bind(this);
    this.view.btnFav.onclick = this._addFavoriteToCart.bind(this);

    const isInCart = await cartService.isInCart(this.product);

    if (isInCart) this._setInCart();

    fetch(`/api/getProductSecretKey?id=${id}`)
      .then((res) => res.json())
      .then((secretKey) => {
        this.view.secretKey.setAttribute('content', secretKey);
      });

    fetch('/api/getPopularProducts')
      .then((res) => res.json())
      .then((products) => {
        this.more.update(products);
      });
  
    let eventType = 'viewCard';
    if (typeof this.product.log === 'string' && this.product.log.trim() !== '') {
      eventType = 'viewCardPromo';
    }
    
    const payload = {
      ...this.product,
      secretKey: this.view.secretKey.getAttribute('content'),
    };

    sendEvent({
      type: eventType,
      payload,
      timestamp: Date.now(),
    });
    }

  private _addToCart() {
    if (!this.product) return;

    cartService.addProduct(this.product);
    this._setInCart();

    sendEvent({
      type: 'addToCard',
      payload: this.product,
      timestamp: Date.now(),
    });
  }

  private async _addFavoriteToCart() {
    if (!this.product) return;

    // Проверка, находится ли товар в избранном
    const isInFavorite = await cartFavorite.isInCart(this.product);

    if (isInFavorite) {
        cartFavorite.removeProduct(this.product);
        this._setNotInFavoriteCart();
    } else {
        cartFavorite.addProduct(this.product);
        this._setInFavoriteCart(); 
    }
}

  private _setInCart() {
    this.view.btnBuy.innerText = '✓ В корзине';
    this.view.btnBuy.disabled = true;
  }
  private _setNotInFavoriteCart() {
    // место для изменения стиля кнопки btnFav
}
  private _setInFavoriteCart() {
    // место для изменения стиля кнопки btnFav
  }
}

export const productDetailComp = new ProductDetail(html);
