import suggestionsHTML from './suggestions.tpl.html';

class SearchSuggestions {
  private container: HTMLElement | null;
  private strings: string[];

  constructor(containerId: string, strings: string[]) {
    this.container = document.getElementById(containerId);
    this.strings = strings;
  }

  render(): void {
    if (!this.container || !Array.isArray(this.strings)) {
      console.error('Выбранного контейнера не обнаружено');
      return;
    }

    this.strings.forEach((str) => {
      const suggestionWrapper = document.createElement('div');
      suggestionWrapper.classList.add('suggestion__bgc');

      const suggestionBgc = document.createElement('div');
      suggestionBgc.classList.add('suggestion');
      suggestionBgc.textContent = str;

      suggestionWrapper.appendChild(suggestionBgc);
      this.container!.appendChild(suggestionWrapper);
    });
  }
}

const suggestionsContainer = document.createElement('div');
suggestionsContainer.innerHTML = suggestionsHTML;
document.body.appendChild(suggestionsContainer);

const stringsToRender = ['String 1', 'String 2', 'String 3'];

export const searchSuggestionsComp = new SearchSuggestions('suggestions', stringsToRender);
searchSuggestionsComp.render();