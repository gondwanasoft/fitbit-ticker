// This file is not a part of the widget template. It demonstrates how to use the sample widget code.
import document from 'document'
import './widgets/ticker'

const myTicker = document.getElementById('myTicker')

// If you initialise your ticker thoroughly in .view and/or .css, you don't need to do it in JS.
// You should only manipulate your ticker in JS if something needs to change while your app is running.
myTicker.text = 'Text set in code.'
myTicker.gap = 20
myTicker.speed = 100
myTicker.repeatCount = 5
myTicker.onanimationstart = myTicker.onanimationend = onAnimation
//myTicker.enabled = false  // TODO 1 causes nothing to be seen if myTicker was enabled in .view

setTimeout(() => {
  myTicker.changeWidth(150)
}, 6000)

function onAnimation(evt) {
  console.log(`onAnimation this=${this.id} type=${evt.type}`);
}

document.getElementById('touch').onclick = evt => {
  if (evt.screenY < 168) myTicker.text = evt.screenX < 168? 'The.' : 'The quick brown.'
  else myTicker.enabled = evt.screenX > 168
}