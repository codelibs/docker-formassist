import JQ from 'jquery';
import Assist from './assist.js';
import Suggest from './suggest.js';


export default class {
  constructor() {
      
  }

  start() {
    console.log('controller start');
    this._scan();
  }

  _scan() {
    console.log('scan');
    JQ('.fess-form-assist').each((i1, formAssistElement) => {
      const assist = new Assist();
      JQ(formAssistElement).find('.fess-assist').each((i2, assistElement) => {
        console.log(assistElement);
        assist.addElement(assistElement);
      });

      JQ(formAssistElement).find('.fess-suggest').each((i2, suggestElement) => {
        console.log(suggestElement);
        new Suggest(suggestElement, assist, formAssistElement);
      });
    });
  }
}