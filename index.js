const zobs = document.querySelectorAll(".zob");
const japanese = document.querySelector(".japanese");
const french = document.querySelector(".french");
const button = document.querySelector(".button");
const menu = document.querySelector(".word-panel");

let words = [];
let JapaneseData = [];

document.addEventListener("DOMContentLoaded", () => {
    if(!localStorage.getItem('matchedWords')){
        localStorage.setItem('matchedWords', JSON.stringify([]))
    }
    fetchData();
    openMenu();
    const storedWords = JSON.parse(localStorage.getItem('matchedWords'))
            const savedWords =  storedWords.map((card)=>`
            <div class="box">
                <p> box </p>
                <p class="hiragana">${card[1]}</p>
                <p class="kanji">${card[0]}</p>
                <p class="fr">${card[5][0]}${card[5][1] ? "," : ""}</p>
                <p class="fr">${card[5][1] ?? ""}</p>
                <p class="fr">${card.id}</p>
            </div>
            `).join('');
            menu.innerHTML = savedWords;
}
);

function flipCard() {
    const zobs = document.querySelectorAll(".zob");
    let flippedCards = [];


    zobs.forEach((zob) => {
        zob.addEventListener("click", () => {
            if(flippedCards.length < 2){
                zob.classList.toggle("rotate");
                flippedCards.push(zob);

                if (flippedCards.length === 2) {
                    checkForMatch(flippedCards[0], flippedCards[1]);

                    setTimeout(() => {
                        flippedCards = [];
                    }, 1000)
                }
            }
        });
    });
}

function openMenu(){
    let isOpen = false;

    button.addEventListener("click", () => {
        menu.classList.toggle("open");
        isOpen = !isOpen;
        console.log(isOpen);
    })
}

function fetchData() {
  fetch("./term_bank_1.json")
    .then((response) => {
      if (!response.ok) {
        throw new Error("response was not ok");
      }
      return response.json();
    })
    .then((data) => {
      const filterData = data.slice(0, 1000).map((item, index) => ({
        ...item,
        id: index // Assigning a unique ID based on the index
      }));
      const randomTerms = getRandomTerms(filterData);
      JapaneseData = [...randomTerms];
      displayCard(randomTerms);
    })
    .catch((error) => {
      console.error("there is a problemen with fetching", error);
    });
}

function displayCard(data) {
    // Shuffling the data array differently for Japanese and French cards
    const shuffledJapanese = shuffleArray([...data]);
    const shuffledFrench = shuffleArray([...data]);
    console.log(shuffledFrench);
    console.log(shuffledJapanese);
    const japaneseCard = shuffledJapanese
      .map(
        (card) => `
          <div class="zob" data-id="${card.id}">
          <div class="card">
              <div class="front hide">
                  <div class="text-container">
                      <p class="hiragana">${card[1]}</p>
                      <p class="kanji">${card[0]}</p>
                      <p class="id">${card.id}</p>
                  </div>
              </div>
              <div class="back">
                  <p>MEMORY<br>GAME</p>
              </div>
          </div>
      </div>
          `
      )
      .join("");
  
    const frenchCard = shuffledFrench
      .map(
        (card) => `
          <div class="zob" data-id="${card.id}">
          <div class="card">
              <div class="front hide">
                  <div class="text-container">
                      <p class="fr">${card[5][0]}${card[5][1] ? "," : ""}</p>
                      <p class="fr">${card[5][1] ?? ""}</p>
                      <p class="id">${card.id}</p>
                  </div>
              </div>
              <div class="back">
                  <p>MEMORY<br>GAME</p>
              </div>
          </div>
      </div>
          `
      )
      .join("");
  
    japanese.innerHTML = japaneseCard;
    french.innerHTML = frenchCard;
    flipCard();
  }

function shuffleArray(array) {
  //Fisher Yates shuffle algorithm
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

function getRandomTerms(terms, count = 6) {
  const shuffled = shuffleArray([...terms]);
  return shuffled.slice(0, count);
}

function checkForMatch(card1, card2) {
    const id1 = card1.getAttribute("data-id");
    const id2 = card2.getAttribute("data-id");

    if (id1 === id2){
        console.log("Match found!");
        const matchedData = JapaneseData.find(item => item.id.toString() === id1);
        if(matchedData){
            const matchedWords = JSON.parse(localStorage.getItem('matchedWords')|| '[]') ;
            matchedWords.push(matchedData);
            localStorage.setItem('matchedWords', JSON.stringify(matchedWords));
        }
        
        console.log(matchedData);
       
    } else {
        console.log("No match!");
        setTimeout(() => {
            card1.classList.remove("rotate");
            card2.classList.remove("rotate");
          }, 1000);
    }
}
