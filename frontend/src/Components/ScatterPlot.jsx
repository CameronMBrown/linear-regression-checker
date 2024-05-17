import { Scatter } from "react-chartjs-2"

const options = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: false,
    },
  },
  scales: {
    x: {
      beginAtZero: true,
      min: 0,
      max: 10,
    },
    y: {
      beginAtZero: true,
      min: 0,
      max: 10,
    },
  },
}

const ScatterPlot = ({ data }) => {
  console.log("render scatterplot")
  return (
    <div style={{ maxWidth: "600px", margin: "auto" }}>
      <Scatter data={data} options={options} />
    </div>
  )
}

export default ScatterPlot
