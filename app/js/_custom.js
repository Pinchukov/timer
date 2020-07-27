// el табло куда выводить
// time время

// comments should be in English only!!!
class Timer {
	constructor(el, time) {
	  this.el = el;
	  this.time = time;
	  this.interval;
	  this.start();
	  this.render();
	}
	start() {
	  this.interval = setInterval(() => this.tick(), 1000);
	  let data = localStorage.getItem('timerData');
	  let timerData = JSON.parse(data);
	  if (timerData != null && timerData.buttonState) {
		clearInterval(this.interval); // if we remove this line here - we can proceed with counting down time, but the button still will be freezed.
		this.time = timerData.time;
		let buttonElement = document.querySelector('.action button');
		alterElement(buttonElement,
		  timerData.buttonState,
		  'Вот и сказочке конец! Лучше чтобы был конец сказке чем конец сказки.');
	  }
	}
	stop() {
	  saveToTheLocalStorage(this.time, true);
	  clearInterval(this.interval);
	}
	tick() {
	  this.time--;
	  this.render();
	  let data = localStorage.getItem('timerData');
	  let timerData = JSON.parse(data);
	  if (timerData != null && timerData.buttonState) {
		saveToTheLocalStorage(this.time, true);
	  } else {
		saveToTheLocalStorage(this.time, false);
	  }
	  if (this.time <= 0) {
		this.stop();
	  }
	}
	render() {
	  let h = parseInt(this.time / 3600);
	  let hs = this.time % 3600;
	  let m = parseInt(hs / 60);
	  let s = hs % 60;
	  this.el.innerHTML = `<div>${h} <span>часов</span></div>
							<div>${m} <span>минут</span></div>
							<div>${s} <span>секунд</span></div>`
	}
  }
  
  
  let el1 = document.querySelector('.timer');
  let t1 = new Timer(el1, 50000);
  
  document.querySelector('.action button').addEventListener('click', function() {
	t1.stop();
	alterElement(this, true, 'Вот и сказочки конец!');
  });
  
  function alterElement(el, flag, message) {
	el.disabled = flag;
	el.innerHTML = message;
	el.classList.add('button-disabled');
  }
  
  function saveToTheLocalStorage(time, state) {
	localStorage.setItem('timerData', JSON.stringify({
	  time: time,
	  buttonState: state
	}));
  }
  