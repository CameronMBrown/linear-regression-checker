// libs
import { useState, useEffect } from "react"
import {
  Chart as ChartJS,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
} from "chart.js"
import api from "./api/axios"

// components
import Form from "./Components/Form"
import ScatterPlot from "./Components/ScatterPlot"
import PointsTable from "./Components/PointsTable"

// styles
import "./styles/graphArea.scss"
import "./styles/card.scss"

// util
import { generatePoints } from "./utils/generatePoints"
import { drawLineOfBestFit, drawUserLine } from "./utils/drawLine"

// init graph
ChartJS.register(LinearScale, PointElement, LineElement, Tooltip, Legend)

const App = () => {
  const [chartData, setChartData] = useState(generatePoints())
  const [sessionData, setSessionData] = useState({
    attemptNum: 1,
    coordinatesId: undefined,
  })
  const [coordinatesId, setCoordinatesId] = useState(undefined)
  const [attemptNum, setAttemptNum] = useState(1)
  const [showModal, setShowModal] = useState(false)

  // TODO: if attempt number is 4 reveal answer
  console.log(attemptNum)

  // grab just the points data and sort in ascending order depending on the x coordinate
  const points = chartData.datasets[0].data.sort((a, b) =>
    a.x <= b.x ? -1 : 1
  )

  // const handleNewCoordinates = () => {
  //   setAttemptNum(1)
  //   setChartData(generatePoints)
  // }

  const handleDrawUserLine = (slope, intercept) => {
    setChartData((prev) => {
      const newDatasets = [prev.datasets[0], drawUserLine(slope, intercept)]

      return { ...prev, datasets: newDatasets }
    })
  }

  /**
   * Send the student submission to the backend
   * Including name, slope, intercept, points, setId and attempt values
   */
  const handleSubmission = async (e) => {
    e.preventDefault()

    const formData = new FormData(e.currentTarget)
    try {
      // format coordinates
      let coordinates = []
      points.forEach((point) => {
        coordinates.push(point.x)
        coordinates.push(point.y)
      })

      // POST submission
      const response = await api.post("/api/v1/submit", {
        name: formData.get("name"),
        slope: formData.get("slope"),
        intercept: formData.get("intercept"),
        coordinates,
        setId: sessionData.coordinatesId,
        attemptNum: sessionData.attemptNum,
      })
      console.log(response)

      if (response.data.status === "success") {
        setSessionData({
          coordinatesId: response.data.data.setId,
          attemptNum: response.data.data.attemptNum,
        })

        if (response.data.data.setId) setCoordinatesId(response.data.data.setId)
        if (response.data.data.isCorrect) {
          // show alert
        }
      }
    } catch (err) {
      if (err.response) {
        console.error(`Error 💥: ${err.response.data.message}`)
      } else {
        console.log(`Error 💥: ${err}`)
      }
    }
  }

  return (
    <>
      <h1>Linear Regression Checker</h1>
      <div className="app-body">
        <div className="button-area">
          {/* <button onClick={() => setChartData(generatePoints())}>
          Generate New Points
        </button> */}
        </div>
        <div className="graph-area">
          <ScatterPlot data={chartData} />
          <PointsTable points={points} />
        </div>
        <Form onSubmit={handleSubmission} onDraw={handleDrawUserLine} />
      </div>
    </>
  )
}

export default App
