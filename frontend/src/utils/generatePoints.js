export const generatePoints = () => {
  // const dataPoints = Array.from({ length: 5 }, () => [
  //   Math.random() * 10,
  //   Math.random() * 10,
  // ])

  const dataPoints = [
    [2, 4],
    [3, 5],
    [5, 7],
    [7, 10],
    [9, 15],
  ]

  const data = {
    datasets: [
      {
        backgroundColor: "green",
        borderColor: "green",
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
