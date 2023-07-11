export default class Slide{
  constructor(slide, wrapper){
    this.slide = document.querySelector(slide);
    this.wrapper = document.querySelector(wrapper);
    this.dist = {finalPosition:0, startX:0, movement:0}
  }

  transition(active){
    this.slide.style.transition = active ? 'transform .3s' : '';
  }

  moveSlide(distX){
    this.dist.movePosition = distX;
    this.slide.style.transform = `translate3d(${distX}px, 0, 0)`;
  }

  updatePosition(clientX){
    this.dist.movement = (this.dist.startX - clientX) * 1.5;
    return this.dist.movement;
  }

  onStart(event){
    if(event.type === "touchstart"){
      this.dist.startX = event.changedTouches[0].clientX;
      this.wrapper.addEventListener("touchmove", this.onMove);
    }else{
      event.preventDefault();
      this.dist.startX = event.clientX;
      this.wrapper.addEventListener("mousemove", this.onMove);
    }
    this.transition(false);
  }

  onMove(event){
    const pointerPosition = (event.type === "mousemove") ? event.clientX : event.changedTouches[0].clientX;
    const finalPosition = this.updatePosition(pointerPosition);
    this.moveSlide(this.dist.finalPosition - finalPosition);
  }

  onEnd(event){
    const moveType = (event.type === "mouseup") ? "mousemove" : "touchmove";
    this.wrapper.removeEventListener(moveType, this.onMove);
    this.dist.finalPosition = this.dist.movePosition;
    this.transition(true);
    this.changeSlideOnEnd();
  }

  changeSlideOnEnd(){
    if(this.dist.movement > 120 && this.index.next !== undefined){
      this.activeNextSlide();
    }else if(this.dist.movement < -120 && this.index.prev !== undefined){
      this.activePrevSlide();
    }else{
      this.changeSlide(this.index.active);
    }
   
  }

  addSlideEvents(){
    this.wrapper.addEventListener("mousedown", this.onStart);
    this.wrapper.addEventListener("touchstart", this.onStart);
    this.wrapper.addEventListener("mouseup", this.onEnd);
    this.wrapper.addEventListener("touchend", this.onEnd);
  }

  bindEvents(){
    this.onStart = this.onStart.bind(this);
    this.onEnd = this.onEnd.bind(this);
    this.onMove = this.onMove.bind(this);
  }

  //Slides config

  slidePosition(slide){
    const margin = ( this.wrapper.offsetWidth - slide.offsetWidth) / 2;
    return -(slide.offsetLeft - margin);
  }

  slidesConfig(){
    this.arraySlide = [...this.slide.children].map((element) => {
      const position = this.slidePosition(element);
      return{element, position}
    });
  }

  slidesIndexNav(index){
    const last = this.arraySlide.length - 1;
    this.index = {
      prev: (index === 0) ? undefined : index - 1,
      active: index,
      next : (index === last) ? index = undefined : index + 1
    }
  }

  changeSlide(index){
    const activeSlide = this.arraySlide[index];
    this.moveSlide(activeSlide.position)
    this.slidesIndexNav(index)
    this.dist.finalPosition = activeSlide.position;
  }

  activePrevSlide(){
    if(this.index.prev !== undefined){
      this.changeSlide(this.index.prev)
    }
  }

  activeNextSlide(){
    if(this.index.next !== undefined){
      this.changeSlide(this.index.next)
    }
  }

  init(){
    this.transition(true);
    this.bindEvents();
    this.addSlideEvents();
    this.slidesConfig();

    return this;
  }
}