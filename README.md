# Podcast Bingo

[Live demo.](https://podcastbingo.pages.dev)

## Description

An example of generating random playable Bingo cards for when listening to a podcast episode.
[![Screenshot](https://web.archive.org/web/20210426064422id_/https://i.kym-cdn.com/photos/images/original/002/084/129/537.png)](https://podcastbingo.pages.dev)

Podcast Bingo is a variant of [Buzzword Bingo](https://en.wikipedia.org/wiki/Buzzword_bingo) AKA Bullshit Bingo, where each square is populated either with a phrase one of the hosts commonly says or known idiosyncracy of theirs.

## How to play

The object of the game is for players to click or tap on a square in the 5x5 bingo card grid with a word or phrase in it that matches what is said by someone in the podcast episode all players are simultaneously listening to.
There is no limit to the number of players in any game of Podcast Bingo.

At any time a player can share their progress with other players by copying the "BOOKMARK THIS POINT IN YOUR GAME" link on the left of the page and sharing that link.

To win, a player must be the first to mark off five squares in a row vertically, horizontally or diagonally on their card and declare BINGO! That player MUST share either a link to their winning card or screenshare it.

The idea is for all players to be either in the same physical room and/or online chatroom. The type (textual/audio/video) doesn't matter as long as it's easy enough for everyone's listening experience to be in synchrony and to share screens or links to their bingo cards.

Each bingo card is randomly generated upon first visiting the page and again each time the [New Card] button is pressed. The chance of any two players generating the exact same bingo card are one in a hundred twenty-six octovigintillion eight hundred eighty-six septenvigintillion nine hundred thirty-two sexvigintillion one hundred eighty-five quinvigintillion eight hundred eighty-four quattuorvigintillion one hundred sixty-four trevigintillion one hundred three duovigintillion four hundred thirty-three unvigintillion three hundred eighty-nine vigintillion three hundred thirty-five novemdecillion one hundred sixty-one octodecillion four hundred eighty septendecillion eight hundred two sexdecillion eight hundred sixty-five quindecillion five hundred sixteen quattuordecillion one hundred seventy-four tredecillion five hundred forty-five duodecillion one hundred ninety-two undecillion one hundred ninety-eight decillion eight hundred one nonillion eight hundred ninety-four octillion three hundred seventy-five septillion two hundred fourteen sextillion seven hundred four quintillion two hundred thirty quadrillion four hundred twenty trillion nine hundred twenty-two billion seven hundred eighty-nine million eight hundred and eighty-eight thousand.

Squares that are mistakenly or wrongly marked off can be clicked or tapped on again to undo that checkmark.

TIP: If a player mistakenly or wrongly reaches BINGO they can tap/click their web browser's "back" button, then the "reload" button to undo their final BINGO-reaching checkmark.

The [New Card] and [Clear] buttons are provided for player convenience should they start listening to a new podcast episode.

## About the project

### HTML

The bingo card is a standard HTML form with a **javascript:** URL as the ACTION attribute tied to the [New Card] labeled input of **type="submit"**, and a separate [Clear] labeled input of **type="reset"**. That is to say, this project is **entirely clientside code** and works without a webserver.

The 25 squares are the **label**s of input **type="checkbox"** the textual contents of which are randomly generated using javascript.
For this reason anyone visting the page with javascript turned off will be asked to turn it on:

```html
<fieldset>
  <legend><noscript>Please&nbsp;enable&nbsp;javascript</noscript></legend>
</fieldset>
```

A **fieldset** is used to contain the squares so they can all be programmatically enabled for play and disabled when BINGO is reached without needing a code loop.

The square-generating code uses the [template html5 tag](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/template):

```html
<template
  ><label><input type="checkbox" /><b></b></label
></template>
```

When BINGO is reached the audio that plays is a standard html audio tag with a **data:** URL source of an Opus audio format 3kb file which was converted to a base64 encoded string.

All code has been checked as being valid and standards compliant, and the page passes multiple accessibility checks.

### CSS

To arrange the 25 squares into a 5x5 bingo card, the **fieldset** element uses a **grid-template**:

```CSS
	display: grid;
	grid-template: repeat(5, 1fr) / repeat(5, 1fr);
```

and the **label** elements use **inline-grid** with appropriate CSS for both vertically and horizontally centered text:

```CSS
	display:inline-grid;
	text-align: center;
	align-items: center;
```

The unticked checkbox **input** elements are invisible until their corresponding label is clicked or tapped, and then appear inside their squares to make them obvious to see (**counter-increment** keeps track of the total number of ticked boxes):

```CSS
label > input[type="checkbox"] {
	position: absolute;
	top: 50%;
	left: 50%;
	transform: scale(5) perspective(1px) translate(-12.5%,-15%);
	opacity: 0;
}
label > input[type="checkbox"]:checked {
  opacity: 0.7;
  accent-color: #08F;
  counter-increment: boxes;
}
```

When BINGO is reached and the card is disabled so no squares can be clicked on, it makes the disabled checkboxes look crappy, so they're replaced with the emoji version:

```CSS
label > input[type="checkbox"]:disabled {
	appearance: none;
}
label > input[type="checkbox"]:disabled::before {
	content: "☑️";
}
```

### Javascript

When the page is first loaded it generates the empty squares of the bingo card:

```javascript
let fs = document.querySelector("fieldset"),
  t = document.querySelector("template"),
  p = 25;
while (p--) {
  fs.appendChild(t.content.cloneNode(true));
}
```

then it checks in the **bingoCard** function if there's a ?query string to know whether to populate an existing or new bingo card. If there is none it goes through the loop which begins with:

```
while (fc.length < 25) {
```

In this loop, the **textContent** in 24 of the 25 squares are populated randomly without duplication from 64 text properties of object **bv** each with single character labels so their order can be stored in the page URL ?query from string **qc**. This is where people remixing this project to fit their favorite podcast modify the list of terms:

```javascript
let nc = RandomBits(6);
if (!fc.includes(nc)) {
  fc.push(nc);
  gc[ic++].textContent = Object.values(bv)[nc];
  qc += Object.keys(bv)[nc];
}
```

Each term is chosen using a binary index number built using one of two random methods determined by whether one (randomly selected) of 14 decimal places in the angle of the clock's second hand is odd or even:

```javascript
function RandomBits(b) {
  let n = "",
  p = document.getElementById("pang").transform.animVal[0];
  if((p)&&(p.angle>0)){
    p=p.angle.toFixed(Math.floor(Math.random() * 14)).at(-1);
  }
  let q=p?p:Math.random().toFixed();
  if (q & 1)
    while (n.length < b) n += Math.random().toFixed();
  else {
    const barray = new Uint32Array(b);
    self.crypto.getRandomValues(barray);
    for (const u of barray) {
      n += (u & 1)?1:0;
    }
  }
  return Number.parseInt(n,2);
}
```
and the last (randomly selected) square is similarly populated from one of 16 text properties of object **ov**. This is a group of words/phrases much less likely to be said in a podcast episode, or more likely if players want a quicker game. It's up to whoever modifies this list of terms for their desired podcast:

```javascript
let nc = RandomBits(4);
fc.push(64);
gc[ic++].textContent = Object.values(ov)[nc];
qc += Object.keys(ov)[nc];
```

Otherwise if there _is_ a query string **qc** then the **textContent** of all the squares **gc** are populated with strings using each char in the query string to fetch the text value of the corresponding **pc** property name in the **bv** and **ov** objects of a previously existing bingo card:

```javascript
	while (vc < 25) {
		let pc = qc.charAt(vc + 1);
		if (pc in bv) { gc[vc++].textContent = bv[pc];
		} else {
			gc[vc++].textContent = ov[pc];
		}
```

and the game state of which checkboxes are ticked, if it exists in the #hash, is also restored:

```javascript
if (hash && hash.length > 24) {
  SummonMarks(decodeURIComponent(hash));
  SaveMarks();
} else {
  location.hash = "";
  document.forms[0].reset();
}
```

When BINGO is reached it is detected via a regex check of the game state hash string **h** in the **SaveMarks** function which was set up to run whenever a square is clicked on or tapped, and if the game is won it disables the bingo card and plays Leslie Nielson's audio:

```javascript
if (
  /^☑{5}|^[☐|☑]{5}☑{5}|^[☐|☑]{10}☑{5}|^[☐|☑]{15}☑{5}|^[☐|☑]{20}☑{5}|☑[☐|☑]{4}☑[☐|☑]{4}☑[☐|☑]{4}☑[☐|☑]{4}☑|^☑[☐|☑]{5}☑[☐|☑]{5}☑[☐|☑]{5}☑[☐|☑]{5}☑|^[☐|☑]{4}☑[☐|☑]{3}☑[☐|☑]{3}☑[☐|☑]{3}☑[☐|☑]{3}☑/.test(
    h
  )
) {
  document.querySelector("fieldset").toggleAttribute("disabled");
  playAudio(document.querySelector("audio"));
}
```

### SVG

There are three SVG images, the WORKING CLOCKFACE (an extra analog source of randomness), the BOOKMARK one and the BINGO game ending one, and all are coded inline within the html file.
[![Bookmark](https://web.archive.org/web/20210924101550id_/http://svgur.com/i/aUr.svg)](https://podcastbingo.pages.dev)

One thing of note is that **textLength** and **lengthAdjust** are attributes used to ensure "BOOKMARK YOUR POINT IN THIS GAME", which is actual text, is constrained inside the graphic because there's no telling what default **sans-serif** fonts with varying widths people have installed.

```xml
<text x="80" y="295" style="stroke:black;fill:goldenrod;filter:url(#cluster);font-size:60px;font-weight:bold;font-family:sans-serif"
	textLength="355" lengthAdjust="spacingAndGlyphs">BOOKMARK</text>
<text x="105" y="345" style="stroke:black;fill:goldenrod;filter:url(#cluster);font-size:54px;font-weight:bold;font-family:sans-serif"
	textLength="305" lengthAdjust="spacingAndGlyphs">THIS POINT</text>
<text x="80" y="390" style="stroke:black;fill:goldenrod;filter:url(#cluster);font-size:48px;font-weight:bold;font-family:sans-serif"
	textLength="355" lengthAdjust="spacingAndGlyphs">IN YOUR GAME</text>
```

[![Bingo](https://web.archive.org/web/20210924101448id_/http://svgur.com/i/aWC.svg)](https://podcastbingo.pages.dev)
Also, the BINGO svg code being after the bingo card but moved over the top of it designed to fade into visibility once BINGO is reached, is in a higher layer therefore **pointer-events:none** is needed for it in the style.css file to allow clicks/taps to get through it to the bingo card:

```CSS
#svg2 {
	opacity:0;
	width:656px;
	position:relative;
	top:-444px;
	pointer-events:none;
	display:block;
	margin:0 auto;
	transition:opacity 1s;
}
fieldset:disabled + #svg2 {
	opacity:0.6;
}
```

## License

Dual-licensed as [Public Domain](https://creativecommons.org/publicdomain/zero/1.0/) and, where that cannot be abided, under the [Academic Free License version 3.0](https://github.com/Mardeg/podcastbingo/blob/main/LICENSE.md)

## Browsers tested

### Gecko-based
Fully functional with no errors in:
- Firefox
- Tor Browser
- SeaMonkey
- Zen

### Blink-based
Fully functional with no errors in:
- Chrome
- Ungoogled Chromium
- SRWare Iron
- Edge

### Webkit-based
- Safari: Functional, no audio.
- Falkon: "New Card" button is non-functional.

### Other
- Servo: Non-functional on Linux, squares not populated ([Issue #34604](https://github.com/servo/servo/issues/34604)).
