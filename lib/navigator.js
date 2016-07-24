(function () {
  module.exports = Navigator;

  function Navigator (Book) {
    this.min_load = 7;
    this.buttons_to_display = 5;
    this.ready = false;
    this.thumbnails = [];
    this.hold_position = false;

    this.buttons = loadThumbnails(this, Book);
    this.markup = generateMarkup(this);
  }

  Navigator.prototype.navigatePrev = function (arg) {
    navigatePrev(this, (typeof arg === 'boolean' ? arg : undefined));
  }

  Navigator.prototype.navigateNext = function (arg) {
    navigateNext(this, (typeof arg === 'boolean' ? arg : undefined));
  }

  Navigator.prototype.updatePosition = function (pages) {
    markSelected(this, pages);
    if (!this.hold_position) {
      moveIntoView(this, pages);
    }
    // navigate(Navigator, pages);
  }

  function loadThumbnails (Navigator, Book) {
    var buttons = []
    var spreads = Book.images.reduce(function (spreads, image, i) {
      var sparse_array = {};
      if (i === 0 || i === Book.images.length - 1) {
        sparse_array[i] = Book.images[i];
        spreads.push(sparse_array);
      } else if (i % 2 !== 0) {
        sparse_array[i] = Book.images[i];
        sparse_array[i + 1] = Book.images[i + 1];
        spreads.push(sparse_array);
      }
      return spreads;
    }, [])

    for (var i = 0; i < spreads.length; i++) {
      // Create a button element
      var button = document.createElement('button');
      button.className = 'navigator_button';
      button.className += i < Navigator.buttons_to_display ? ' displayed' : '';
      button.className += i === 0 ? ' selected' : '';
      button.type = 'button';
      button.addEventListener('click', function (event) {
        Navigator.hold_position = true;
        Book.jump(this.getAttribute('data-page-id'), function () {
          Navigator.hold_position = false;
        });
      });
      button.addEventListener('click', function (event) {
        markSelected(Navigator, null, this);
      })

      // Figure out text and page-id, depending on
      // no. of pages in this spread
      var single = Object.keys(spreads[i]).length === 1;
      var text = document.createElement('span');
      text.className = 'navigator_button--text';
      text.innerText = 'Jump to page' + (single ? ' ' : 's ');
      text.innerText += Object.keys(spreads[i])
        .map(function (page_no) {
          return parseInt(page_no) + 1;
        }).join(' and ');
      button.appendChild(text);
      button.setAttribute('data-page-id', parseInt(Object.keys(spreads[i])[0]));

      // Insert thumbnail for each page in spread
      for (var si in spreads[i]) {

        var img_lg = spreads[i][si].getElementsByTagName('img')[0];
        var thumbUrl = img_lg.getAttribute('src').replace(/(\.\w+)$/, '_thumb$1');

        var thumb_img = document.createElement('img');
        thumb_img.addEventListener('load', markAsLoaded);
        thumb_img.addEventListener('load', checkEligibility.bind(Navigator))
        thumb_img.setAttribute('src', thumbUrl);
        thumb_img.setAttribute('alt', 'Thumbnail for page ' + (parseInt(si) + 1));


        button.appendChild(thumb_img);
      }

      buttons.push(button);
    }

    return buttons;
  }

  function markSelected (Navigator, pages, button) {
    if (!button && pages) {
      var button = Navigator.buttons.filter(function (button) {
        return button.getAttribute('data-page-id') == pages[0];
      })[0];
    }

    for (var i = 0; i < Navigator.buttons.length; i++) {
      Navigator.buttons[i].className = Navigator.buttons[i].className.replace(/ ?selected/, '');
    }

    button.className += ' selected';
  }

  function moveIntoView (Navigator, pages) {
    var list_item = Navigator.buttons.filter(function (button) {
      return button.getAttribute('data-page-id') == pages[0];
    })[0].parentNode;
    var list = list_item.parentNode;
    var offset = list_item.getBoundingClientRect();

    if (offset.left < 72) {
      var value = parseInt(window.getComputedStyle(list)
        .getPropertyValue('left'));
      value += (offset.left * -1);
      value += 72;
      list.style.left = value + 'px';
    } else if (offset.right > (list.clientWidth - 72)) {
      var value = parseInt(window.getComputedStyle(list)
        .getPropertyValue('left'));
      value -= (offset.right - list.clientWidth);
      value -= 72;
      list.style.left = value + 'px';
    }
  }

  function generateMarkup (Navigator) {
    var container = document.createElement('div');
    container.className = 'navigator_list';

    var list = document.createElement('ul');
    for (var i = 0; i < Navigator.buttons.length; i++) {
      var list_item = document.createElement('li');
      list_item.className = 'navigator_list--item';
      list_item.className += i % 2 ? ' even' : ' odd';
      list_item.appendChild(Navigator.buttons[i]);

      list.appendChild(list_item);
    }

    var prev_button = document.createElement('button');
    prev_button.type = 'button';
    prev_button.setAttribute('tabindex', -1);
    prev_button.className = 'navigator_list--prev';
    prev_button.innerText = 'Previous Pages';
    prev_button.addEventListener('click', function (event) {
      navigateThumbnailsPrev.call(this, Navigator, event);
    });

    var next_button = document.createElement('button');
    next_button.type = 'button';
    next_button.setAttribute('tabindex', -1);
    next_button.className = 'navigator_list--next';
    next_button.innerText = 'Next Pages';
    next_button.addEventListener('click', function (event) {
      navigateThumbnailsNext.call(this, Navigator, event);
    });

    container.appendChild(prev_button);
    container.appendChild(list);
    container.appendChild(next_button);

    return container;
  }

  function markAsLoaded (event) {
    var img = event.target;
    img.parentNode.setAttribute('data-loaded', true);
  }

  function checkEligibility (event) {
    if (this.ready) { return; }
    var ready = this.buttons
      .slice(0, (this.min_load - 1)) // check only the first few
      .every(function (button) { // check all in subset are loaded
        return (button.getAttribute('data-loaded') == 'true');
      });
    this.ready = ready;
  }

  function navigateThumbnailsPrev (Navigator, event) {
    var list = this.parentNode.getElementsByTagName('ul')[0];
    var offset = list.getBoundingClientRect();
    if (offset.left >= 72) { return; }

    var visible;
    var steps_back = 0;

    for (var i = 0; i < Navigator.buttons.length; i++) {
      var spread = Navigator.buttons[i];
      var spread_offset = spread.getBoundingClientRect();

      if (spread_offset.left >= 72 &&
        spread_offset.right <= (list.clientWidth - 72)) {
        steps_back--;
        visible = typeof visible === 'number' ? visible : i;
      }
    }

    var target_spread = Navigator.buttons[(visible + steps_back) >= 0 ? (visible + steps_back) : 0]

    if (target_spread) {
      moveIntoView(Navigator, [ target_spread.getAttribute('data-page-id') ]);
    }
  }

  function navigateThumbnailsNext (Navigator, event) {
    var list = this.parentNode.getElementsByTagName('ul')[0];

    var visible;
    var steps_forth = 0;

    for (var i = 0; i < Navigator.buttons.length; i++) {
      var spread = Navigator.buttons[i];
      var spread_offset = spread.getBoundingClientRect();

      if (spread_offset.left >= 72 &&
        spread_offset.right <= (list.clientWidth - 72)) {
        steps_forth++;
        visible = i;
      }
    }

    var target_spread = Navigator.buttons[(visible + steps_forth) <= (Navigator.buttons.length - 1) ? (visible + steps_forth) : (Navigator.buttons.length - 1)]
    console.log(visible, steps_forth, target_spread);

    if (target_spread) {
      moveIntoView(Navigator, [ target_spread.getAttribute('data-page-id') ]);
    }
  }
})();
