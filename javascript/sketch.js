
let loadbar = 0;
let failedLoads = [];

//don't forget to add a comma after each line, unless it's the last one in the array
let jsonDocuments = [
  "./json/Dickens.json"
  // "./json/Short1.json"
  // "./json/WebScraping.json",
  // "./json/Copyright.json"
  // "./json/DeathOfTheAuthor.json"
];

let canvas;
let files = [];
let displayText = "";
let phrases = [];
let markovChain = {};

//ADD you data structures for text generation here
function generateCutUpPhrases(numPhrases){
  let output = "";
  for(let i = 0; i < numPhrases; i++){

    let randomIndex = int(random(0,phrases.length));
    let randomPhrase = phrases[randomIndex];

    output += randomPhrase + ". ";

  }
  //implement your code to generate the output

  return output;
}
function generateWordMangle(numWords){
  let output = "";

  //implement your code to generate the output

  return output;
}
function generateMarkovText(startWord,numWords){
  let output = "";

  //implement your code to generate the output

  return output;
}


function setup() {
  canvas = createCanvas(500, 500);
  canvas.parent("sketch-container"); //move our canvas inside this HTML element
  canvas.mousePressed(handleCanvasPressed);//only respond to mouse pressed on the canvas element

  //start loading the first file in the array
  loadFile(0);
}

function draw() {
  background(200);

  if(loadbar < jsonDocuments.length){
    let barLength = width*0.5;
    let length = map(loadbar,0,jsonDocuments.length,barLength/jsonDocuments.length,barLength);
    rect(width*0.25,height*0.5,length,20);
  }else{

    let fontSize = map(displayText.length,0,200,30,20,true);
    textSize(fontSize);
    textWrap(WORD);
    textAlign(CENTER);
    text(displayText,50, 50, 400);

  }

}


function handleCanvasPressed(){
  let keys = getMarkovKeys();
  displayText = generateMarkovText(randomChoice(keys),10);

  showText(displayText);

}


function buildModel(){

  clearMarkovChain();
  for(let i = 0; i < files.length; i++){
    markovChain = addWordsToMarkov(markovChain,files[i].text);//
  }
  // console.log(markovChain);
  
}

function generateMarkovText(startWord,numWords) {

  let current = startWord;
  let output = current;

  for (let i = 0; i < numWords; i++) {
    
    if (markovChain.hasOwnProperty(current)) {

      let possibleNexts = markovChain[current];
      let next;

      if(possibleNexts.length == 0){
        possibleNexts = getMarkovKeys();
      }

      next = randomChoice(possibleNexts);

      output += " " + next;
      current = next;
    }else{
      output += "broken " 
    }

  }

  return output;
}

//Generic Helper functions ----------------------------------


function loadFile(index){

  if(index < jsonDocuments.length){
    let path = jsonDocuments[index]; 

    fetch(path).then(function(response) {
      return response.json();
    }).then(function(data) {
    
      console.log(data);
      files.push(data);

      showText("Training text number " + (index+1));
      showText(data.text);
  
      loadbar ++;
      loadFile(index+1);
  
    }).catch(function(err) {
      console.log(`Something went wrong: ${err}`);
  
      let failed = jsonDocuments.splice(index,1);
      console.log(`Something went wrong with: ${failed}`);
      failedLoads.push(failed);// keep track of what failed
      loadFile(index); // we do not increase by 1 because we spliced the failed one out of our array

    });
  }else{
    buildModel();//change this to whatever function you want to call on successful load of all texts
  }

}


//add text as html element
function showText(text){

  let textContainer = select("#text-container");
//  textContainer.elt.innerHTML = "";//add this in if you want to replace the text each time

  let p = createP(text);
  p.parent("text-container");

}

function randomChoice(array) {
  //randomIndex returns 0 - array.length-1 as 
  //Random range: If two arguments are given, returns a random number from the first argument up to (but not including) the second argument. 
  let randomIndex = int(random(0,array.length));
  let randomWord = array[randomIndex];

  return randomWord;
}
  
function clean(text){
  //good place to test your regex
  //https://regex101.com/ 
  let removeHTMlNewLine = text.replace(/\n/g," ");
  let punctuationless = removeHTMlNewLine.replace(/[^a-zA-Z- ']/g,"");//everything except letters, whitespace & '
  let cleanText = punctuationless.replace(/\s{2,}/g," ");
  let lowerCase = cleanText.toLowerCase().trim();//lower case and remove white spaces at start and end
  
  return lowerCase;
}

function tokenise(text,seperator){
  let tokens = text.split(seperator);

  return tokens;
}


//Markov Helper Functions ----------------------------------

function getMarkovKeys(){
  let keys = Object.keys(markovChain);

  return keys;
}

//easiest way to start again
//call to wipe out previous data to "re-train"
function clearMarkovChain(){
  markovChain = {};
}

  // A function to feed in text to the markov chain
function addWordsToMarkov(markovModel,text) {

  text = clean(text);
  let words = tokenise(text," ");

  // Now let's go through everything and create the dictionary
  for (let i = 0; i < words.length; i++) {
    let word = words[i].trim();//trim any whitespace in case we missed it

    // Is this a new one?
    if (!markovModel.hasOwnProperty(word)) {
      markovModel[word] = [];
    }

    //check if we aren't yet on the last one before trying to grab the next
    if(i < words.length-1){
      let next = words[i+1];
      // Add to the list
      markovModel[word].push(next);
    }

  }

  return markovModel;

}


