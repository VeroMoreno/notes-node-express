const suma = (a,b) => {
  return a - b
}

// ASSERT es que tienes una cosa que esperas que de un resultado concreto.
// Si es true es que todo ha ido bien
console.assert(
  suma(1,3) === 4,
  'suma of 1 and 3 expected to be 1'
)