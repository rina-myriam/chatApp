import moment from "moment";

document.getElementById("chat-circle").addEventListener("click", displayDate); 
function displayDate() {
    document.querySelector(".chat-box").style.display = "block"; 
    document.getElementById('chat-input').focus();
  };
document.querySelector(".chat-box-toggle").addEventListener("click", closeChat);
function closeChat() {
    document.querySelector(".chat-box").style.display = "none";
    document.getElementById('chat-input').blur()
}

const option1 = document.getElementById("option1");
const option2 = document.getElementById("option2");
const option3 = document.getElementById("option3");
const option4 = document.getElementById("option4");
option1.addEventListener("click", verifEntretien);
option2.addEventListener("click", getInfoVehicule);
option3.addEventListener("click", getContact);
option4.addEventListener("click", stopWorkflow);


function verifEntretien(){
  let answer = "Vérifier l’entretien de mon véhicule";
  addUserAnswer(answer);
  addBotAnswer("Veuillez entrer la date du dernier entretien de votre véhicule au format JJ/MM/AAAA");
}

function getInfoVehicule(){
  let answer = "Avoir des informations sur un véhicule";
  addUserAnswer(answer);
  let choices = {Routier:"Routier", ToutTerrain:"Tout-terrain", Sportif:"Sportif"};
  let sentence = "Vous avez un usage plutôt:";
  addChoices(choices, sentence);
}

function stopWorkflow(){
  addBotAnswer("A bientôt !");
}

function getContact () {
  let answer = "Avoir des informations de contact";
  addUserAnswer(answer);
  let choices = {MailContact:"L'email", TelContact:"Le numéro de téléphone"};
  let sentence = "Vous souhaitez avoir:";
  addChoices(choices, sentence);
  
};

function addChoices (choices, sentence) {
  let botDiv = document.createElement("div");
  botDiv.id = "bot";
  botDiv.className = "talk-bubble tri-right left-in";
  let botSentence = document.createElement("p");  
  botSentence.innerText = sentence;
  botDiv.appendChild(botSentence);
 
  for (const choice in choices) {
    let botText = document.createElement("button");   
    botText.className = "talk-choice";
    botText.id = choice;
    botText.innerText = `${choices[choice]}`;
    botText.addEventListener("click", function(event){
      masterEventHandler(event);
    });
    
    botDiv.appendChild(botText);
  } 

  messagesContainer.appendChild(botDiv);
  messagesContainer.scrollTop =
    messagesContainer.scrollHeight - messagesContainer.clientHeight;
}

function bookTry (){
  let dates = new Object();
  let days = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];
  for (let i=1; i<8; i++){
      let currentDate = new Date();
      currentDate.setDate(currentDate.getDate()+i);
      if (currentDate.toDateString().includes("Sat") || currentDate.toDateString().includes("Sun")){
      }else{
        dates[days[currentDate.getDay()]] = currentDate.toLocaleDateString();
        console.log(days[currentDate.getDay()]);
      }
  }
  let sentence = "Veuillez choisir une date pour prendre rdv:";
  addChoices(dates, sentence);
}

function reload () {
  let sentence = "Vous souhaitez : ";
  let choices = {verifEntretien:"Vérifier l’entretien de votre véhicule", getInfoVehicule:"Des informations sur les véhicules", getContact:"Des informations de contact", stopWorkflow:"Arrêter le workflow"};
  addChoices(choices, sentence);
}

function masterEventHandler (event) {
  let el = event.target.getAttribute('id');
  switch (el) {
    case "MailContact" :
      addUserAnswer("L'email de contact");
      addBotAnswer("Vous pouvez nous contacter à l'adresse suivante: contact@gmail.com");
    break;
  
    case "TelContact" :
      addUserAnswer("Le téléphone");
      addBotAnswer("Vous pouvez nous contacter au numéro suivant: 0123456789");
    break;

    case "Routier" :
      addUserAnswer("Usage routier");
      bookTry();
    break;

    case "ToutTerrain" :
      addUserAnswer("Usage tout terrain");
      bookTry();
    break;

    case "Sportif" :
      addUserAnswer("Usage sportif");
      bookTry();
    break;

    case "mon" :
      addBotAnswer("Votre rendez-vous a bien été pris en compte pour le "+ document.getElementById(el).textContent);
      setTimeout(() => {
        reload();
      }, 1800);
    break;

    case "tue" :
      addBotAnswer("Votre rendez-vous a bien été pris en compte pour le "+ document.getElementById(el).textContent);
      setTimeout(() => {
        reload();
      }, 1800);
    break;

    case "wed" :
      addBotAnswer("Votre rendez-vous a bien été pris en compte pour le "+ document.getElementById(el).textContent);
      setTimeout(() => {
        reload();
      }, 1800);
    break;

    case "thu" :
      addBotAnswer("Votre rendez-vous a bien été pris en compte pour le "+ document.getElementById(el).textContent);
      setTimeout(() => {
        reload();
      }, 1800);
    break;

    case "fri" :
      addBotAnswer("Votre rendez-vous a bien été pris en compte pour le "+ document.getElementById(el).textContent);
      setTimeout(() => {
        reload();
      }, 1800);
    break;

    case "verifEntretien":
      verifEntretien();
    break;

    case "getInfoVehicule" :
      getInfoVehicule();
    break;

    case "getContact" :
      getContact();
    break;

    case "stopWorkflow" :
      stopWorkflow();
    break;

    case "RevisionOui":
      bookTry();
    break;

    case "RevisionNon":
      stopWorkflow();
    break;

    case "kmOui":
      stopWorkflow();
    break;

    case "kmnNon":
      addChoices({RevisionOui:"Oui", RevisionNon:"Non"}, "Souhaitez-vous faire réviser votre véhicule ?");
    break;
  }
}

const messagesContainer = document.querySelector(".chat-logs");

const inputField = document.getElementById("chat-input");
inputField.addEventListener("keydown", (e) => {
  if (e.code === "Enter") {
    let input = inputField.value;
    inputField.value = "";
    output(input);
  }
});


function output(input) {
  if(!isNaN(+parseInt(input))){
      if(moment(input, "DD/MM/YYYY", true).isValid()){
        addUserAnswer(input);
        let dateYearPassed = (new Date(new Date().setFullYear(new Date().getFullYear() - 1))).toDateString();
        if ((new Date(Date.parse(dateYearPassed))) > (new Date(Date.parse(new Date(input))))){
          addChoices({kmOui:"Oui", kmNon:"Non"}, "Avez-vous effectuer plus de 10 000km ?");
        } else {
          bookTry();
        }
      }
  } else {
    addBotAnswer("Veuillez entrer une date au format JJ/MM/AAAA");
  }
}
  

function addUserAnswer(input) {
  let userDiv = document.createElement("div");
  userDiv.id = "user";
  userDiv.className = "talk-bubble tri-right right-in";
  userDiv.innerHTML = `<span>${input}</span>`;
  messagesContainer.appendChild(userDiv);
  messagesContainer.scrollTop =
  messagesContainer.scrollHeight - messagesContainer.clientHeight;
}

function addBotAnswer(input) {
  let botDiv = document.createElement("div");
  let botText = document.createElement("span");
  botDiv.id = "bot";
  botDiv.className = "talk-bubble tri-right left-in";
  botText.innerText = "Typing...";
  botDiv.appendChild(botText);
  messagesContainer.appendChild(botDiv);
  
  messagesContainer.scrollTop =
    messagesContainer.scrollHeight - messagesContainer.clientHeight;

  setTimeout(() => {
    botText.innerText = `${input}`;
  }, 800);
}