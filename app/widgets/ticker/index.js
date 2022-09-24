import { constructWidgets, parseConfig } from "../construct-widgets";   // xTODO x06 Don't import parseConfig if you don't use a config element in your widget.

const construct = (el) => {
  // el: the element object returned by getElementsByTypeName().

  // PRIVATE MEMBERS:

  const textEl = el.getElementById('text')
  const copyEl = el.getElementById('copy')

  let elWidth = el.getBBox().width
  let textWidth
  let gapWidth = 87
  let isEnabled = false   // true if text should move if too long
  let tooWide = false     // true if text is wider than el
  let speed = 120         // px/sec
  let repeatCount = 'indefinite'    // or a Number
  let textAnchor = 'start'
  let staticTextElX = 0       // textEl.x if text doesn't need to animate; depends on elWidth and textAnchor

  const prepareAni = () => {
    // Depends on elWidth, textWidth, gapWidth, speed, repeatCount, staticTextElX, textAnchor, isEnabled.
    // Updates tooWide.

    const textAniEl = textEl.getElementById('ani')
    const copyAniEl = copyEl.getElementById('ani')

    tooWide = textWidth > elWidth   // text doesn't fit within symbol so it needs to scroll
    textEl.textAnchor = tooWide? 'start' : textAnchor

    if (isEnabled) {
      //console.log(`textW=${textWidth} elW=${elWidth} wide=${tooWide} anchor=${textEl.textAnchor} staticX=${staticTextElX}`);

      copyEl.style.display = tooWide? 'inline' : 'none'

      if (tooWide) {    // need to animate
        const textPlusgapWidth = textWidth + gapWidth
        textEl.x = 0
        copyEl.x = textPlusgapWidth
        textAniEl.from = 0
        textAniEl.to = -textPlusgapWidth
        copyAniEl.from = textPlusgapWidth
        copyAniEl.to = 0
        textAniEl.dur = copyAniEl.dur = textPlusgapWidth / speed
        textAniEl.repeatCount = copyAniEl.repeatCount = repeatCount
        animate(true)
      } else {        // not too wide; won't animate
        textAniEl.from = textAniEl.to = textEl.x = staticTextElX  // so <animate> elements won't interfere
        //console.log(`${textAniEl.from} ${textAniEl.to} ${textEl.x}`);
        animate(false)
      }
    } else {  // not enabled; ie, not to be animated, and .x IAW textAnchor
      textAniEl.from = textAniEl.to = textEl.x = tooWide? 0 : staticTextElX  // so <animate> elements won't interfere
      copyEl.style.display = 'none'
      animate(false)
      // TODO 1 ^ calling stopAnimation at startup can cause initial text not to appear
      //console.log(`textW=${textWidth} elW=${elWidth} wide=${tooWide} anchor=${textEl.textAnchor} staticX=${staticTextElX}`);
    }
  }

  const animate = doAnimate => {
    const eventName = doAnimate? 'enable' : 'disable'
    textEl.animate(eventName)
    copyEl.animate(eventName)
  }

  const calcStaticTextElX = () => { // depends on elWidth and textAnchor
    switch(textAnchor) {
      case 'start': staticTextElX = 0; break
      case 'middle': staticTextElX = elWidth / 2; break
      case 'end': staticTextElX = elWidth; break
    }
  }

  // PUBLIC API:

  Object.defineProperty(el, 'text', {
    get() {
      return textEl.text
    },
    set(newValue) {
      textEl.text = copyEl.text = newValue
      textWidth = textEl.getBBox().width
      //console.log(`el.width=${elWidth} textWidth=${textWidth}`);
      prepareAni()
    }
  })

  Object.defineProperty(el, 'gap', {
    set(newValue) {
      gapWidth = newValue
      prepareAni()
    }
  })

  Object.defineProperty(el, 'speed', {
    set(newValue) {
      speed = newValue
      prepareAni()
    }
  })

  Object.defineProperty(el, 'repeatCount', {
    set(newValue) {
      repeatCount = newValue
      prepareAni()
    }
  })

  Object.defineProperty(el, 'enabled', {
    set(newValue) {
      //console.log(`enabled=${newValue}`);
      isEnabled = newValue
      prepareAni()
    }
  })

  Object.defineProperty(el, 'onanimationstart', {
    set(newValue) {
      textEl.onanimationstart = newValue
    }
  })

  Object.defineProperty(el, 'onanimationiteration', {
    set(newValue) {
      textEl.onanimationiteration = newValue
    }
  })

  Object.defineProperty(el, 'onanimationend', {
    set(newValue) {
      textEl.onanimationend = newValue
    }
  })

  el.changeWidth = newValue => {
    // If width is changed, animations need to be checked to see if the text needs to scroll.
    el.width = elWidth = newValue
    calcStaticTextElX()
    prepareAni()
  }

  // INITIALISATION:
  ;(function () {     // we use an IIFE so that its memory can be freed after execution
    let enable = true   // start automatically; if not, wait for enabled to be called

    // Parse and process any attributes specified in the config element.
    parseConfig(el, attribute => {
      // This anonymous function is called for every attribute in config.
      // attribute is {name:attributeName, value:attributeValue}
      switch(attribute.name) {
        case 'gap':
          gapWidth = Number(attribute.value)
          break
        case 'speed':
          speed = attribute.value
          break
        case 'repeatCount':
          repeatCount = attribute.value
          if (repeatCount !== 'indefinite') repeatCount = Number(repeatCount)
          break
        case 'enabled':
          enable = attribute.value === 'true'
          break
        default:
          //console.error(`Unknown attribute name ${attribute.name} in ticker config`)
      }
    })

    // Perform other necessary initialisation; eg, responding to SVG/CSS attributes/styles:

    try {
      //console.log(`${textEl.textAnchor}`);
      textAnchor = textEl.textAnchor
      calcStaticTextElX()
    } catch(e) { }

    el.text = textEl.text // copies text to copyEl, and initialises animations

    if (enable) el.enabled = true
  })();

  return el;
};

constructWidgets('ticker', construct);