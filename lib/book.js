(function () {
  var Navigator = require('./navigator');
  var controls = require('./controls');
  var styles = require('./styles');
  module.exports = Book;

  function Book (data, options) {
    if (!options) { options = {}; }

    this.min_load = options.min_load || 3;
    this.page_turn_duration = options.page_turn_duration || 400;
    this.page_turn_duration_half = this.page_turn_duration / 2;

    this.ready = false;
    this.turning = false;
    this.target = null;
    this.current = [ 0 ];
    this.turn_queue = [];
    this.checkReadyState = setInterval(checkReadyState, 200, this);
    this.callback = null;

    this.images = loadImages(this, data);
    this.markup = createBookMarkup(this);
    this.background.appendChild(createNavButtons(this));
    if (options.navigator) {
      this.navigator = new Navigator(this);
      this.background.appendChild(this.navigator.markup);
    }
    this.controls = controls(this);
    this.current_page_label = this.controls
      .getElementsByClassName('book_controls--current_page_label')[0];
    this.markup.appendChild(this.controls);
  }

  Book.prototype.prev = function (force_turn) {
    navigatePrev(this, (typeof force_turn == 'boolean' ? force_turn : undefined));
    this.current_page_label.innerText = updatePageNumbers(this);
    if (this.navigator) {
      this.navigator.updatePosition(this.current);
    }
  }

  Book.prototype.next = function (force_turn) {
    navigateNext(this, (typeof force_turn == 'boolean' ? force_turn : undefined));
    this.current_page_label.innerText = updatePageNumbers(this);
    if (this.navigator) {
      this.navigator.updatePosition(this.current);
    }
  }

  Book.prototype.jump = function (page_id) {
    navigateToPage(this, page_id);
    this.current_page_label.innerText = updatePageNumbers(this);
  }

  function createNavButtons (Book) {
    var button_container = document.createElement('div');
    button_container.className = 'book--nav_buttons';

    var prevButton = document.createElement('button');
    prevButton.type = 'button';
    prevButton.setAttribute('tabindex', -1);
    prevButton.innerText = 'Previous';
    prevButton.className = 'book--nav_buttons--prev';
    prevButton.addEventListener('click', function (event) {
      Book.prev();
    });

    var nextButton = document.createElement('button');
    nextButton.type = 'button';
    nextButton.setAttribute('tabindex', -1);
    nextButton.innerText = 'Next';
    nextButton.className = 'book--nav_buttons--next';
    nextButton.addEventListener('click', function (event) {
      Book.next();
    });

    button_container.appendChild(prevButton);
    button_container.appendChild(nextButton);

    return button_container;
  }

  function createBookMarkup (Book) {
    var section = document.createElement('section');
    section.id = 'book';
    section.className = 'book';
    section.innerHTML = '<p class="book--loading_message">Loading book pages&hellip;<\/p>';

    var background = document.createElement('div');
    background.className = 'book--background';

    section.appendChild(background);

    Book.background = background;
    Book.section = section;
    insertBookPages(Book);

    return section;
  }

  function loadImages (Book, data) {
    var imagePaths = (typeof data === 'function' ? data() : Array.isArray(data) ? data : [ data ]);
    var images = [];
    for (var i = 0, img, figure; i < imagePaths.length; i++) {
      img = document.createElement('img');
      img.addEventListener('load', markAsLoaded);
      img.addEventListener('load', checkEligibility.bind(Book));
      if (i === 0) {
        img.addEventListener('load', function (event) {
          var measurements = getMeasurements(Book, this);
          Book.styles = setStyles(Book, measurements);
        });
      }
      img.setAttribute('src', imagePaths[i]);
      img.setAttribute('alt', 'Page ' + (i + 1));

      figure = document.createElement('figure');
      figure.className = 'book_page_' + i;
      figure.className += (i % 2 ? ' spread--left' : ' spread--right');
      figure.style.backgroundImage = 'url("' + imagePaths[i] + '")';
      figure.setAttribute('data-loaded', false);

      if (i === 0) {
        figure.className += ' book_page_displayed';
      } else {
        figure.className += ' book_page_hidden--right';
      }

      figure.appendChild(img);
      images[i] = figure;
    }
    return images;
  }

  function insertBookPages (Book) {
    var container = document.createElement('div');
    container.className = 'book--wrapper book_layout--single';
    for (var i = 0; i < Book.images.length; i++) {
      container.appendChild(Book.images[i]);
    }
    Book.background.appendChild(container);
    Book.container = container;
  }

  function checkReadyState (Book) {
    if (Book.ready) {
      clearInterval(Book.checkReadyState);
      var style_tag = document.createElement('style');
      style_tag.type = 'text/css';
      style_tag.innerText = Book.styles;
      Book.section.insertBefore(style_tag, Book.section.children[0]);
      Book.section.className += ' ready';
    }
  }

  function markAsLoaded (event) {
    var img = event.target;
    img.parentNode.setAttribute('data-loaded', true);
  }

  function checkEligibility (event) {
    if (this.ready) { return; }
    var ready = this.images
      .slice(0, (this.min_load - 1)) // check only the first few
      .every(function (figure) { // check all in subset are loaded
        return (figure.getAttribute('data-loaded') == 'true');
      });
    this.ready = ready;
  }

  function navigatePrev (Book, force_turn) {
    if (Book.current.indexOf(0) !== -1) {
      return moveUpTurnQueue(Book);
    }

    if (Book.turning && !force_turn) {
      Book.turn_queue.push('Prev');
      return;
    }

    Book.turning = true;
    Book.close = Book.current.slice();
    Book.current = Book.current.map(function (page) {
      return page - Book.current.length;
    });

    if (Book.current.length === 1 &&
        Book.current[0] !== 0) {
      Book.current.splice(0, 0, (Book.current[0] - 1))
    }

    if (Book.current.length === 2 &&
        Book.current[1] === 0) {
      Book.current = Book.current.slice(1);
    }

    var layout = Book.current.length === 1 ? 'single' : 'spread';
    if (layout == 'single') {
      hidePages(Book, 'right');
      showPages(Book, 'left');
      setTimeout(function () {
        if (Book.turn_queue.length === 0) {
          setLayout(Book, layout);
          setTimeout(moveUpTurnQueue, Book.page_turn_duration * 1.5, Book);
        } else {
          moveUpTurnQueue(Book);
        }
      }, Book.page_turn_duration * 1.8);
    } else {
      setLayout(Book, layout);
      setTimeout(function () {
        hidePages(Book, 'right');
        showPages(Book, 'left');
        setTimeout(moveUpTurnQueue, Book.page_turn_duration * 1.5, Book);
      }, (Book.close.length === 1 ? Book.page_turn_duration : 0));
    }
  }

  function navigateNext (Book, force_turn) {
    if (Book.current.indexOf(Book.images.length - 1) !== -1) {
      return moveUpTurnQueue(Book);
    }

    if (Book.turning && !force_turn) {
      Book.turn_queue.push('Next');
      return;
    }

    Book.turning = true;
    Book.close = Book.current.slice();
    Book.current = Book.current.map(function (page) {
      return page + Book.current.length;
    });

    if (Book.current.length === 1 &&
        Book.current[0] !== (Book.images.length - 1)) {
      Book.current[1] = Book.current[0] + 1;
    }

    if (Book.current.length === 2 &&
        Book.current[0] === (Book.images.length - 1)) {
      Book.current = Book.current.slice(0, 1);
    }

    var layout = Book.current.length === 1 ? 'single' : 'spread';
    if (layout == 'single') {
      hidePages(Book, 'left');
      showPages(Book, 'right');
      setTimeout(function () {
        if (Book.turn_queue.length === 0) {
          setLayout(Book, layout);
          setTimeout(moveUpTurnQueue, Book.page_turn_duration * 1.5, Book);
        } else {
          moveUpTurnQueue(Book);
        }
      }, Book.page_turn_duration * 1.8);
    } else {
      setLayout(Book, layout);
      setTimeout(function () {
        hidePages(Book, 'left');
        showPages(Book, 'right');
        setTimeout(moveUpTurnQueue, Book.page_turn_duration * 1.5, Book);
      }, (Book.close.length === 1 ? Book.page_turn_duration : 0));
    }
  }

  function moveUpTurnQueue (Book, avoid_forcing) {
    if (Book.turn_queue.length === 0) {
      Book.turning = false;
      if (Book.callback) {
        Book.callback();
        Book.callback = null;
      }
      return;
    }

    var dir = Book.turn_queue.splice(0, 1)[0];
    Book['navigate' + dir](!avoid_forcing);
  }

  function setLayout (Book, layout) {
    Book.container.className = Book.container.className
      .replace(/book_layout--\w+/, ('book_layout--' + layout));
  }

  function hidePages (Book, dir) {
    for (var i = 0; i < Book.close.length; i++) {
      var page = Book.images[Book.close[i]];
      page.className = page.className.replace(/ ?book_page_displayed/, '');
      page.className += (' book_page_behind');
      setTimeout(function (page, i) {
        page.className = page.className.replace(/ ?book_page_behind/, ' book_page_hidden--' + dir);
      }, (dir == 'right' ? Book.page_turn_duration * i : Book.page_turn_duration - (Book.page_turn_duration * i)), page, i);
    }
  }

  function showPages (Book, dir) {
    for (var i = 0; i < Book.current.length; i++) {
      var page = Book.images[Book.current[i]];
      var regex = new RegExp(' ?book_page_hidden--' + dir);
      page.className = page.className.replace(regex, '');
      page.className += (' book_page_opening--from_' + dir);
      setTimeout(function (page, i) {
        page.className = page.className.replace(/ ?book_page_opening--from_\w+/, ' book_page_displayed');
      }, Book.page_turn_duration, page, i);
    }
  }

  function switchToFast (Book) {
    Book.page_turn_duration = 100;
    Book.section.className += ' fast';
  }

  function revertToSlow (Book) {
    Book.page_turn_duration = 400;
    Book.section.className = Book.section.className.replace(/ ?fast/, '');
  }

  function updatePageNumbers (Book) {
    var new_label = 'Page';
    new_label += Book.current.length > 1 ? 's: ' : ': ';
    new_label += Book.current.map(function (number) {
      if (number === 0) { return 'Front cover' }
      if (number === 1) { return 'Inside cover' }
      if (number === 51) { return 'Back cover' }
      return parseInt(number) - 1;
    }).join(' & ');
    return new_label;
  }

  function navigateToPage (Book, page_id) {
    var page_id = parseInt(page_id);
    if (Book.current.indexOf(page_id) !== -1) { return; }

    if (Book.turn_queue.length > 0) {
      Book.turning = false;
      Book.turn_queue = [];
    }
    // we id spreads by leftmost (odd) page, so:
    if (page_id !== 0 && page_id % 2 === 0) { page_id--; }

    Book.turning = true;
    Book.close = Book.current.slice();
    Book.current = [ page_id ]
    if (page_id !== 0 && page_id !== Book.images.length - 1) {
      Book.current.push(page_id + 1);
    }

    if (Book.current[0] > Book.close[0]) {
      var earliest = Book.close[0];
      var latest = Book.current[0];
      var hideTowards = 'left';
    } else {
      var earliest = Book.current[0];
      var latest = Book.close[0];
      var hideTowards = 'right';
    }

    var pages_between = Math.abs(latest - (earliest === 0 ? (earliest + 1) : (earliest + 2)));

    for (var i = latest - 1; i >= latest - pages_between; i--) {
      Book.images[i].className = Book.images[i].className
        .replace(/book_page_hidden--\w*/, 'book_page_hidden_immediately--' + hideTowards);
      setTimeout(function (i) {
        Book.images[i].className = Book.images[i].className
          .replace(/book_page_hidden_immediately--\w*/, 'book_page_hidden--' + hideTowards);
      }, 10, i);
    };

    var layout = Book.current.length === 1 ? 'single' : 'spread';
    if (layout == 'single') {
      hidePages(Book, hideTowards);
      showPages(Book, hideTowards === 'left' ? 'right' : 'left');
      setTimeout(function () {
        if (Book.turn_queue.length === 0) {
          setLayout(Book, layout);
          setTimeout(moveUpTurnQueue, Book.page_turn_duration * 1.5, Book);
        } else {
          moveUpTurnQueue(Book);
        }
      }, Book.page_turn_duration * 1.8);
    } else {
      setLayout(Book, layout);
      setTimeout(function () {
        hidePages(Book, hideTowards);
        showPages(Book, hideTowards === 'left' ? 'right' : 'left');
        setTimeout(moveUpTurnQueue, Book.page_turn_duration * 1.5, Book);
      }, (Book.close.length === 1 ? Book.page_turn_duration : 0));
    }
  }

  function getMeasurements (Book, image) {
    var measurements = {
      width: image.width,
      height: image.height,
      ratio: (image.height / image.width) * 100
    }
    return measurements;
  }

  function setStyles(Book, measurements) {
    styles = styles.replace(/\$ratio/g, (measurements.ratio + '%'));
    styles = styles.replace(/\$page_turn_duration/g,
      ((Book.page_turn_duration / 1000) + 's'));
    styles = styles.replace(/\$page_turn_duration_half/g,
      ((Book.page_turn_duration_half / 1000) + 's'));
    styles = styles.replace(/\$page_width/g, (measurements.width + 'px'));
    styles = styles.replace(/\$page_height/g, (measurements.height + 'px'));
    styles = styles.replace(/\$spread_width/g, ((measurements.width * 2) + 'px'));
    return styles;
  }
})();
