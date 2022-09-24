# fitbit-ticker

`fitbit-ticker` is similar to the standard Fitbit `marquee-text` component, but has a few additional capabilities.

## Installation

In your project's `app` directory, create a sub-directory named `widgets`. Copy `construct-widgets.js` into that directory.

Within `app/widgets`, create a sub-directory named `ticker`. Copy the widget's `index.js` into that directory.

In your project's `resources` directory, create a sub-directory named `widgets`. In `widgets`, create a sub-directory named `ticker`. Copy the widget's `index.view` and `styles.css` into that directory.

In your `resources/widget.defs`, include:

> `<link rel="import" href="widgets/ticker/index.view" />`

In your `app/index.js`, include:
> `import './widgets/ticker'`

You don't need to include any of the other files from this repository in your project; they're just documentation and usage examples.

## Usage

### SVG

In your `resources/index.view`, declare `<use>` elements for all instances of the ticker symbol that you need. See the sample `resources/index.view` for an example.

Initialise ticker element attributes. Standard `GraphicsElement` attributes (`x`, `fill`, *etc*) should work normally.

You can initialise some ticker sub-elements with `<use>` (see the sample). Sub-elements include:

* `text`: attributes are:
  * `text-buffer`: message to display; same as `marquee-text text`. Default: `''`.
  * `text-anchor`: if text is short enough to fit within the `<use>` element, it will not scroll and will be aligned according to this attribute. Options are `start`, `middle`, `end`. This has no effect if text needs to scroll. Default: `start`.
* `config`: a non-visible text element that can be used to specify non-standard attributes. Options are:
  * `gap`: distance (pixels) between repeats of the text; same as `marquee-text separator`. Default: 87.
  * `speed`: scroll speed (pixels/second); equivalent to `marquee-text value`. Default: 120.
  * `enabled`: whether text will initially scroll if needed; equivalent to `marquee-text mode`. Default: `true`.
  * `repeatCount`: how many times to scroll (Number or `indefinite`). Default: `indefinite`.

### CSS

Alternatively/additionally, you can apply styles to your ticker elements in your `resources/styles.css`. See the sample file for examples.

### JS

Optionally, you can control a ticker in JS code. To do so, use `getElementById()` to obtain a reference to the element object, then use the object's properties and/or methods (*ie*, the same way you manipulate other elements in JS).

Ticker element object properties:

* `enabled`: whether text will scroll if it is too wide (boolean)
* `text`: change displayed message (string)
* `gap`: change spacing (pixels) between repeats of text (Number)
* `speed`: change speed (pixels/sec) of animation (Number)
* `repeatCount`: how many times to scroll (Number or 'indefinite')
* `onanimationstart`: function to call when animation restarts
* `onanimationiteration`: function to call when animation steps
* `onanimationend`: function to call when animation ends

Ticker element object methods:

* `changeWidth(newWidth)`: set new `.width` on ticker element and reassess whether text needs to scroll.

See the sample `app/index.js` for examples.

## Issues

Text may not be displayed if widget is enabled in `.view` and disabled in JS during startup. Workaround: if you want the widget to be initially disabled, set `enabled:false` in `.view`.

There is minimal error-checking of the `config` text.

If scrolling is stopped, it can't be resumed from its current position. It will always resume from the start.

Changing text, gap, speed and width will restart scrolling (if required) from its initial position, rather than continuing from its current position.

This probably won't work if placed within a `<g>` and rotated, due to a quirk in `TextElement.getBBox()`.

`onanimationstart`, *etc*, may not work in some SDK versions.