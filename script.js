const inputContainer = document.getElementById('input-container')
const countdownForm = document.getElementById('countdown-form')
const dateEl = document.getElementById('date-picker')

const countdownEl = document.getElementById('countdown')
const countdownElTitle = countdownEl.querySelector('#countdown-title')
const countdownBtn = countdownEl.querySelector('#countdown-button')
const timeElements = countdownEl.querySelectorAll('span')

const completeEl = document.getElementById('complete')
const completeElInfo = document.getElementById('complete-info')
const completeBtn = document.getElementById('complete-button')

let countdownTitle = ''
let countdownDate = ''
let countdownValue = Date
let countdownActive
let savedCountdown

const second = 1000
const minute = second * 60
const hour = minute * 60
const day = hour * 24

// populate countdown / complete UI
function updateDOM() {
    countdownActive = setInterval(() => {
        const now = new Date().getTime()
        const distance = countdownValue - now

        const days = Math.floor(distance / day)
        const hours = Math.floor((distance % day) / hour)
        const minutes = Math.floor((distance % hour) / minute)
        const seconds = Math.floor((distance % minute) / second)

        // hide input
        inputContainer.hidden = true

        // if the countdown has ended, show complete
        if (distance < 0) {
            // hide countdown
            countdownEl.hidden = true

            clearInterval(countdownActive)

            completeElInfo.textContent = `${countdownTitle} finished on ${countdownDate}`
            // show complete
            completeEl.hidden = false
        } else {
            // else, show the countdown in progress
            // populate countdown
            countdownElTitle.textContent = `${countdownTitle}`
            timeElements[0].textContent = `${days}`
            timeElements[1].textContent = `${hours}`
            timeElements[2].textContent = `${minutes}`
            timeElements[3].textContent = `${seconds}`

            // hide complete
            completeEl.hidden = true
            // show countdown
            countdownEl.hidden = false
        }
    }, second)
}

// take values from form input
function updateCountdown(evt) {
    evt.preventDefault()
    const [title, date] = evt.srcElement
    countdownTitle = title.value
    countdownDate = date.value

    // save to local storage
    savedCountdown = { title: countdownTitle, date: countdownDate }
    localStorage.setItem('countdown', JSON.stringify(savedCountdown))

    // check for valid date
    if (countdownDate === '') {
        alert('Please select a data for the countdown.')
    } else {
        // get number version of current date, updateDOM
        countdownValue = new Date(countdownDate).getTime()
        updateDOM()
    }
}

// reset all values
function reset() {
    // hide countdown & complete
    countdownEl.hidden = true
    completeEl.hidden = true
    // show input
    inputContainer.hidden = false
    // stop countdown
    clearInterval(countdownActive)
    // reset values
    countdownTitle = ''
    countdownDate = ''
    localStorage.removeItem('countdown')
}

function restorePreviousCountdown() {
    // get countdown from localstorage if available
    const prevCountdown = localStorage.getItem('countdown')
    if (prevCountdown) {
        // hide input container
        inputContainer.hidden = true
        // retrive saved countdown from local storage
        savedCountdown = JSON.parse(prevCountdown)
        // update dom
        countdownTitle = savedCountdown.title
        countdownDate = savedCountdown.date
        countdownValue = new Date(countdownDate).getTime()
        updateDOM()
    }
}

// event listeners
countdownForm.addEventListener('submit', updateCountdown)
countdownBtn.addEventListener('click', reset)
completeBtn.addEventListener('click', reset)

// on load
// set date input min with today's date
const date = new Date().toISOString().split('T')[0]
dateEl.setAttribute('min', date)

// restore previous countdown if available
restorePreviousCountdown()
