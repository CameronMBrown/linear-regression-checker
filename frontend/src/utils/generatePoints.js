export const generatePoints = () => {
  const dataPoints = Array.from({ length: 5 }, () => [
    Math.random() * 10,
    Math.random() * 10,
  ])

  const data = {
    datasets: [
      {
        backgroundColor: "red",
        borderColor: "red",
        data: dataPoints.map((point) => ({
          x: Math.round(point[0] * 10) / 10,
          y: Math.round(point[1] * 10) / 10,
        })),
        showLine: false,
      },
    ],
  }

  return data
}
