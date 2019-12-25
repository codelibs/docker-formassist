import JQ from 'jquery';

export default class {
  constructor(element, FormAssist, parentElement) {
    this.targetElement = element;
    this.parentElement = parentElement;
    this.FormAssist = FormAssist;
    this.suggestId = 'sug_' + Math.random().toString(32);
    this.$boxElement = JQ('<div />');
    this.$boxElement.attr('id', this.suggestId);

    this.suggestState = {
      started: false,
      isFocusTarget: false,
      isFocusList: false,
      isMouseHover: false,
      suggesting: false,
      selectedNum: 0,
      listLength: -1,
      inputText: JQ(element).val(),
      suggestInterval: ''
    };

    this.fessUrl = JQ(element).data('fess_url');
    if (this.fessUrl === undefined || this.fessUrl === '') {
      console.log('Suggest url is empry. ' + element);
      return;
    }

    this.suggestField = JQ(element).data('field');
    if (this.suggestField === undefined || this.suggestField === '') {
      console.log('Suggest field is empry. ' + element);
      return;
    }
    
    let resultFields = JQ(element).data('results');
    if (resultFields === undefined || resultFields === '') {
      resultFields = this.suggestField;
    }
    this.resultFields = resultFields.split(',');

    let resultHeaders = JQ(element).data('result_headers');
    if (resultHeaders === undefined || resultHeaders === '') {
      resultHeaders = resultFields;
    }
    this.resultHeaders = resultHeaders.split(',');

    let resultsNum = JQ(element).data('results_num');
    if (resultsNum === undefined || resultHeaders === '') {
      resultsNum = "10";
    }
    this.resultsNum = resultsNum;

    let assistTargets = JQ(element).data('assist_targets');
    if (assistTargets === undefined || assistTargets === '') {
      this.assistTargets = [];
    } else {
      this.assistTargets = assistTargets.split(',');
    }

    this._initialize();
  }

  _initialize() {
    const $targetElement = JQ(this.targetElement);
    this._bindTarget($targetElement);
    this._setupBox();
    this._bindBox();
  }

  _bindTarget($targetElement) {
    const $this = this;
    $targetElement.keydown(e => {
      if (
        (e.keyCode >= 48 && e.keyCode <= 90) ||
        (e.keyCode >= 96 && e.keyCode <= 105) ||
        (e.keyCode >= 186 && e.keyCode <= 226) ||
        e.keyCode === 8 ||
        e.keyCode === 32 ||
        e.keyCode === 46
      ) {
        $this.suggestState.started = true;
        $this.suggestState.isFocusList = false;
      } else if (e.keyCode === 38) {
        if ($this.$boxElement.css("display") !== "none") {
          e.preventDefault();
        }
        $this.suggestState.selectedNum = $this.suggestState.selectedNum - 1;
        if ($this.suggestState.selectedNum == -1) {
          $this.suggestState.selectedNum = $this.suggestState.listLength;
        }
        $this.suggestState.isFocusList = true;
        $this._selectList($this.suggestState.selectedNum);

      } else if (e.keyCode === 40) {
        if ($this.$boxElement.css("display") === "none") {
          $this._suggest();
        } else {
          $this.suggestState.selectedNum = $this.suggestState.selectedNum + 1;
          if ($this.suggestState.selectedNum - 1 > $this.suggestState.listLength) {
            $this.suggestState.selectedNum = 0;
          }
          $this.suggestState.isFocusList = true;
          $this._selectList($this.suggestState.selectedNum);
        }

      } else if (e.keyCode === 13) {
        if ($this.suggestState.isFocusList) {
          this._fixList();
        }
      }
    });
    $targetElement.keyup(function(e) {
      if (
        (e.keyCode >= 48 && e.keyCode <= 90) ||
        (e.keyCode >= 96 && e.keyCode <= 105) ||
        (e.keyCode >= 186 && e.keyCode <= 226) ||
        e.keyCode === 8 ||
        e.keyCode === 32 ||
        e.keyCode === 46
      ) {
        $this.suggestState.started = true;
        $this.suggestState.isFocusList = false;
      }
    });

    //monitoring input field
    setInterval(function() {
      const $textArea = JQ($this.targetElement);
      if ($this.suggestInterval < 5) {
        $this.suggestInterval = $this.suggestInterval + 1;
      } else if ($textArea.val().length === 0) {
        $this.suggestState.inputText = '';
        $this._resetSuggestSts();
      } else {
        if ($textArea.val() !== $this.suggestState.inputText) {
          if ($this.suggestState.isFocusTarget && !$this.suggestState.isFocusList && $this.suggestState.started && !$this.suggestState.suggesting) {
            //update if not selecting item in list
            $this._suggest();
            $this.suggestInterval = 0;
          }
        }
      }
    }, 100);
  }

  _bindBox() {
    const $this = this;
    this.$boxElement.hover(
      () => {
        $this.suggestState.isMouseHover = true;
      },
      () => {
        $this.suggestState.isMouseHover = false;
        $this.suggestState.selectedNum = 0;
      }
    );

    JQ(this.targetElement).focus(() => {
      this.suggestState.isFocusTarget = true;
    });
    JQ(this.targetElement).blur(() => {
      this.suggestState.isFocusTarget = false;
      if (!this.suggestState.isMouseHover) {
        this._fixList();
      }
    });
  }

  _setupBox() {
    this.$boxElement.addClass('fess-suggest-box');

    this.$boxElement.css('display', 'none');
    this.$boxElement.css("position", "absolute");
    this.$boxElement.css("text-align", "left");
    this.$boxElement.css("background-color", "#fff");

    this.$boxElement.css("border", "1px solid #cccccc");
    this.$boxElement.css(
      "-webkit-box-shadow",
      "0 3px 2px 0px rgba(0, 0, 0, 0.1), 0 3px 2px 0px rgba(236, 236, 236, 0.6)"
    );
    this.$boxElement.css(
      "-moz-box-shadow",
      "0 3px 2px 0px rgba(0, 0, 0, 0.1), 0 3px 2px 0px rgba(236, 236, 236, 0.6)"
    );
    this.$boxElement.css(
      "box-shadow",
      "0 3px 2px 0px rgba(0, 0, 0, 0.1), 0 3px 2px 0px rgba(236, 236, 236, 0.6)"
    );
    JQ(this.parentElement).append(this.$boxElement);
  }

  _suggest() {
    const $textArea = JQ(this.targetElement);
    this.suggestState.inputText = $textArea.val();
    if (this.suggestState.inputText.length === 0) {
      return;
    }
    this.suggestState.suggesting = true;

    let listNum = 0;
    let listSelNum = 0;

    const $this = this;
    JQ.ajax({
      url: $this.fessUrl,
      type: "get",
      dataType: "json",
      cache: false,
      data: {
        q: $this.suggestField + ':' + $this.suggestState.inputText + '*',
        num: $this.resultsNum
      },
      traditional: true
    }).done(function(obj) {
      if ($this._createList(obj)) {
        $this.$boxElement.css('display', 'block');
        $this._resize();
      } else {
        $this._resetSuggestSts();
      }
      $this.suggestState.suggesting = false;
    }).fail(function(a, obj, b) {
      console.log('Suggest request fail. ' + obj);
      $this._resetSuggestSts();
      $this.suggestState.suggesting = false;
    });
  }

  _resize() {
    const $textArea = JQ(this.targetElement);

    this.$boxElement.css("top", $textArea.offset().top + $textArea.height() + 6);
    this.$boxElement.css("left", $textArea.offset().left);
    this.$boxElement.css("height", "auto");
    this.$boxElement.css("width", "auto");
  }

  _createList(obj) {
    if (obj.response.record_count === 0) {
      return false;
    }

    const $table = this._setupTable();
    this.suggestState.listLength = 0;
    const $this = this;

    const $thead = JQ('<thead/>');
    const $trHead = JQ('<tr/>');
    this.resultHeaders.forEach(header => {
      const $th = JQ('<th />');
      $th.text(header);
      $trHead.append($th);
    });
    $thead.append($trHead);
    $table.append($thead);
    
    const $tbody = JQ('<tbody/>');
    obj.response.result.forEach(hit => {
      const $tr = JQ('<tr/>');
      $this.resultFields.forEach(field => {
        const $td = JQ('<td />');
        const value = hit[field];
        if (value === undefined) {
          $td.text('');
        } else {
          $td.text(value);
        }
        $tr.append($td);
      });
      $tr.data('obj', JSON.stringify(hit));
  
      $tr.hover(() => {
        $this.suggestState.selectedNum = JQ($tr).closest("table").children("tr").index($tr) + 1;
        $this.suggestState.isFocusList = true;
        $this._selectList($this.suggestState.selectedNum);
      }, () => {
        $this.suggestState.selectedNum = 0;
        $this.suggestState.isFocusList = false;
        $this._selectList($this.suggestState.selectedNum);
      });

      $tr.click(() => {
        $this.suggestState.selectedNum = JQ($tr).closest("table").children("tr").index($tr) + 1;
        $this._fixList();
      });

      $tbody.append($tr);
      $this.suggestState.listLength++;
    });
    $table.append($tbody);

    this.$boxElement.html('');
    this.$boxElement.append($table);
    return true;
  }

  _setupTable() {
    const $table = JQ('<table />');
    $table.addClass('table');
    $table.addClass('table-bordered');
    $table.addClass('table-condensed');
    return $table;
  }

  _selectList(selectedNum) {
    JQ(this.$boxElement).find("tr").each((i, tr) => {
      if (i === selectedNum - 1) {
        JQ(tr).css("background-color", "#e5e5e5");
      } else {
        JQ(tr).css("background-color", "#ffffff");
      }
    })
  }

  _fixList() {
    if (this.suggestState.selectedNum > 0) {
      const tr = JQ(this.$boxElement).find("tr")[this.suggestState.selectedNum - 1];
      const objStr = JQ(tr).data('obj');
      this.FormAssist.apply(JSON.parse(objStr), this.assistTargets);
    }
    this._resetSuggestSts();
    this.suggestState.inputText = JQ(this.targetElement).val();
    this.$boxElement.css("display", 'none');
  }

  _resetSuggestSts() {
    this.$boxElement.css('display', 'none');
    this.suggestState.isMouseHover = false;
    this.suggestState.selectedNum = 0;
    this.suggestState.suggesting = false;
    this.suggestState.listLength = 0;
    this.suggestState.isFocusList = false;
    this.$boxElement.html('');
  }
}