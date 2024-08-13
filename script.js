import { updateGround, setupGround } from "./ground.js"
import { updateDino, setupDino, getDinoRect, setDinoLose } from "./dino.js"
import { updateCactus, setupCactus, getCactusRects } from "./cactus.js"

const WORLD_WIDTH = 100
const WORLD_HEIGHT = 30
const SPEED_SCALE_INCREASE = 0.00001

const worldElem = document.querySelector("[data-world]")
const successfulJumpsElem = document.querySelector("[data-successful-jumps]")
const startScreenElem = document.querySelector("[data-start-screen]")

// Array of custom messages with dates and events
const customMessages = [
  "৫ জুন কোটা ব্যবস্থা পুনর্বহাল",
  "৪ জুলাই\nসারা দেশে সড়ক অবরোধ",
  "৭ জুলাই\nবাংলা ব্লকেডে রাজধানী স্থবির",
  "১৪ জুলাই\n‘রাজাকারের নাতি-পুতিরা চাকরি পাবে?’",
  "১৫ জুলাই\nঢাবি ক্যাম্পাসে সংঘর্ষ",
  "১৬ জুলাই\nআবু সাঈদ পুলিশের বুলেটে নিহত",
  "১৭ জুলাই\nছাত্রলীগ বিতাড়িত",
  "১৮ জুলাই\nদেশব্যাপী সহিংসতা ও মৃত্যু",
  "১৯ জুলাই\nসর্বাত্মক অবরোধ",
  "২০ জুলাই\nকারফিউ ও সেনা মোতায়েন",
  "২১ জুলাই\nকোটা পুনর্বহাল বাতিল",
  "২৩ জুলাই\nকোটা সংস্কার প্রজ্ঞাপন জারি",
  "৩০ জুলাই\nলাল কাপড় বেঁধে মিছিল",
  "৩১ জুলাই\n‘মার্চ ফর জাস্টিস’",
  "১ আগস্ট\n‘রিমেম্বারিং আওয়ার হিরোস’",
  "২ আগস্ট\n‘প্রার্থনা ও ছাত্র-জনতার গণমিছিল’",
  "৩ আগস্ট\nকেন্দ্রীয় শহীদ মিনারে বিক্ষোভ মিছিল",
  "৪ আগস্ট\n‘একদফা’ দাবিতে অসহযোগ আন্দোলন",
  "৫ আগস্ট\nসরকার পতনের লং মার্চ",
  " "
]

setPixelToWorldScale()
window.addEventListener("resize", setPixelToWorldScale)
document.addEventListener("click", handleStart, { once: true })

let lastTime
let speedScale
let successfulJumps
let customMessageIndex = 0

function update(time) {
  if (lastTime == null) {
    lastTime = time
    window.requestAnimationFrame(update)
    return
  }
  const delta = time - lastTime

  const jumpedCacti = updateCactus(delta, speedScale)
  updateGround(delta, speedScale)
  updateDino(delta, speedScale)
  updateSpeedScale(delta)
  updateSuccessfulJumps(jumpedCacti)

  if (checkLose()) return handleEnd(false) // Pass false for losing
  if (customMessageIndex >= customMessages.length) return handleEnd(true) // Pass true for winning after all messages are shown

  lastTime = time
  window.requestAnimationFrame(update)
}

function checkLose() {
  const dinoRect = getDinoRect()
  return getCactusRects().some(rect => isCollision(rect, dinoRect))
}

function isCollision(rect1, rect2) {
  return (
    rect1.left < rect2.right &&
    rect1.top < rect2.bottom &&
    rect1.right > rect2.left &&
    rect1.bottom > rect2.top
  )
}

function updateSpeedScale(delta) {
  speedScale += delta * SPEED_SCALE_INCREASE
}

function updateSuccessfulJumps(jumpedCacti) {
  if (jumpedCacti.length > 0) {
    successfulJumps += jumpedCacti.length
    if (customMessageIndex < customMessages.length) {
      successfulJumpsElem.textContent = customMessages[customMessageIndex]
      customMessageIndex++
    }
  }
}

function handleStart() {
  lastTime = null
  speedScale = 1
  successfulJumps = 0
  customMessageIndex = 0 // Reset message index on start
  setupGround()
  setupDino()
  setupCactus()
  startScreenElem.classList.add("hide")
  window.requestAnimationFrame(update)
}

function handleEnd(isWin) {
  if (isWin) {
    successfulJumpsElem.textContent = "আপনি স্বাধীনতা লাভ করেছেন" // Display winner message after custom messages end
  } else {
    successfulJumpsElem.textContent = "আপনি পরাধীন" // Display game over message
    setDinoLose()
  }
  setTimeout(() => {
    document.addEventListener("click", handleStart, { once: true })
    startScreenElem.classList.remove("hide")
  }, 100)
}

function setPixelToWorldScale() {
  let worldToPixelScale
  if (window.innerWidth / window.innerHeight < WORLD_WIDTH / WORLD_HEIGHT) {
    worldToPixelScale = window.innerWidth / WORLD_WIDTH
  } else {
    worldToPixelScale = window.innerHeight / WORLD_HEIGHT
  }

  worldElem.style.width = `${WORLD_WIDTH * worldToPixelScale}px`
  worldElem.style.height = `${WORLD_HEIGHT * worldToPixelScale}px`
}
function handleLose() {
  setDinoLose()

  // Play the losing sound
  const loseSound = document.getElementById("lose-sound")
  loseSound.play()

  setTimeout(() => {
    document.addEventListener("click", handleStart, { once: true })
    startScreenElem.classList.remove("hide")
  }, 100)
}
