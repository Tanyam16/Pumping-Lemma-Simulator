let p = 0;

const lang = localStorage.getItem("selectedLanguage") || "anbn";

document.addEventListener("DOMContentLoaded", function(){

const title = document.getElementById("languageTitle");
const alphabet = document.getElementById("alphabetText");
const inputPlaceholder = document.getElementById("inputString");

if(!title) return; // prevents error on index page

if (lang === "anbn") {
    title.innerText = "L = { aⁿ bⁿ | n ≥ 0 }";
    alphabet.innerText = "Alphabet Σ = {a, b}";
    inputPlaceholder.placeholder = "Example: a5b5";
}

else if (lang === "aprime") {
    title.innerText = "L = { aⁿ | n is prime }";
    alphabet.innerText = "Alphabet Σ = {a}";
    inputPlaceholder.placeholder = "Example: a7";
}

else if (lang === "square") {
    title.innerText = "L = { aⁿ bⁿ² }";
    alphabet.innerText = "Alphabet Σ = {a, b}";
    inputPlaceholder.placeholder = "Example: a3b9";
}

else if (lang === "aba") {
    title.innerText = "L = { aⁿ b aⁿ }";
    alphabet.innerText = "Alphabet Σ = {a, b}";
    inputPlaceholder.placeholder = "Example: a4ba4";
}

});

function openSimulator(language){
localStorage.setItem("selectedLanguage", language)
window.location.href = "simulator.html"
}

function validateP() {

console.log("Button clicked");

const input = document.getElementById("pValue").value;
const error = document.getElementById("pError");

if (input === "" || input <= 0) {
error.innerText = "Please enter a positive number.";
return;
}

if (input === "" || input < 4 || input > 12) {
error.innerText = "Please enter p between 4 and 12.";
return;
}

p = parseInt(input);

error.innerText = "";

document.getElementById("step2").style.display = "block";

}



function validateString() {
    // Correctly target the input ID
    let input = document.getElementById("inputString").value;
    const error = document.getElementById("stringError");

    error.style.color = "red";
    input = input.replace(/\s+/g, '');

    let expanded = expandString(input);

    // Rule: |s| >= p
    if (expanded.length < p) {
        error.innerText = "String length must be ≥ p";
        return;
    }

    // Validation for anbn
    if (lang === "anbn") {
        if (!/^[ab]+$/.test(expanded)) {
            error.innerText = "Only a and b allowed";
            return;
        }
        if (!checkAnBn(expanded)) {
            error.innerText = "String must follow aⁿ bⁿ";
            return;
        }
    }

    // Validation for aprime
    if (lang === "aprime") {
        if (!/^a+$/.test(expanded)) {
            error.innerText = "Only 'a' allowed in this language";
            return;
        }
        if (!isPrime(expanded.length)) {
            error.innerText = "Length must be a prime number";
            return;
        }
    }

    if (lang === "square") {

    if(!/^[ab]+$/.test(expanded)){
        error.innerText = "Only a and b allowed"
        return
    }

    let aCount = (expanded.match(/^a+/) || [""])[0].length
    let bCount = (expanded.match(/b+$/) || [""])[0].length

    if(bCount !== aCount * aCount){
        error.innerText = "Must satisfy b = a²"
        return
    }
}

if (lang === "aba") {

    if(!/^[ab]+$/.test(expanded)){
        error.innerText = "Only a and b allowed"
        return
    }

    let match = expanded.match(/^a+b+a+$/)

    if(!match){
        error.innerText = "Must follow aⁿbaⁿ"
        return
    }

    let left = expanded.match(/^a+/)[0].length
    let right = expanded.match(/a+$/)[0].length

    if(left !== right){
        error.innerText = "Both sides of b must have equal a's"
        return
    }
}

    // If it passes validation
    error.style.color = "green";
    error.innerText = "Valid string ✔";

    window.currentString = expanded;
    renderStringBoxes(expanded);
    setupSliders(expanded);

    document.getElementById("step3").style.display = "block";
}



function expandString(input) {

return input.replace(/([ab])(\d+)/g, (match, char, num) => {
return char.repeat(parseInt(num));
});

}



function checkAnBn(str) {

let match = str.match(/^a+b+$/);

if (!match) return false;

let aCount = str.match(/^a+/)[0].length;
let bCount = str.match(/b+$/)[0].length;

return aCount === bCount;

}

function renderStringBoxes(str){

const container = document.getElementById("visualString")

container.innerHTML = ""

for(let char of str){

let span = document.createElement("span")

span.className = "charBox"

span.innerText = char

container.appendChild(span)

}

}

function setupSliders(str){

let length = str.length

let xSlider = document.getElementById("xSlider")
let ySlider = document.getElementById("ySlider")

xSlider.max = length-1
ySlider.max = p

xSlider.value = 0
ySlider.value = 1

xSlider.oninput = updateSplit
ySlider.oninput = updateSplit

updateSplit()

}

function updateSplit(){

let xEnd = parseInt(document.getElementById("xSlider").value)
let yEnd = parseInt(document.getElementById("ySlider").value)

let error = document.getElementById("splitError")
let step4 = document.getElementById("step4")

error.innerText = ""

// Validate split
if(yEnd <= xEnd){
error.innerText = "|y| must be ≥ 1"
step4.style.display = "none"
}

else if(yEnd > p){
error.innerText = "|xy| cannot exceed p"
step4.style.display = "none"
}

else{
step4.style.display = "block"
}

let boxes = document.querySelectorAll(".charBox")

boxes.forEach((box,i)=>{

box.classList.remove("xColor","yColor","zColor")

if(i < xEnd){
box.classList.add("xColor")
}
else if(i < yEnd){
box.classList.add("yColor")
}
else{
box.classList.add("zColor")
}

})

// Compute x,y,z
let str = window.currentString

let x = str.substring(0, xEnd)
let y = str.substring(xEnd, yEnd)
let z = str.substring(yEnd)

document.getElementById("xVal").innerText = x
document.getElementById("yVal").innerText = y
document.getElementById("zVal").innerText = z

}

function testPumping(){

let i = parseInt(document.getElementById("iValue").value)
let error = document.getElementById("pumpError")
let result = document.getElementById("pumpResult")

error.innerText = ""
result.innerText = ""

if(isNaN(i) || i < 0){

error.innerText = "Please enter a non-negative integer."
return

}

let x = document.getElementById("xVal").innerText
let y = document.getElementById("yVal").innerText
let z = document.getElementById("zVal").innerText

let pumpedString = x + y.repeat(i) + z

result.innerHTML = "<b>Pumped String:</b> " + pumpedString

checkPumpedLanguage(pumpedString)

}

function checkPumpedLanguage(str){

let result = document.getElementById("pumpResult")

let stillInLanguage = false
let explanation = ""

if(lang === "anbn"){

let aCount = (str.match(/^a+/) || [""])[0].length
let bCount = (str.match(/b+$/) || [""])[0].length

if(checkAnBn(str)){
stillInLanguage = true
}
else{
explanation =
`Analysis: ${aCount} a's, ${bCount} b's (should be equal).`
}

}

if(lang === "aprime"){

if(/^a+$/.test(str) && isPrime(str.length)){
stillInLanguage = true
}
else{
explanation =
`Analysis: string length is ${str.length}, which is not prime.`
}

}

if(lang === "square"){

let aCount = (str.match(/^a+/) || [""])[0].length
let bCount = (str.match(/b+$/) || [""])[0].length

if(/^a+b+$/.test(str) && bCount === aCount*aCount){
stillInLanguage = true
}
else{
explanation =
`Analysis: ${aCount} a's, ${bCount} b's (should be b = a² = ${aCount*aCount}).`
}

}

if(lang === "aba"){

let match = str.match(/^a+b+a+$/)

if(match){
let left = str.match(/^a+/)[0].length
let right = str.match(/a+$/)[0].length

if(left === right){
stillInLanguage = true
}
else{
explanation =
`Analysis: left side has ${left} a's and right side has ${right} a's (must match).`
}
}
else{
explanation = "Analysis: string no longer matches form aⁿbaⁿ."
}

}


if(stillInLanguage){

result.innerHTML +=
`<div style="background:#fff3cd;padding:10px;border-radius:6px;margin-top:10px">
⚠ Still in the language. Try another decomposition of x, y, z.
</div>`

}
else{

result.innerHTML +=
`<div style="margin-top:10px">${explanation}</div>
<div style="background:#d4edda;padding:10px;border-radius:6px;margin-top:8px">
<b>Success!</b> The pumped string is not in the language.  
This contradicts the Pumping Lemma, so the language is <b>not regular</b>.
</div>`

}

}

function isPrime(n){

if(n <= 1) return false

for(let i = 2; i <= Math.sqrt(n); i++){

if(n % i === 0){
return false
}

}

return true

}