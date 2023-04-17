const prev = document.querySelector('#prev');
const next = document.querySelector('#next');
const book = document.querySelector('.book');
const first = document.querySelector('#first');
const second = document.querySelector('#second');
const flipper = document.querySelector('#flip');
const cards = document.querySelectorAll('[data-card]');
const overlays = document.querySelector('.overlays');
const real = document.querySelector('.real');
const overlayClose = document.querySelector('.overlay-close');
const npName = document.querySelector('.np-name');
const npType = document.querySelector('.np-type');
const overlayImg = document.querySelector('.overlay-img');
const pageNum = document.querySelector('#pagenum');
const pageInput = document.querySelector('#pageinput');
const totalPg = document.querySelector('#totalpage');
const currPg = document.querySelector('#currpage');
const bottom = document.querySelector('.bottom');
const pgContainer = document.querySelector('.pgnum');
const hoverCard = document.querySelector('.hovercard');

let servantList = [];
let CURR_PAGE = 0;
let TOTAL;
let LAST;
let click = 0;
let MIDX = 0;
let MIDY = 0;
let ACTIVE = false;
let BOOKSTATE = 'FRONTCLOSE';
let hoverCardRect = hoverCard.getBoundingClientRect();

//Init
function setList(file) {
  fetch(file)
    .then((res) => res.json())
    .then((data) => {
      servantList.push(...data);
      TOTAL = Math.ceil(servantList.length / 8);
      pageInput.max = TOTAL;
      totalPg.innerText = TOTAL;
      LAST = TOTAL + 1;
    });
}

setList('./servants.json');

//Resize
window.addEventListener('resize', () => {
  const bottomheight = bottom.getBoundingClientRect().height;
  const pgHeight = pgContainer.getBoundingClientRect().height;
  const bookHeight = book.getBoundingClientRect().height;
  hoverCardRect = hoverCard.getBoundingClientRect();
  const all = bookHeight + pgHeight + bottomheight;
  if (window.innerHeight < all) {
    document.body.style.overflowY = 'scroll';
  } else {
    document.body.removeAttribute('style');
  }
});

//Flip Page
next.addEventListener('click', nextPage);
prev.addEventListener('click', prevPage);

function nextPage() {
  disableButtons();
  removeCards();
  if (CURR_PAGE >= LAST) return;
  if (CURR_PAGE === 0) {
    openBook();
  } else if (CURR_PAGE === TOTAL) {
    setTimeout(() => {
      closeBook('back');
    }, 300);
  } else {
    setTimeout(() => {
      flip('flipleft');
    }, 300);
  }
  CURR_PAGE += 1;
  currPg.innerText = CURR_PAGE;
}

function prevPage() {
  disableButtons();
  removeCards();
  if (CURR_PAGE <= 0) return;
  if (CURR_PAGE === LAST) {
    openBook('back');
  } else if (CURR_PAGE === 1) {
    setTimeout(() => {
      closeBook();
    }, 300);
  } else {
    setTimeout(() => {
      flip('flipright');
    }, 300);
  }
  CURR_PAGE -= 1;
  currPg.innerText = CURR_PAGE;
}

//Set Cards in book
function setCards() {
  cards.forEach((card, index) => {
    const servantCard = servantList[(CURR_PAGE - 1) * 8 + index];
    if (servantCard) {
      const img = new Image();
      img.src = `./cards/${servantCard.id}.png`;
      card.appendChild(img);
      card.dataset.card = servantCard.id;
      img.onload = () => {
        card.parentElement.classList.add('flip');
      };
    }
  });
}

function removeCards() {
  cards.forEach((card) => {
    card.parentElement.classList.remove('flip');
    setTimeout(() => {
      while (card.firstChild) {
        card.removeChild(card.firstChild);
      }
    }, 300);
  });
}

//Book stuff
function openBook(direction = '') {
  book.classList.add('open');
  BOOKSTATE = 'OPEN';
  if (direction === 'back') {
    book.classList.remove('close');
  }
  first.addEventListener(
    'transitionend',
    () => {
      enableButtons();
      real.classList.add('active');
      setCards();
      if (direction === 'back') {
        second.classList.remove('closed');
      }
    },
    { once: true }
  );
}

function closeBook(direction = '') {
  real.classList.remove('active');
  second.removeAttribute('style');
  book.classList.remove('open');
  if (direction === 'back') {
    book.classList.add('close');
    second.classList.add('closed');
    BOOKSTATE = 'BACKCLOSE';
    first.addEventListener(
      'transitionend',
      () => {
        enableButtons('back');
      },
      { once: true }
    );
    return;
  }
  BOOKSTATE = 'FRONTCLOSE';
  first.addEventListener(
    'transitionend',
    () => {
      enableButtons('front');
    },
    { once: true }
  );
}

function flip(direction) {
  flipper.classList.add(direction);
  flipper.addEventListener(
    'animationend',
    () => {
      flipper.classList.remove(direction);
      enableButtons();
      setCards();
    },
    { once: true }
  );
}

//Enlarge cards on click
cards.forEach((card) => {
  card.addEventListener('click', enlargeCards);
});

function getCoords() {
  let bookRect = book.getBoundingClientRect();
  MIDY = bookRect.y + bookRect.height / 2;
  MIDX = bookRect.x + bookRect.width / 4;
}

function enlargeCards(e) {
  disableButtons();
  const current_card = e.currentTarget;
  if (current_card.parentElement.classList.contains('flip')) {
    if (!current_card.parentElement.classList.contains('active') && !ACTIVE) {
      second.style.zIndex = 4;
      fillData(current_card.dataset.card);
      getCoords();
      current_card.parentElement.classList.add('active');
      cardRect = current_card.getBoundingClientRect();
      const newX = -(MIDX - (cardRect.x + cardRect.width / 2));
      const newY = MIDY - cardRect.y - cardRect.height / 2;
      current_card.style.transform = `translateY(${newY}px) translateX(calc(${newX}px)) scale(2) rotateY(180deg)`;
      overlays.classList.add('active');
      overlays.addEventListener(
        'animationend',
        () => {
          current_card.style.opacity = 0;
          hoverCardRect = hoverCard.getBoundingClientRect();
          overlayClose.addEventListener(
            'click',
            () => {
              closeOverlay(current_card, current_card.parentElement);
            },
            { once: true }
          );
        },
        { once: true }
      );
    }
  }
}

function closeOverlay(currCard, currParent) {
  second.removeAttribute('style');
  overlays.classList.remove('active');
  currCard.removeAttribute('style');
  currParent.removeAttribute('style');
  currParent.classList.remove('active');
  enableButtons();
}

//Chart js
const paramChart = document.getElementById('paramChart');
const ranks = ['?', 'E', 'D', 'C', 'B', 'A', 'EX'];
const fontFunc = function (context) {
  const width = context.chart.width;
  const size = Math.round(width / 24);

  return {
    weight: 'bold',
    size: size,
  };
};
const chartColor = 'white';
const paramsChart = new Chart(paramChart, {
  type: 'radar',
  data: {
    labels: ['STR', 'END', 'AGL', 'MP', 'LUK', 'NP'],
    datasets: [
      {
        label: 'Parameters',
        data: [6, 1, 2, 3, 4, 5],
        borderWidth: 1,
        backgroundColor: 'rgba(144,238,144,0.8)',
        borderColor: chartColor,
      },
    ],
  },
  options: {
    elements: {
      line: {
        borderWidth: 3,
      },
    },
    animation: {
      duration: 0,
    },
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      r: {
        min: 0,
        max: 6,
        angleLines: {
          color: chartColor,
        },
        grid: {
          color: chartColor,
        },
        pointLabels: {
          color: chartColor,
          font: fontFunc,
        },
        ticks: {
          backdropColor: 'rgba(0,0,0,0.5)',
          color: chartColor,
          callback: function (val, index) {
            return ranks[index];
          },
          z: 2,
        },
      },
    },
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: true,
        text: 'Parameters',
        color: chartColor,
        font: fontFunc,
      },
    },
  },
});

const atkhp = document.querySelector('#atkhpChart');

const atkhpChart = new Chart(atkhp, {
  type: 'line',
  data: {
    labels: ['Base', 'Max', 'Lvl 100', 'Lvl 120'],
    datasets: [
      {
        label: 'ATK',
        data: [1, 2, 3, 4],
        borderWidth: 2,
        backgroundColor: 'rgba(255,204,203,0.8)',
        borderColor: 'rgba(255,204,203,0.8)',
        pointBackgroundColor: 'rgba(255,204,203,0.8)',
        pointBorderColor: 'rgba(255,204,203,0.8)',
      },
      {
        label: 'HP',
        data: [1, 2, 3, 4],
        borderWidth: 2,
        backgroundColor: 'rgba(135,206,235,0.8)',
        borderColor: 'rgba(135,206,235,0.8)',
        pointBackgroundColor: 'rgba(135,206,235,0.8)',
        pointBorderColor: 'rgba(135,206,235,0.8)',
      },
    ],
  },
  options: {
    maintainAspectRatio: false,
    scales: {
      y: {
        max: 25000,
        grid: {
          color: chartColor,
        },
        ticks: {
          color: chartColor,
          font: fontFunc,
        },
      },
      x: {
        grid: {
          color: chartColor,
        },
        ticks: {
          color: chartColor,
          font: fontFunc,
        },
      },
    },
    plugins: {
      legend: {
        labels: {
          color: chartColor,
          font: fontFunc,
        },
        onClick: null,
      },
      title: {
        display: true,
        text: 'Stats',
        color: chartColor,
        font: fontFunc,
      },
    },
  },
});

function fillData(data) {
  const servant = servantList.find((element) => element.id === parseInt(data));
  const params = [];
  npName.innerText = servant.npName;
  npType.innerText = servant.npType;
  overlayImg.src = `./cards/${servant.id}.png`;
  for (const param of ['STR', 'END', 'AGL', 'MP', 'LUK', 'NP']) {
    const rank = servant.parameter[param];
    if (rank[0] === 'A') {
      params.push(5);
    } else if (rank[0] === 'B') {
      params.push(4);
    } else if (rank[0] === 'C') {
      params.push(3);
    } else if (rank[0] === 'D') {
      params.push(2);
    } else if (rank[0] === 'E') {
      if (rank[1] === 'X') {
        params.push(6);
      } else {
        params.push(1);
      }
    } else {
      params.push(5);
    }
  }
  paramsChart.data.datasets[0].data = params;
  paramsChart.update();
  atkhpChart.data.datasets[0].data = servant.atk;
  atkhpChart.data.datasets[1].data = servant.hp;
  atkhpChart.update();
}

//Skip around book
const firstPage = document.querySelector('#first-page');
const lastPage = document.querySelector('#last-page');
lastPage.addEventListener('click', () => {
  if (CURR_PAGE >= TOTAL) return;
  disableButtons();
  CURR_PAGE = TOTAL;
  currPg.innerText = CURR_PAGE;
  if (BOOKSTATE === 'FRONTCLOSE') {
    openBook();
  } else if (BOOKSTATE === 'OPEN') {
    removeCards();
    setTimeout(() => {
      flip('flipleft');
    }, 300);
  }
});

firstPage.addEventListener('click', () => {
  if (CURR_PAGE <= 1) return;
  disableButtons();
  CURR_PAGE = 1;
  currPg.innerText = CURR_PAGE;
  if (BOOKSTATE === 'BACKCLOSE') {
    openBook('back');
  } else if (BOOKSTATE === 'OPEN') {
    removeCards();
    setTimeout(() => {
      flip('flipright');
    }, 300);
  }
});

pageNum.addEventListener('submit', (e) => {
  e.preventDefault();
  const pgVal = parseInt(e.target.pageinput.value);
  if (pgVal === CURR_PAGE || pgVal > TOTAL || pgVal < 1) {
    pageInput.value = '';
    return;
  }
  const temp = CURR_PAGE;
  CURR_PAGE = pgVal;
  currPg.innerText = CURR_PAGE;
  disableButtons();
  removeCards();
  if (BOOKSTATE === 'FRONTCLOSE') {
    openBook();
  } else if (BOOKSTATE === 'BACKCLOSE') {
    openBook('back');
  } else {
    if (CURR_PAGE > temp) {
      setTimeout(() => {
        flip('flipleft');
      }, 300);
    } else if (CURR_PAGE < temp) {
      setTimeout(() => {
        flip('flipright');
      }, 300);
    }
  }
  pageInput.value = '';
});

//Button enable/disable
function disableButtons() {
  next.disabled = true;
  prev.disabled = true;
  firstPage.disabled = true;
  lastPage.disabled = true;
  pageInput.disabled = true;
}

function enableButtons(direction = '') {
  pageInput.disabled = false;
  if (direction === 'front') {
    next.disabled = false;
    lastPage.disabled = false;
  } else if (direction === 'back') {
    prev.disabled = false;
    firstPage.disabled = false;
  } else {
    next.disabled = false;
    prev.disabled = false;
    if(CURR_PAGE !== 1){
      firstPage.disabled = false;
    }
    if(CURR_PAGE !== TOTAL){
      lastPage.disabled = false;
    }
  }
}

//Hover cards
const root = document.documentElement;
let hoverX = 0;
let hoverY = 0;
let lightX = 0
let lightY = 0
let timeout;
let mouseleave = false;
hoverCard.addEventListener('mousemove', (e) => {
  const hcHeight = hoverCardRect.height;
  const hcWidth = hoverCardRect.width;
  let mouseX = e.offsetX;
  let mouseY = e.offsetY;
  let halfHeight = hcHeight / 2;
  let halfWidth = hcWidth / 2;
  hoverY = ((mouseY - halfHeight) / halfHeight) * 30;
  hoverX = ((halfWidth - mouseX) / halfWidth) * 30;
  lightX = (mouseX/hcWidth) * 100
  lightY = (mouseY/hcHeight) * 100
  if(timeout){
    cancelAnimationFrame(timeout)
  }
  timeout = requestAnimationFrame(update)
});

function update() {
  root.style.setProperty('--poiX', lightX+'%')
  root.style.setProperty('--poiY', lightY+'%')
  root.style.setProperty('--light' , 1)
  hoverCard.style.transform = `rotateX(${hoverY}deg) rotateY(${hoverX}deg)`;
  timeout = null;
}

const imgContainer = document.querySelector('.overlay-img-container')

imgContainer.addEventListener('mouseleave', (e) => {
  if(timeout){
    cancelAnimationFrame(timeout)
  }
  root.removeAttribute('style')
  hoverCard.removeAttribute('style')
})
