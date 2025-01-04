function displayCSVAsTable(csv) {
    const rows = csv.split('\n');
    const table = document.createElement('table');

    rows.forEach((row, index) => {
      const tr = document.createElement('tr');
      const cells = row.split(',');

      cells.forEach(cell => {
        const cellElement = document.createElement(index === 0 ? 'th' : 'td');
        cellElement.textContent = cell.trim();
        tr.appendChild(cellElement);
      });

      table.appendChild(tr);
    });

    const container = document.getElementById('tableContainer');
    container.innerHTML = ''; // Clear previous content
    container.appendChild(table);
  }

function display_(path) {
    fetch(path)
    .then(response => response.text())
    .then(csv => displayCSVAsTable(csv));
  }