const sliderStyles = `
  * {
    box-sizing: border-box;
  }

  .slideshow-container {
    position: relative;
    margin: auto;
  }

  .slide {
    display: none;
    position: relative;
  }

  .prev, .next {
    cursor: pointer;
    position: absolute;
    top: 40%;
    width: auto;
    padding: 16px;
    color: white;
    font-weight: lighter;
    font-size: 100px;
    transition: 0.6s ease;
    border-radius: 0 3px 3px 0;
    user-select: none;
  }

  .next {
    right: 0;
    border-radius: 3px 0 0 3px;
  }

  .prev:hover,
  .next:hover {
    background-color: rgba(0, 0, 0, 0.8);
  }

  .dot {
    cursor: pointer;
    height: 15px;
    width: 15px;
    margin: 0 2px;
    background-color: #bbb;
    border-radius: 50%;
    display: inline-block;
    transition: background-color 0.6s ease;
  }

  .active, .dot:hover {
    background-color: #717171;
  }

  .from-left {
    animation-name: from-left;
    animation-duration: 0.6s;
  }

  .from-right {
    animation-name: from-right;
    animation-duration: 0.6s;
  }

  @keyframes from-left {
    from { left: 400px; }
    to { left: 0px; }
  }

  @keyframes from-right {
    from { right: 400px; }
    to { right: 0px; }
  }

  @media only screen and (max-device-width: 768px) {
    .next, .prev {
      display: none;
    }
  }
`;

function sliderScript(id) {
  return `
  var slideIndices = slideIndices || {};
  var Directions = {
    RIGHT: 'right',
    LEFT: 'left',
  };
  slideIndices[${id}] = 1;
  showSlides${id}(slideIndices[${id}]);

  function plusSlides${id}(n, arrowType) {
    showSlides${id}((slideIndices[${id}] += n), arrowType);
  }

  function currentSlide${id}(n) {
    showSlides${id}((slideIndices[${id}] = n));
  }

  function showSlides${id}(n, arrowType) {
    const sliderInstance = document.querySelector('#__slider-__instance-__id-__unique__${id}');

    if (!sliderInstance) return;
    const slides = Array.from(sliderInstance.getElementsByClassName('slide'));
    const dots = Array.from(sliderInstance.getElementsByClassName('dot'));

    if (n > slides.length) slideIndices[${id}] = 1;
    if (n < 1) slideIndices[${id}] = slides.length;

    slides.forEach((slide, index) => {
      if (index === slideIndices[${id}] - 1) {
        const { LEFT, RIGHT } = Directions;
        slide.style.display = 'block';
        slide.classList.remove('from-right');
        slide.classList.remove('from-left');
        if (arrowType === RIGHT) slide.classList.add('from-left');
        if (arrowType === LEFT) slide.classList.add('from-right');
      } else slide.style.display = 'none';
    });

    dots.forEach((dot, index) => {
      if (index === slideIndices[${id}] - 1) dots[slideIndices[${id}] - 1].classList.add('active');
      else dot.classList.remove('active');
    });
  }
`
};

function sliderHTML(id) {
  return `
  <div id="__slider-__instance-__id-__unique__${id}">
    <div class="slideshow-container">
      <div id="main-slider"></div>
      <a id="prev" class="prev" onclick="plusSlides${id}(-1, Directions.LEFT)">
        <img src="assets/icons/chevron-left-solid.svg" />
      </a>
      <a id="next" class="next" onclick="plusSlides${id}(1, Directions.RIGHT)">
        <img src="assets/icons/chevron-right-solid.svg" />
      </a>
    </div>

    <br />

    <div id="dots-container" style="text-align: center"></div>
  </div>
  `;
}

class Slider {
  static instanceId = 0;
  #element;
  #options;
  #scriptElement;
  #styleSheetElement;

  constructor(element, options = null) {
    if (!element) throw new Error('A valid HTML node is required as Slider argument');
    Slider.instanceId++;
    this.#options = options;
    this.#appendScriptsAndStyles();
    this.#element = element;
    this.#initialize();
  }

  #initialize() {
    const mainElement = document.createElement('div');
    mainElement.innerHTML = sliderHTML(Slider.instanceId);
    const mainSlider = mainElement.querySelector('#main-slider');
    const dotsContainer = mainElement.querySelector('#dots-container');
    let i = 1;
    Array.from(this.#element.childNodes).forEach(cn => {
      mainSlider.appendChild(cn);
      if (cn.nodeType === Node.ELEMENT_NODE) {
        cn.classList.add('slide');
        if (i === 1) cn.style.display = 'block';

        const dot = document.createElement('span');
        dot.innerHTML = `<span class="dot${i === 1 ? ' active' : ''}" onclick="currentSlide${Slider.instanceId}(${i++})" style="margin-left: 8px"></span>`;
        dotsContainer.appendChild(dot.childNodes[0]);
      }
    });
    this.#element.replaceChildren(mainElement);
  }

  #appendScriptsAndStyles() {
    const { autoplayDuration } = { ...this.#options };
    const head = document.getElementsByTagName('head')[0];
    const scriptElement = document.createElement('script');
    const styleSheetElement = document.createElement('style');
    styleSheetElement.innerHTML = sliderStyles;
    scriptElement.innerHTML = sliderScript(Slider.instanceId);
    this.#styleSheetElement = styleSheetElement;
    this.#scriptElement = scriptElement;
    this.setAutoplayDuration(autoplayDuration);
    head.appendChild(this.#scriptElement);
    head.appendChild(this.#styleSheetElement);
  }

  setAutoplayDuration(duration) {
    if (duration > 0) this.#scriptElement.innerHTML = this.#scriptElement.innerHTML + `
      setInterval(() => {
        const sliderInstance = document.querySelector('#__slider-__instance-__id-__unique__${Slider.instanceId}');
        if (sliderInstance) sliderInstance.querySelector('#next').click();
      }, ${duration * 1000});
    `;
  }
}