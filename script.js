/* Licensed under the Academic Free License version 3.0
	- See a copy of the AFL-3.0 at https://spdx.org/licenses/AFL-3.0 
	- Any copyright dedicated to the public domain: https://creativecommons.org/publicdomain/zero/1.0/ */
// @license magnet:?xt=urn:btih:90dc5c0be029de84e523b9b3922520e79e0e6f08&dn=cc0.txt

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
function bingoCard(query,hash) {
	var fc = [], ic = 0, qc="?", vc = 0,
	rc = Math.floor(Math.random() * 25),
	gc = document.querySelectorAll("b");
	if (!query) {
		while (fc.length < 25) {
			if (rc == ic) {
				let nc = RandomBits(4);
				fc.push(64);
				gc[ic++].textContent = Object.values(ov)[nc];
				qc += Object.keys(ov)[nc];
			} else {
				let nc = RandomBits(6);
				if (!fc.includes(nc)) {
					fc.push(nc);
					gc[ic++].textContent = Object.values(bv)[nc];
					qc += Object.keys(bv)[nc];
				}
			}
		}
		location.hash = "";
		document.forms[0].reset();
		location.search = qc;
	} else { qc = decodeURIComponent(query); }
	history.replaceState({}, "", qc);
	document.querySelector("a").href = location.href;
	if (query) {
		while (vc < 25) {
			let pc = qc.charAt(vc + 1);
			if (pc in bv) { gc[vc++].textContent = bv[pc];
			} else {
				gc[vc++].textContent = ov[pc];
			}
		}
		if (hash && hash.length>24) {
			SummonMarks(decodeURIComponent(hash));
			SaveMarks();
		} else {
			location.hash = "";
			document.forms[0].reset();
		}
	}
}
function SaveMarks() {
	var h = "";
	for (const cb of document.querySelectorAll("input[type=checkbox]")) {
		h += cb.checked?"☑":"☐";
	}
	location.hash = h;
	document.querySelector("a").href = location.href;
	if (/^☑{5}|^[☐|☑]{5}☑{5}|^[☐|☑]{10}☑{5}|^[☐|☑]{15}☑{5}|^[☐|☑]{20}☑{5}|☑[☐|☑]{4}☑[☐|☑]{4}☑[☐|☑]{4}☑[☐|☑]{4}☑|^☑[☐|☑]{5}☑[☐|☑]{5}☑[☐|☑]{5}☑[☐|☑]{5}☑|^[☐|☑]{4}☑[☐|☑]{3}☑[☐|☑]{3}☑[☐|☑]{3}☑[☐|☑]{3}☑/.test(h)) {
		document.querySelector("fieldset").toggleAttribute("disabled");
		playAudio(document.querySelector("audio"));
	}
}
function EnableMarks() {
	let d = document.querySelector('fieldset');
	if (d.hasAttribute('disabled')) d.toggleAttribute('disabled');
}
function SummonMarks(h) {
	let i = 1;
	for (const cb of document.querySelectorAll("input[type=checkbox]")) {
		cb.checked = (h.charAt(i++) == "☑")?true:false;
	}
}
async function playAudio(b) {
	await b.play();
}
window.addEventListener('DOMContentLoaded', async (event) => {
	if (document.querySelector("b")) return;
	let fs = document.querySelector("fieldset"),
	t = document.querySelector("template"),
	p = 25;
	while (p--) {
		fs.appendChild(t.content.cloneNode(true));
	}
	for await (const cb of document.querySelectorAll("input[type=checkbox]")) {
		cb.addEventListener('change', (event) => { SaveMarks(); });
	}
	bingoCard(location.search,location.hash);
});
// @license-end
