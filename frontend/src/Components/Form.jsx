import { useState } from "react"
import "../styles/formArea.scss"

function Form({ onSubmit, onDraw }) {
  const [slope, setSlope] = useState("")
  const [intercept, setIntercept] = useState("")

  const handleDrawLinear = () => {
    if (slope !== "" && intercept !== "" && slope >= 0 && intercept >= 0) {
      console.log("HERE!")
      onDraw(slope, intercept)
    }
  }

  return (
    <form className="form card" onSubmit={onSubmit}>
      <div>
        <input name="name" type="text" placeholder="your name"></input>
      </div>
      <p className="linear-equation">
        y =
        <input
          name="slope"
          type="number"
          step="0.01"
          placeholder="m"
          value={slope}
          onChange={(e) => setSlope(e.target.value)}
        ></input>
        x +
        <input
          name="intercept"
          type="number"
          step="0.01"
          placeholder="b"
          value={intercept}
          onChange={(e) => setIntercept(e.target.value)}
        ></input>
      </p>
      <div className="button-area">
        <button type="button" onClick={handleDrawLinear}>
          Draw
        </button>
        <button type="submit">Verify</button>
      </div>
    </form>
  )
}

export default Form
