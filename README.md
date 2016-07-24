book.js
===
A JavaScript library for easily creating and manipulating book- or magazine-like experiences in a (modern enough) browser. [Why, though?](#why-is-this-necessary)

_(Small demo coming soon.)_

## Installation
Installation is easy from the command line:
```
npm install bookjs
```
_You probably want to `--save`, but you do you._

### Require it…
_book.js_ is requireable, so if that’s your jam:
```javascript
var Book = require('bookjs');
```

### … or just link to it.
When not `require()`ed, _book.js_ attaches its constructor to the global `window` object, so you’ll want to link to `book.min.js` (which you can find in the `dist/` directory at the root of this project).

```html
  <!-- A bunch of HTML, then, near the bottom of your document: -->
  <script type='text/javascript' src='/path/to/book.min.js'></script>
  <script type='text/javascript' src='/path/to/my_code.js'></script>
</body>
</html>
```

## Using book.js
Using _book.js_ is relatively straightforward. The library returns a constructor you can invoke to create a new book instance which you can then insert into the DOM and control however you —or your users— see fit (i.e. turn pages or navigate directly to a remote page).

Let’s look at what your JS might look like when using _book.js_, then break down the important parts.

```javascript
var img_paths = [ /* strings that point to page images */ ];
var my_book = new Book(img_paths);

var some_section = document.getElementById('some_id');
some_section.parentNode.insertBefore(my_book.markup, some_section);

document.body.addEventListener('keydown', function (event) {
  var leftArrow = (event.key == 'ArrowLeft' || event.keyCode == 37);
  var rightArrow = (event.key == 'ArrowRight' || event.keyCode == 39);
  if (leftArrow) { my_book.prev(); }
  if (rightArrow) { my_book.next(); }
});

var page_15 = document.createElement('button');
page_15.type = 'button';
page_15.innerText = 'Jump to page 15!';
page_15.addEventListener('click', function () {
  my_book.jump(15);
});

my_book.markup.appendChild(page_15);
```

### Initialization
Presuming you’ve required or otherwise included _book.js_, you can initialize a new book like so:

```javascript
var img_paths = [ /* strings representing paths to page images */ ];
var my_book = new Book(img_paths);
```

Note that the first argument (`img_paths` in the example above) is always required. It should be either an array of paths to the page images or a function that returns such an array. Instead of defining an array of images, we could had defined a function like this one:

```javascript
function img_paths () {
  var images = [];
  for (var i = 1; i <= 52; i++) {
    images.push('/images/my_book/page_' + i + '.jpg');
  };
  return images;
}
```

### Insertion
```javascript
var some_section = document.getElementById('some_id');
some_section.parentNode.insertBefore(my_book.markup, some_section);
```

Now that `my_book` has been created, we can insert it into our document by referencing `my_book.markup`. You can put it anywhere you like. In the example above, I’m inserting the UI provided by _book.js_ just before a section with id `some_id`.

### Manipulation
```javascript
document.body.addEventListener('keydown', function (event) {
  var leftArrow = (event.key == 'ArrowLeft' || event.keyCode == 37);
  var rightArrow = (event.key == 'ArrowRight' || event.keyCode == 39);
  if (leftArrow) { my_book.prev(); }
  if (rightArrow) { my_book.next(); }
});
```
While _book.js_ offers focusable previous/next page buttons, it also exposes methods for turning pages programmatically in one direction or the other. In the example above, we add an event listener to the document body and turn `my_book`’s pages if the left or right arrows are pressed.

Naturally, _book.js_ also provides a way to jump to a specific page:

```javascript
var page_15 = document.createElement('button');
page_15.type = 'button';
page_15.innerText = 'Jump to page 15!';
page_15.addEventListener('click', function () {
  my_book.jump(15);
});

my_book.markup.appendChild(page_15);
```
In our example, we create a button that reads _“Jump to page 15!”_, add an event handler to it, invoking `my_book.jump(15)`, and append that button to `my_book`’s markup. This illustrates both how simple it is to jump to a specific page in the book and how you can manipulate the DOM elements provided by _book.js_. `my_book.markup` is simply a reference to the root element of the UI created by _book.js_, so you can treat and navigate through it just like you would any DOM element.

## Options
`Book()` can take an optional object as a second argument:
```javascript
var img_paths = [ /* strings representing paths to page images */ ];
var options = {
  min_load: 5,             // default: 3
  page_turn_duration: 300, // default: 400
  navigator: true          // default: false
}
var my_book = new Book(img_paths, options);
```

`min_load` **Integer**  
_No. of pages the number of pages book.js should wait to finish loading before it’s revealed_

`page_turn_duration` **Integer**  
_Number of milliseconds a page turn should take_

`navigator` **Boolean**  
_If `true`, a spreads navigator UI will be generated for you_

#### Navigator
When `navigator` is true, _book.js_ will include a simple spreads navigation UI below the book (collapsed by default; expanded via controls) exposing buttons that represent the front cover, spreads, and back cover of your book (in order). Currently, _book.js_ expects these thumbnails to have the exact same paths as the page images, with `_thumb` attached to the filename, e.g. a page with path `/images/book/page_1.jpg` would have thumbnail with path `/images/book/page_1_thumb.jpg`.

I think this is an adequate default, but a future version will offer an alternative way to define an array of thumbnails.

---

## Why is this necessary?
I wonder the same thing, friendo, and I’m pretty sure the answer to that question is:

> It most certainly _is not_ necessary.

Yet here you are, looking for something with this functionality (presumably); and here I am, taking a stab at it.

The longer answer is: A client of ours asked for it and I tried to steer them away from it, but they had made up their mind. Compelling arguments against accepting this mission notwithstanding, I did. I figure other devs’ clients will also ask for this, and you don’t want to have to pay for a library with a gazillion features your client doesn’t need, so there you have it. It is what it is.

---

## License
DO WHAT THE FUCK YOU WANT TO PUBLIC LICENSE  
Version 2, December 2004

Copyright (C) 2004 Sam Hocevar <sam@hocevar.net>

Everyone is permitted to copy and distribute verbatim or modified copies of this license document, and changing it is allowed as long as the name is changed. 

DO WHAT THE FUCK YOU WANT TO PUBLIC LICENSE  
TERMS AND CONDITIONS FOR COPYING, DISTRIBUTION AND MODIFICATION 

  0. You just DO WHAT THE FUCK YOU WANT TO.
