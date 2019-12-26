import JQ from 'jquery';

export default class {
  constructor() {
    this.assistElements = {};
  }

  addElement(element) {
    const fieldName = JQ(element).data('field');
    if (fieldName === undefined || fieldName === '') {
      console.log('Fieldname is empty. ' + element);
      return;
    }
    this.assistElements[fieldName] = element;
  }

  apply(document, assistTargets) {
    for (const fieldName in this.assistElements) {
      const fieldValue = document[fieldName];
      if (fieldValue === undefined) {
        continue;
      }
      const element = this.assistElements[fieldName];
      if (assistTargets.length > 0 && !assistTargets.includes(JQ(element).attr('id'))) {
        continue;
      }
      const tagName = JQ(element).prop('tagName');
      if (tagName === 'INPUT') {
        const type = JQ(element).attr('type');
        if (type === 'text') {
          this._applyInputText(element, fieldValue);
        } else {
          console.log('Unsupported assist type:' + type);
        }
      } else {
        this._applyText(element, fieldValue);
      }
    }
  }

  _applyInputText(element, value) {
    JQ(element).val(value);
  }

  _applyText(element, value) {
    JQ(element).text(value);
  }
}