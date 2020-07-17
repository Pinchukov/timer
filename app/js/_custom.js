// el табло куда выводить
// time время
class Timer{
	constructor(el, time){
		this.el = el;
		this.time = time;
		this.interval;
		this.start();
		this.render();   
	}
	start() {
		this.interval = setInterval(() => this.tick(), 1000);
	}
	stop() {
		clearInterval(this.interval);
    localStorage.setItem('a', JSON.stringify( this.interval)); 
	}
	tick() {
		this.time--;
		this.render();
		if(this.time <= 0) {
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
		this.disabled = true;
		this.innerHTML = 'Вот и сказочки конец!';
		this.classList.add('button-disabled');
});
