// [{x: float, y: float}, ...]
export const ascendingObj = (data) => {
  return data.sort((a, b) => (a.x <= b.x ? -1 : 1))
}
// [[x, y], ...]
export const twoDimensionalArray = (data) => {
  const arr = []
  data.forEach((element) => {
    arr.push([element.x, element.y])
  })

  return arr
}
