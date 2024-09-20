import React, { useState } from "react";

// Utility function to calculate time difference in hours
const calculateTimeDifference = (start, end) => {
  const [startHours, startMinutes] = start.split(":").map(Number);
  const [endHours, endMinutes] = end.split(":").map(Number);

  const startTime = new Date();
  startTime.setHours(startHours, startMinutes, 0);

  const endTime = new Date();
  endTime.setHours(endHours, endMinutes, 0);

  // If end time is earlier than start time, assume it is the next day
  if (endTime < startTime) {
    endTime.setDate(endTime.getDate() + 1);
  }

  const diffMs = endTime - startTime;
  const diffHours = diffMs / (1000 * 60 * 60);
  return diffHours.toFixed(2); // Return with 2 decimal places
};

// Utility function to sum up column values
const sumColumn = (data, colIndex) => {
  return data
    .reduce((sum, row) => {
      const value = parseFloat(row[colIndex]) || 0;
      return sum + value;
    }, 0)
    .toFixed(2);
};

const A4PageLandscape = () => {
  // A4 size in mm converted to pixels at 96 DPI (dots per inch)
  const a4WidthPx = 297 * 3.78; // Querformat: Breite ist 297 mm
  const a4HeightPx = 190 * 3.78; // Querformat: Höhe ist 200 mm

  const pageStyle = {
    width: `${a4WidthPx}px`,
    height: `${a4HeightPx}px`,
    border: "1px solid #000", // Optional: add a border to visualize the page
    margin: "0 auto", // Optional: center the page horizontally
    backgroundColor: "#fff", // Optional: set the background to white
    position: "relative", // Optional: relative positioning for absolute children
    overflow: "hidden", // Optional: hide any content that overflows
  };

  // Initialize the table data
  const initialData = Array(10)
    .fill(null)
    .map(() => Array(7).fill(""));

  const [data, setData] = useState(initialData);

  // State for selected month
  const [selectedMonth, setSelectedMonth] = useState("August");

  const handleChange = (rowIndex, colIndex, value) => {
    const newData = data.map((row, rIdx) => {
      if (rIdx === rowIndex) {
        const newRow = [...row];
        newRow[colIndex] = value;

        // Calculate time difference if time columns are updated
        if (colIndex === 1 || colIndex === 2) {
          const startTime = newRow[1] || "00:00";
          const endTime = newRow[2] || "00:00";
          const diff = calculateTimeDifference(startTime, endTime);
          newRow[4] = diff;
        }

        return newRow;
      }
      return row;
    });
    setData(newData);
  };

  const addRow = () => {
    setData([...data, Array(7).fill("")]);
  };

  const handleMonthChange = (event) => {
    setSelectedMonth(event.target.value);
  };

  const printPage = () => {
    const printWindow = window.open("", "", "height=600,width=800");
    printWindow.document.open();
    printWindow.document.write(`
      <html>
        <head>
          <title>Druckansicht</title>
          <style>
            @media print {
              table { width: 100%; border-collapse: collapse; }
              th, td { border: 1px solid black; padding: 8px; }
              th { background-color: #f2f2f2; }
              body { margin: 0; }
              @page { margin: 0; }
              .header, .footer { display: none; } /* Hide header and footer for print */
            }
            @media screen {
              table { width: 100%; border-collapse: collapse; margin-top: 20px; }
              th, td { border: 1px solid black; padding: 8px; }
              th { background-color: #f2f2f2; }
            }
            .container {
              width: ${a4WidthPx}px;
              height: ${a4HeightPx}px;
              border: 1px solid #000;
              background-color: #fff;
              margin: 0 auto;
              position: relative;
              overflow: hidden;
            }
            .header {
              display: flex;
              justify-content: space-between;
              margin-bottom: 20px;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <p>Taxifahrer Name: </p>
              <p>Monat: ${selectedMonth} 2024 </p>
              <p>Unterschrift Fahrer</p>
              <p></p>
            </div>
            <table>
              <thead>
                <tr>
                  <th>Tour bzw. Fahrten</th>
                  <th>Arbeitszeit von</th>
                  <th>Arbeitszeit bis</th>
                  <th>Pause in Std</th>
                  <th>Arbeitszeit in Std</th>
                  <th>Überstunden</th>
                  <th>Sonstiges</th>
                </tr>
              </thead>
              <tbody>
                ${data
                  .map((row) => {
                    const firstColumnValue =
                      row[0] === "" ? "Stadtrundfahrt" : row[0];
                    return `<tr>${[firstColumnValue, ...row.slice(1)]
                      .map((cell) => `<td>${cell}</td>`)
                      .join("")}</tr>`;
                  })
                  .join("")}
                <tr>
                  <td>Gesamtsumme</td>
                  <td></td>
                  <td></td>
                  <td>${sumColumn(data, 3)}</td>
                  <td>${sumColumn(data, 4)}</td>
                  <td></td>
                  <td></td>
                </tr>
              </tbody>
            </table>
          </div>
        </body>
      </html>`);
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
  };

  return (
    <div style={pageStyle}>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <p>Taxifahrer Name: </p>
        <div>
          <label htmlFor="month-select">2024 - Monat:</label>
          <select
            id="month-select"
            value={selectedMonth}
            onChange={handleMonthChange}
            style={{ marginLeft: "10px" }}
          >
            <option value="Januar">Januar</option>
            <option value="Februar">Februar</option>
            <option value="März">März</option>
            <option value="April">April</option>
            <option value="Mai">Mai</option>
            <option value="Juni">Juni</option>
            <option value="Juli">Juli</option>
            <option value="August">August</option>
            <option value="September">September</option>
            <option value="Oktober">Oktober</option>
            <option value="November">November</option>
            <option value="Dezember">Dezember</option>
          </select>
          <p></p>
        </div>
        <p>Unterschrift Fahrer</p>
        <p></p>
      </div>
      <table
        style={{ width: "100%", borderCollapse: "collapse", marginTop: "20px" }}
      >
        <thead>
          <tr style={{ border: "1px solid black", padding: "8px" }}>
            <th>Tour bzw. Fahrten</th>
            <th>Arbeitszeit von</th>
            <th>Arbeitszeit bis</th>
            <th>Pause in Std</th>
            <th>Arbeitszeit in Std</th>
            <th>Überstunden</th>
            <th>Sonstiges</th>
          </tr>
        </thead>
        <tbody>
          {data.map((row, rowIndex) => (
            <tr key={rowIndex}>
              <td style={{ border: "1px solid black", padding: "8px" }}>
                <input
                  type="text"
                  value={row[0] || "Stadtrundfahrt"}
                  onChange={(e) => handleChange(rowIndex, 0, e.target.value)}
                  style={{ width: "100%", boxSizing: "border-box" }} // Ensure input fills the cell
                />
              </td>
              {row.slice(1).map((cell, colIndex) => (
                <td
                  key={colIndex + 1}
                  style={{ border: "1px solid black", padding: "8px" }}
                >
                  <input
                    type={colIndex === 0 || colIndex === 1 ? "time" : "text"}
                    value={cell}
                    onChange={(e) =>
                      handleChange(rowIndex, colIndex + 1, e.target.value)
                    }
                    style={{ width: "100%", boxSizing: "border-box" }} // Ensure input fills the cell
                  />
                </td>
              ))}
            </tr>
          ))}
          <tr>
            <td>Gesamtsumme</td>
            <td></td>
            <td></td>
            <td>{sumColumn(data, 3)}</td>
            <td>{sumColumn(data, 4)}</td>
            <td></td>
            <td></td>
          </tr>
        </tbody>
      </table>
      <button onClick={addRow} style={{ marginTop: "20px" }}>
        Reihe hinzufügen
      </button>
      <button onClick={printPage} style={{ marginTop: "20px" }}>
        Drucken
      </button>
    </div>
  );
};

export default A4PageLandscape;
