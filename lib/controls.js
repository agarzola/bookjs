(function () {
  module.exports = controls;

  function controls (Book) {
    var container = document.createElement('div');
    container.className = 'book_controls';

    var prev_next_buttons = makePrevNextButtons(Book);
    if (prev_next_buttons) {
      container.appendChild(prev_next_buttons);
    }

    if (Book.navigator) {
      var navigator_toggle = makeNavigatorToggle();
      if (navigator_toggle) {
        container.appendChild(navigator_toggle);
      }
    }

    var section = Book.section
    var requestFullscreen = section.requestFullscreen ||
                            section.webkitRequestFullscreen ||
                            section.mozRequestFullScreen;

    if (requestFullscreen) {
      var fullscreen_toggle = makeFullscreenToggle(section, requestFullscreen);
      if (fullscreen_toggle) {
        container.appendChild(fullscreen_toggle);
      }
    }

    return container;
  }

  function makePrevNextButtons (Book) {
    var container = document.createElement('div');
    container.className = 'book_controls--prev_next'

    var prev = document.createElement('button');
    prev.type = 'button';
    prev.className = 'book_controls--prev';
    prev.innerText = 'Back';
    prev.addEventListener('click', function (event) {
      Book.prev();
    });

    container.appendChild(prev);

    var paragraph = document.createElement('p');

    var label = document.createElement('span');
    label.id = 'book_controls--current_page_label';
    label.className = 'book_controls--current_page_label';
    label.innerText = 'Page: Front cover';

    var total = document.createTextNode(' of ' + (Book.images.length - 2));
    paragraph.appendChild(label);
    paragraph.appendChild(total);

    container.appendChild(paragraph);

    var next = document.createElement('button');
    next.type = 'button';
    next.className = 'book_controls--next';
    next.innerText = 'Forward';
    next.addEventListener('click', function (event) {
      Book.next();
    });

    container.appendChild(next);

    return container;
  }

  function makeNavigatorToggle () {
    var navigator_toggle = document.createElement('button');
    navigator_toggle.type = 'button';
    navigator_toggle.className = 'book_controls--navigator_toggle';
    navigator_toggle.addEventListener('click', function toggleNavigator () {
      var body = document.body;
      if (body.className.match(/show_navigator/)) {
        body.className = body.className.replace(/ ?show_navigator/, '');
      } else {
        body.className += ' show_navigator';
      }
    });
    navigator_toggle.innerText = 'Navigator';

    return navigator_toggle;
  }

  function makeFullscreenToggle (section, requestFullscreen) {
    var exitFullscreen = document.exitFullscreen ||
                         document.webkitExitFullscreen ||
                         document.mozCancelFullScreen;

    var fullscreen_toggle = document.createElement('button');
    fullscreen_toggle.type = 'button';
    fullscreen_toggle.className = 'book_controls--fullscreen_toggle';
    fullscreen_toggle.addEventListener('click', function toggleFullScreen () {
      var fullscreen_status = document.fullscreenElement ||
                              document.webkitFullscreenElement ||
                              document.mozFullscreenElement;
      if (fullscreen_status) {
        exitFullscreen.call(document);
      } else {
        requestFullscreen.call(section);
      }
    });

    var fullscreen_change_events = [
      'fullscreenchange',
      'webkitfullscreenchange',
      'mozfullscreenchange',
      'msfullscreenchange'
    ]

    // for (var i = 0; i < fullscreen_change_events.length; i++) {
    //   document.addEventListener(fullscreen_change_events[i],
    //     changeFullscreeToggleText);
    // };

    var fullscreen_error_events = [
      'fullscreenerror',
      'webkitfullscreenerror',
      'mozfullscreenerror',
      'msfullscreenerror'
    ]

    for (var i = 0; i < fullscreen_error_events.length; i++) {
      document.addEventListener(fullscreen_error_events[i],
        disbleFullscreenToggle);
    };

    fullscreen_toggle.innerText = 'Full Screen';

    return fullscreen_toggle;

    function changeFullscreeToggleText (event) {
      var fullscreen_el = document.fullscreenElement ||
                          document.webkitFullscreenElement ||
                          document.mozFullscreenElement;
      if (fullscreen_el && fullscreen_el.id && fullscreen_el.id.match(/bookjs/)) {
        fullscreen_toggle.innerText = 'Cancel full screen mode';
      } else {
        fullscreen_toggle.innerText = 'View in full screen mode';
      }
    }

    function disbleFullscreenToggle (event) {
      fullscreen_toggle.setAttribute('disabled', true);
    }
  }
})();
