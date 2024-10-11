// Currently not in use

class FlashCard extends HTMLElement {
    constructor() {
        super();
        this.touchStartPosition = { x: 0, y: 0 };
        this.currentAxis = 'x';
        this.swipeThreshold = 100;
    }
    connectedCallback() {
        console.log('connected');
        this.addEventListener('touchstart', (e) => {
            const touch = e.touches[0];
            this.touchStartPosition = { x: touch.pageX, y: touch.pageY };
        });
        this.addEventListener('touchmove', (e) => {
            console.log('running');
            e.preventDefault();

            const touch = e.touches[0];
            this.touchOffset = {
                x: touch.pageX - this.touchStartPosition.x,
                y: touch.pageY - this.touchStartPosition.y,
            };

            let newAxis;
            if (Math.abs(this.touchOffset.x) > Math.abs(this.touchOffset.y)) {
                this.touchOffset.y = 0;
                newAxis = 'x';
            } else {
                this.touchOffset.x = 0;
                newAxis = 'y';
            }

            this.style.transform = `translate(${this.touchOffset.x}px, ${this.touchOffset.y}px)`;
        });
        this.addEventListener('touchend', (e) => {
            if (this.touchOffset.x > this.swipeThreshold) {
                this.handleSwipeRight();
            } else if (this.touchOffset.x < -this.swipeThreshold) {
                this.handleSwipeLeft();
            } else if (this.touchOffset.y < -100) {
                this.handleSwipeTop();
            } else {
                this.style.transform = 'translate(0, 0)';
            }
        });
    }

    handleSwipeLeft() {}
    handleSwipeRight() {}
    handleSwipeUp() {}
}
customElements.define('flash-card', FlashCard);
