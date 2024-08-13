export function incrementCustomProperty(element, prop, amount) {
  const current = parseFloat(getComputedStyle(element).getPropertyValue(prop)) || 0
  element.style.setProperty(prop, current + amount)
}

export function setCustomProperty(element, prop, value) {
  element.style.setProperty(prop, value)
}

export function getCustomProperty(element, prop) {
  return parseFloat(getComputedStyle(element).getPropertyValue(prop)) || 0
}
