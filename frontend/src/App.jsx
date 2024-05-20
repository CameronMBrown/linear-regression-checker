// libs
import { useState } from "react"
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
import Modal from "./Components/Modal"
import Form from "./Components/Form"
import ScatterPlot from "./Components/ScatterPlot"
import PointsTable from "./Components/PointsTable"
import MyStats from "./Components/MyStats"

// styles
import "./styles/graphArea.scss"
import "./styles/card.scss"

// util
import { generatePoints } from "./utils/generatePoints"
import { drawLineOfBestFit, drawUserLine } from "./utils/drawLine"
import { ascendingObj, twoDimensionalArray } from "./utils/formatCoordinates"

// init graph
ChartJS.register(LinearScale, PointElement, LineElement, Tooltip, Legend)

const App = () => {
  const [chartData, setChartData] = useState(generatePoints())
  const [attemptData, setAttemptData] = useState({
    attemptNum: 1,
    coordinatesId: undefined,
  })
  const [showModal, setShowModal] = useState({ show: false, content: null })
  const [myStats, setMyStats] = useState(false)

  // grab just the points data and sort in ascending order depending on the x coordinate
  const points = ascendingObj(chartData.datasets[0].data)

  /**
   * Resets all but the form area to prepare for next attempt
   */
  const handleReset = () => {
    setShowModal({ show: false, content: null })
    setChartData(generatePoints())
    setAttemptData({ attemptNum: 1, coordinatesId: undefined })
  }

  /**
   * Draws the correct answer on the graph
   */
  const handleRevealLinearEquation = () => {
    setChartData((prev) => {
      return {
        ...prev,
        datasets: [
          ...prev.datasets,
          drawLineOfBestFit(twoDimensionalArray(chartData.datasets[0].data)),
        ],
      }
    })
  }

  /**
   * Draws a linear equasion using the user inputs
   *
   * @param {Float} slope
   * @param {Float} intercept
   */
  const handleDrawLinearEquation = (slope, intercept) => {
    setChartData((prev) => {
      const newDatasets = [prev.datasets[0], drawUserLine(slope, intercept)]

      return { ...prev, datasets: newDatasets }
    })
  }

  /**
   * Send the student submission to the backend
   * Including name, slope, intercept, points, setId and attempt values
   * Unpon response, display modal describing the correctness and/or remaining attempts
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
        setId: attemptData.coordinatesId,
        attemptNum: attemptData.attemptNum,
      })

      if (response.data.status !== "success")
        throw new Error("something went wrong, no server resonse")
      else {
        if (response.data.data.isCorrect) {
          handleRevealLinearEquation()
          // show correct answer modal
          setShowModal({
            show: true,
            content: (
              <>
                <h2>Correct!</h2>
                <p>You found the answer in {attemptData.attemptNum} attemps!</p>
                <div className="button-area">
                  <button onClick={handleReset}>New Problem</button>
                </div>
              </>
            ),
          })
        } else {
          // incorrect attempt
          if (attemptData.attemptNum >= 3) {
            // exausted all 3 attempts, reveal answer and reset
            // draw line representing backend's solution
            handleRevealLinearEquation()
            setShowModal({
              show: true,
              content: (
                <>
                  <h2>Not Quite!</h2>
                  <p>
                    You were unable to derive the correct linear equation that
                    describes the line of best fit
                  </p>
                  <p className="answer">
                    The correct answer is{" "}
                    <strong>
                      y ={" "}
                      <span className="highlight">
                        {response.data.data.slope}
                      </span>
                      x +
                      <span className="highlight">
                        {response.data.data.intercept}
                      </span>
                    </strong>
                  </p>
                  <div className="button-area">
                    <button
                      onClick={() => {
                        setShowModal({ show: false, content: null })
                        setTimeout(() => {
                          handleReset()
                        }, 3000)
                      }}
                    >
                      New Problem
                    </button>
                  </div>
                </>
              ),
            })
          } else {
            // has attempts remaining for this set of coordinates
            setShowModal({
              show: true,
              content: (
                <>
                  <h2>Try Again!</h2>
                  <p>
                    You have {3 - attemptData.attemptNum} attempts remaining.
                  </p>
                  <div className="button-area">
                    <button
                      onClick={() =>
                        setShowModal({ show: false, content: null })
                      }
                    >
                      Close
                    </button>
                  </div>
                </>
              ),
            })
          }
          // store info required subsequent attempts on these coordinates
          setAttemptData({
            coordinatesId: response.data.data.setId,
            attemptNum: response.data.data.attemptNum,
          })
        }
      }
    } catch (err) {
      if (err.response) {
        console.error(`Error 💥: ${err.response.data.message}`)
      } else {
        console.log(`Error 💥: ${err.message}`)
      }
    }
  }

  /**
   * Shows useful metrics to the user after entering their name
   */
  const handleShowUserStats = async (name) => {
    if (!name || name === "") {
      setMyStats(<p>Please provide your name</p>)
    } else {
      const results = await (
        await api.get(`/api/v1/students/statistics/${name}`)
      ).data.data
      setMyStats(
        <div className="stats-table">
          <p>
            Attempts: <span>{results.totalAttempts}</span>
          </p>
          <p>
            Successes: <span>{results.successes}</span>
          </p>
          <p>
            Success Rate: <span>{results.successRate}%</span>
          </p>
        </div>
      )

      setTimeout(() => setMyStats(false), 16000)
    }
  }

  return (
    <>
      <Modal open={showModal.show}>{showModal.content}</Modal>
      <h1>Linear Regression Checker</h1>
      <div className="app-body">
        <div className="graph-area">
          <ScatterPlot data={chartData} />
          <PointsTable points={points} />
        </div>
        <Form
          onShowStats={handleShowUserStats}
          onSubmit={handleSubmission}
          onDraw={handleDrawLinearEquation}
        />
        <div className="my-stats-area">
          {myStats && <MyStats>{myStats}</MyStats>}
        </div>
      </div>
    </>
  )
}

export default App
