export default function getRandomTilt() {
  const min = -4;
  const max = 4;
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
