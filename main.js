import './style.css'

import { config } from './config';

Element.prototype.appendAfter = function (element) {
  element.parentNode.insertBefore(this, element.nextSibling);
}, false;

Element.prototype.appendBefore = function (element) {
  element.parentNode.insertBefore(this, element);
}, false;

const is_block = (i, j) => {
  return _.some(config.blocks, { x: j, y: i });
}

function is_heb(Field) {
  // First choose the required validation

  let HebrewChars = new RegExp("^[\u0590-\u05FF]+$");
  // AlphaNumericChars = new RegExp("^[a-zA-Z0-9\-]+$");
  // EnglishChars = new RegExp("^[a-zA-Z\-]+$");
  // LegalChars = new RegExp("^[a-zA-Z\-\u0590-\u05FF ]+$"); //Note that this one allows space 

  // Then use it

  if (!HebrewChars.test(Field)) {
      return false;
  } else
      return true;
}

var data = JSON.parse(localStorage.getItem("data"));
if(data===null){
  data = Array(config.width*config.height);
}
function init_crossword() {
  const app = document.querySelector('#app')
  for (let i = 0; i < config.height; i++) {
    const row = document.createElement('div');
    for (let j = 0; j < config.width; j++) {
      let letter = document.createElement('input');
      letter.maxLength = 1;
      let w=60;
      let h=60;
      letter.className = `w-[${w}px] h-[${h}px] border-gray-100 outline-none text-black font-bold `
      if (is_block(i, j)) {
        letter.className += ` bg-black `;
        letter.disabled = 'on';
      } else {
        letter.className += ` bg-gray-100 focus:bg-gray-200  text-center focus:border-blue-400 focus:shadow-outline`;
        letter.value = data[i*config.width + j]
      }
      letter.className += " letter";
      letter.style.cssText = "color: transparent; text-shadow: 0 0 0 gray;"; // Input field text styling. This css hides the text caret
      letter.id = `letter_${i}_${j}`; // Don't remove
      letter.setAttribute("x-model",`data`)
      row.appendChild(letter)
    }
    app.appendChild(row)
  }
  

  /*  This is for switching back and forth the input box for user experience */
  const inputs = document.querySelectorAll('#app  *[id]');
  inputs[0].focus();
  for (let i = 0; i < inputs.length; i++) {
    inputs[i].addEventListener('keydown', function (event) {
      if (event.key === "Backspace") {

        if (inputs[i].value == '') {
          if (i != 0) {
            inputs[i - 1].focus();
          }
        } else {
          inputs[i].value = '';
        }

      } else if (event.key === "ArrowRight" && i !== 0) {
        inputs[i - 1].focus();
      } else if (event.key === "ArrowLeft" && i !== inputs.length - 1) {
        inputs[i + 1].focus();
      } else if (event.key === "ArrowUp" && i >= config.width) {
        inputs[i - config.width].focus();
      } else if (event.key === "ArrowDown" && i < config.width * (config.height - 1)) {
        inputs[i + config.width].focus();
      } else if (is_heb(event.key)) {
        inputs[i].value = ''; // Bug Fix: allow user to change a random otp digit after pressing it
      }
    });
    inputs[i].addEventListener('input', function (event) {
      data[i] = inputs[i].value;
      localStorage.setItem("data", JSON.stringify(data));

      if (i === inputs.length - 1 && inputs[i].value !== '') {
        return is_heb(event.key);
      } else if (inputs[i].value !== '') {
        inputs[i + 1].focus();
      }
    });

  }

  let marked = []
  _.forEach(config.horizontal, (value, key) => {
    marked.push(key);
    let num = document.createElement("span");
    num.innerHTML = key;
    num.className = "number";
    num.appendBefore(inputs[value.x + config.width * value.y])

  });

  _.forEach(config.vertical, (value, key) => {
    if (!marked.includes(key)) {
      marked.push(key);
      let num = document.createElement("span");
      num.innerHTML = key;
      num.className = "number";
      num.appendBefore(inputs[value.x + config.width * value.y])
    }
  });

  let reset_btn = document.getElementById("reset_btn");
  
  reset_btn.onclick = () => {
    const inputs = document.querySelectorAll('#app  *[id]');
    data = Array(config.width*config.height);
    localStorage.setItem("data", JSON.stringify(data));
    for(let i in inputs){
      inputs[i].value = '';
    }
  }
  
}

window.addEventListener('load', function() {
  document.querySelector('input[type="file"]').addEventListener('change', function() {
      if (this.files && this.files[0]) {
          var body = document.querySelector('body');
          body.onload = () => {
              URL.revokeObjectURL(img.src);  // no longer needed, free memory
          }

          body.style.backgroundImage = `url(${URL.createObjectURL(this.files[0])}`; // set src to blob url
      }
  });
});


init_crossword();