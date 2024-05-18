import regression from "regression"

export const drawLineOfBestFit = (dataPoints) => {
  const lineOfBestFit = regression.linear(dataPoints)

  return {
    borderColor: "green",
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
    borderDash: [5, 5],
    data: [
      { x: 0, y: parseFloat(intercept) },
      { x: 10, y: parseFloat(slope) * 10 + parseFloat(intercept) },
    ],
    showLine: true,
  }
}
