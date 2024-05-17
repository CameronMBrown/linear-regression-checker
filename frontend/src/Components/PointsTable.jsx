import "../styles/pointsTable.scss"

function PointsTable({ points }) {
  return (
    <table className="coord-table card">
      <thead>
        <tr>
          <th>X</th>
          <th>Y</th>
        </tr>
      </thead>
      <tbody>
        {points.map((point, i) => (
          <tr key={i}>
            <td>{point.x}</td>
            <td>{point.y}</td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}

export default PointsTable
