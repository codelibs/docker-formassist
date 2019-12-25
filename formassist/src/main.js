import "core-js/stable";
import "regenerator-runtime/runtime";

import '!style-loader!css-loader!sass-loader!./css/style-base.scss';
import '!style-loader!css-loader!sass-loader!./css/style.scss';
import '!style-loader!css-loader!sass-loader!./css/form-assist.scss';

import Controller from './controller.js';

(function(){
    const controller = new Controller();

    window.onload = () => {
        controller.start();
    }
})();
