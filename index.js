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
    var settings = $.extend({
    }, options);

    var _data = normalizeData(settings.data);

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

      // console.log('curNode', curNode);

      $(nextSelect).
        empty().
        append(genOptions(curNode.children)).
        change();
    });

    return this.append(genOptions(_data)).change();

    function nodeAtLevel(level) {
      var path = [];
      for (var i = 0; i <= level; i++) {
        path.push(selectedIndex(_selects[i]));
      }
      return nodeAtPath(path);
    }

    function nodeAtPath(path) {
      return path.reduce(function(n, i) {
        return n.children[i];
      }, { children: _data });
    }
  }

  function normalizeData(data) {
    return normalizeChildren(data);

    function normalizeChildren(children) {
      return children.map(function(c) {
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
