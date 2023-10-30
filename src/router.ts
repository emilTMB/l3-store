import { catalogComp } from './modules/catalog/catalog';
import { favoritesComp } from './modules/favorites/favorites';
import { notFoundComp } from './modules/notFound/notFound';
import { homepageComp } from './modules/homepage/homepage';
import { productDetailComp } from './modules/productDetail/productDetail';
import { checkoutComp } from './modules/checkout/checkout';
import { sendEvent } from './services/event.service';
import { searchSuggestionsComp } from './modules/suggestions/suggestions';

const ROUTES = {
  '/': homepageComp,
  '/catalog': catalogComp,
  '/product': productDetailComp,
  '/checkout': checkoutComp,
  '/favorites': favoritesComp,
  '/searchSuggestion':searchSuggestionsComp
};

export default class Router {
  $appRoot: HTMLElement;

  constructor() {
    // @ts-ignore
    this.$appRoot = document.querySelector('.js__root');

    window.addEventListener('load', this.route.bind(this));
    window.addEventListener('hashchange', this.route.bind(this));
  }

  route(e: any) {
    e.preventDefault();

    sendEvent({
      type: 'route',
      payload: { url: window.location.href },
      timestamp: Date.now(),
    });

    // @ts-ignore
    const component = ROUTES[window.location.pathname] || notFoundComp;

    component.attach(this.$appRoot);
    component.render();
  }
}
