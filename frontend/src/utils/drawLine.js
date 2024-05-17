import regression from "regression"

export const drawLineOfBestFit = (dataPoints) => {
  const lineOfBestFit = regression.linear(dataPoints)

  return {
    borderColor: "red",
    data: [
      { x: 0, y: lineOfBestFit.predict(0)[1] },
      { x: 10, y: lineOfBestFit.predict(10)[1] },
    ],
    showLine: true,
  }
}

export const drawUserLine = (slope, intercept) => {
  return {
    borderColor: "orange",
    data: [
      { x: 0, y: intercept },
      { x: 10, y: slope + intercept },
    ],
    showLine: true,
  }
}
