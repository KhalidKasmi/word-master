const letters = document.querySelectorAll('.scoreboard-letter')
const loadingDiv = document.querySelector('.info-bar')


async function init (){

let currentguess = ''
let currentrow = 0
let done = false
const ROUNDS = 6
let isLoading = false

let res = await fetch("https://words.dev-apis.com/word-of-the-day")
let resObj = await res.json()
let word = resObj.word.toUpperCase()
setloading(false)
isLoading = false
let wordparts = word.split("")

console.log(word)


function addLetter(letter){
if (currentguess.length < 5 ){
    currentguess += letter
}else {
    currentguess = currentguess.substring(0,currentguess.length -1) + letter
}

letters[5*currentrow + currentguess.length -1].innerText = letter
    }

async function Enter(){
        if (currentguess.length < 5){
            return
        }

       

        // validate the word 
        isLoading = true
        setloading(true)
        let res = await fetch("https://words.dev-apis.com/validate-word",{
            method : "POST",
            body : JSON.stringify({word:currentguess})
        })
        let resObj = await res.json()
        let validWord = resObj.validWord

        isLoading = false
        setloading(false)

        if(!validWord){
            markinvalidword()
            return
        }

        // mark as correct , close or wrong 

        let guessparts = currentguess.split("")
        let map = makemap(wordparts)
        console.log(map)

        for (let i =0; i<5 ; i++){
            // mark as correct 
            if( guessparts[i] === wordparts[i]){
                letters[5*currentrow + i].classList.add("correct")
                map[guessparts[i]]--
            }}
            
        for (let i =0; i<5 ; i++){
            if( guessparts[i] === wordparts[i]){
                // do nothing we already did , but u have to mention it 
            }else  if ( wordparts.includes(guessparts[i]) && map[guessparts[i]] > 0 ){
                letters[5*currentrow + i].classList.add("close")

            }else {
                letters[5*currentrow + i].classList.add("wrong")

            }
        }

        currentrow++
        
        // did they win or lose ? 
        if (currentguess === word){
            //win 
            alert('you win ! ')
            H = document.querySelector(".brand").classList.add('winner')
            console.log(H)
            done = true
            return
    }else if ( currentrow == ROUNDS){
            alert (`you lose, the word was ${word}` )
            done = true 
        }

        currentguess = ''
    
    }



function Backspace(){
    currentguess = currentguess.substring(0,currentguess.length -1)
    letters[5*currentrow + currentguess.length ].innerText = ''
}

function markinvalidword(){
//alert ('it is not a valid word')
for ( let i =0; i<5; i++){
    letters[5*currentrow + i].classList.remove("invalid")

setTimeout(function(){
    letters[5*currentrow +i].classList.add("invalid")

},10)
}}


    document.addEventListener('keydown', function handlekeypress (event){
        if( done || isLoading){
            return
        }
        const action = event.key

        console.log(action)
       
        if( action === 'Enter'){
           Enter()
        }else if( action === 'Backspace'){
            Backspace()
        }else if (isLetter(action)){
            addLetter(action.toUpperCase())
        }else{} // else do nothing 
    })

    function isLetter(letter) {
        return /^[a-zA-Z]$/.test(letter);
      }

    function setloading(isLoading){
        loadingDiv.classList.toggle('hidden',!isLoading)
      }

    function makemap(array)  {
        let obj = {}
        for (let i =0; i<array.length ; i++){
            letter = array[i]
            if ( obj[letter]){
            obj[letter]++
        }else {
            obj[letter] = 1 
        }

    }
    return obj
}


}


init() 