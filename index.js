(function(factory) {
  'use strict';

  if (typeof define === 'function' && define.amd) {
    define(['jquery'], factory);
  } else {
    factory(jQuery);
  }

})(function($) {
  'use strict';

  $.fn.cascadingSelect = function(options) {
    var defaults = {
      placeholder: false,
      placeholderWhenEmpty: false
    };
    var settings = $.extend({
    }, defaults, options);

    var _data = normalizeData(settings);

    _data.nodeAtLevel = nodeAtLevel;

    var _selects = [this].
        concat(settings.subSelects.map(function(s) { return $(s); })).
        map(function(s) {
          return s[0];
        });

    $(_selects).change(function(e) {
      // console.log('changed', $(this).val(), e.target);

      if (e.target === _selects[_selects.length - 1]) {
        // console.log('ignored');
        return;
      }

      var curLevel = _selects.indexOf(e.target);
      var curNode = _data.nodeAtLevel(curLevel);
      var nextSelect = _selects.slice(curLevel + 1)[0];
      var entries;

      // console.log('curNode', curNode);
      if (curNode && curNode.children && curNode.children.length) {
        entries = curNode.children;
      } else if (settings.placeholderWhenEmpty) {
        entries = [{text: settings.placeholderWhenEmpty, value: ''}];
      } else {
        entries = [];
      }

      $(nextSelect).
        empty().
        append(genOptions(entries)).
        change();
    });

    init.call(this);

    return this;

    function init() {
      if (this.val() === null) {
        this.
          empty().
          append(genOptions(_data)).
          change();
      } else {
        preselect();
      }
    }

    function preselect() {
      $(_selects).each(function(i) {
        var s = $(this);
        var v = s.val();

        if (v === null) {
          return false;
        }

        if (i >= 1 && nodeAtLevel(i - 1).children.length === 0) {
          return false;
        }

        s.
          empty().
          append(genOptions(i === 0 ? _data : nodeAtLevel(i - 1).children)).
          val(v);
      });
    }

    function nodeAtLevel(level) {
      var path = [];
      for (var i = 0; i <= level; i++) {
        path.push(selectedIndex(_selects[i]));
      }
      return nodeAtPath(path);
    }

    function nodeAtPath(path) {
      return path.reduce(function(n, i) {
        if (typeof n !== 'undefined') {
          return n.children[i];
        }
      }, { children: _data });
    }
  }

  function normalizeData(settings) {
    return normalizeChildren(settings.data);

    function normalizeChildren(children) {
      var normalizedData = children.map(function(c) {
        if (typeof c === 'object') {
          return $.extend(
            { value: c.text }, c,
            { children: c.children ? normalizeChildren(c.children) : []}
          );
        } else {
          var text = c.toString();
          return { text: text, value: text, children: [] };
        }
      });
      if (settings.placeholder) {
        normalizedData.unshift({text: settings.placeholder, value: '', children: []});
      }
      return normalizedData;
    }
  }

  function selectedIndex(selectEl) {
    var result;

    $(selectEl).find('option').each(function(i) {
      if (this.selected) {
        result = i;
        return false;
      }
    });

    return result;
  }

  function genOptions(children) {
    return children.map(function(c) {
      return $('<option>').attr('value', c.value).text(c.text);
    });
  }

});
