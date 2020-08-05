/**
 * Contains basic SlickGrid editors.
 * @module Editors
 * @namespace Slick
 */
(function ($) {
  // register namespace
  $.extend(true, window, {
    "Slick": {
      "Editors": {
        "MyEditLockText": MyEditLockTextEditor,
      }
    }
  });

  function MyEditLockTextEditor(args) {
    var $input;
    var defaultValue;
    var scope = this;

    this.init = function () {
      var navOnLR = args.grid.getOptions().editorCellNavOnLRKeys;
      $input = $("<INPUT type=text class='editor-text' />")
        .on("keydown.nav", navOnLR ? handleKeydownLRNav : handleKeydownLRNoNav)

      console.log(args.item);
      if (args.item.effortDriven == true) {
        // 編集できるので、編集用テキストボックスを表示させる。
        console.log("edit ok effortDriven = " + args.item.effortDriven);
        $input.appendTo(args.container).focus().select();
      } else {
        // 編集NGなので、編集用テキストボックスを表示させずに抜ける。
        console.log("edit denied effortDriven = " + args.item.effortDriven);
        $(args.container).removeClass("editable"); // セルの色が変わるので戻す
        args.cancelChanges(); // 編集キャンセル
        return;
      }

    };

    this.destroy = function () {
      $input.remove();
    };

    this.focus = function () {
      $input.focus();
    };

    this.getValue = function () {
      return $input.val();
    };

    this.setValue = function (val) {
      $input.val(val);
    };

    this.loadValue = function (item) {
      defaultValue = item[args.column.field] || "";
      $input.val(defaultValue);
      $input[0].defaultValue = defaultValue;
      $input.select();
    };

    this.serializeValue = function () {
      return $input.val();
    };

    this.applyValue = function (item, state) {
      item[args.column.field] = state;
    };

    this.isValueChanged = function () {
      return (!($input.val() === "" && defaultValue == null)) && ($input.val() != defaultValue);
    };

    this.validate = function () {
      if (args.column.validator) {
        var validationResults = args.column.validator($input.val());
        if (!validationResults.valid) {
          return validationResults;
        }
      }

      return {
        valid: true,
        msg: null
      };
    };

    this.init();
  }

  /*
   * Depending on the value of Grid option 'editorCellNavOnLRKeys', us 
   * Navigate to the cell on the left if the cursor is at the beginning of the input string
   * and to the right cell if it's at the end. Otherwise, move the cursor within the text
   */
  function handleKeydownLRNav(e) {
    var cursorPosition = this.selectionStart;
    var textLength = this.value.length;
    if ((e.keyCode === $.ui.keyCode.LEFT && cursorPosition > 0) ||
         e.keyCode === $.ui.keyCode.RIGHT && cursorPosition < textLength-1) {
      e.stopImmediatePropagation();
    }
  }

  function handleKeydownLRNoNav(e) {
    if (e.keyCode === $.ui.keyCode.LEFT || e.keyCode === $.ui.keyCode.RIGHT) {	
      e.stopImmediatePropagation();	
    }	
  }

})(jQuery);
