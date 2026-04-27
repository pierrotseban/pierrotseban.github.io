  let dataGlobal = null;
  async function loadCSV(url) {
    const response = await fetch(url);
    const text = await response.text();
    const result = Papa.parse(text, {
      header: false,
      skipEmptyLines: false
    });
    dataGlobal = result.data;
    return result.data;
  }
  
  function populateSelect(values, selectId) {
    const select = document.getElementById(selectId);
    select.innerHTML = "";
    for (const val of values) {
      const option = document.createElement("option");
      option.value = val;
      option.textContent = val;
      select.appendChild(option);
    }
  }
  
  function getSelectedValues(selectId) {
    const select = document.getElementById(selectId);
    return Array.from(select.selectedOptions).map(opt => opt.value);
  }
  
  function updateTable(data, selectedYears, selectedColumns) {
    const table = document.getElementById("result-table");
    table.innerHTML = "";
  
    const headers = ["Année", ...selectedColumns];
    const thead = table.insertRow();
    headers.forEach(h => thead.insertCell().textContent = h);
  
    const yearIdx = 0;
    const columnIndices = selectedColumns.map(col => data[0].indexOf(col));
  
    for (let i = 1; i < data.length; i++) {
      const year = data[i][yearIdx];
      if (selectedYears.includes(year)) {
        const row = table.insertRow();
        row.insertCell().textContent = year;
        let allEmpty = true;
        for (const idx of columnIndices) {
          const rawValue = data[i][idx];
          const intValue = parseInt(rawValue);
          row.insertCell().textContent = (!isNaN(intValue)) ? intValue : rawValue;
          
          if (rawValue !== "" && rawValue !== null && rawValue !== undefined) {
            allEmpty = false;
          }
        }
        if (allEmpty) {
          table.deleteRow(row.rowIndex);
        }
      }
    }
  }
  


  (async function main() {
    const data = await loadCSV('/assets/docs/agregphilo/programmes_agreg_philo_synthèse.csv');
    const headers = data[0];
    const years = data.slice(1).map(r => r[0]);
    const uniqueYears = [...new Set(years)];
  
    populateSelect(uniqueYears, "year-select");
    populateSelect(headers.slice(1), "column-select");
  
    document.getElementById("filter-form").addEventListener("submit", (e) => {
      e.preventDefault();
      const selectedYears = getSelectedValues("year-select");
      const selectedColumns = getSelectedValues("column-select");
      updateTable(data, selectedYears, selectedColumns);
    });
    // populateYearRangeSelectors(dataGlobal);
    const counts = auteursEcrit(dataGlobal, ['Auteur Ecrit 1', 'Auteur Ecrit 2', 'Auteur Ecrit 3']);
    displayAuteursEcrit(counts);
    statsLangues(dataGlobal, ['Année Grec', 'Année Latin', 'Année Allemand', 'Année Anglais', 'Année Arabe', 'Année Italien']);

  })();
  

    // function auteursEcrit(data, columnNames) {
  //   const header = data[0];
  //   const indices = columnNames.map(name => header.indexOf(name));
  //   const counts = {};
  
  //   for (let i = 1; i < data.length; i++) {
  //     for (const idx of indices) {
  //       const value = data[i][idx];
  //       if (value && value.trim() !== "" && value.trim() !== "?") {
  //         const key = value.trim();
  //         counts[key] = (counts[key] || 0) + 1;
  //       }
  //     }
  //   }
  
  //   // Convertir en tableau trié
  //   const sorted = Object.entries(counts).sort((a, b) => b[1] - a[1]);
  
  //   // Afficher le résultat dans un tableau HTML (par exemple)
  //   const freqDiv = document.getElementById("frequency-output");
  //   const table = document.createElement("table");
  //   table.innerHTML = "<tr><th>Auteur de l'écrit</th><th># de fois au programme</th></tr>";
  
  //   sorted.forEach(([val, count]) => {
  //     const row = table.insertRow();
  //     row.insertCell().textContent = val;
  //     row.insertCell().textContent = count;
  //   });
  
  //   freqDiv.appendChild(table);
  // }

  function auteursEcrit(data, columnNames) {
    const header = data[0];
    const yearIdx = 0;
    const counts = {};
  
    for (let i = 1; i < data.length; i++) {
      const year = parseInt(data[i][yearIdx]);
      if (isNaN(year)) continue;
  
      for (const colName of columnNames) {
        const colIdx = header.indexOf(colName);
        const value = data[i][colIdx]?.trim();
        if (!value || value.trim() == "" || value.trim() == "?") continue;
  
        if (!counts[value]) {
          counts[value] = {
            count: 0,
            firstYear: year,
            lastYear: year
          };
        }
  
        counts[value].count++;
        counts[value].firstYear = Math.min(counts[value].firstYear, year);
        counts[value].lastYear = Math.max(counts[value].lastYear, year);
      }
    }
  
    // Transformer l'objet en tableau trié par fréquence décroissante
    return Object.entries(counts)
      .map(([value, info]) => ({
        value,
        count: info.count,
        firstYear: info.firstYear,
        lastYear: info.lastYear
      }))
      .sort((a, b) => b.count - a.count);
  }
  
  function displayAuteursEcrit(counts) {
    const container = document.getElementById("auteurs-ecrit");
    container.innerHTML = "";
  
    const table = document.createElement("table");
    table.innerHTML = `
      <thead>
        <tr>
          <th>Auteur de l'écrit</th>
          <th># de fois au programme</th>
          <th>Première année</th>
          <th>Dernière année</th>
        </tr>
      </thead>
      <tbody>
        ${counts.map(c => `
          <tr>
            <td>${c.value}</td>
            <td>${c.count}</td>
            <td>${c.firstYear}</td>
            <td>${c.lastYear}</td>
          </tr>
        `).join("")}
      </tbody>
    `;
    container.appendChild(table);
  }
  


  function statsLangues(data, columnNames) {
    const header = data[0];
    const yearIdx = 0;
    const results = [];
  
    for (const colName of columnNames) {
      const colIdx = header.indexOf(colName);
      const values = [];
      const yearMinusValue = [];
  
      for (let i = 1; i < data.length; i++) {
        const year = parseInt(data[i][yearIdx]);
        const value = parseFloat(data[i][colIdx]);
  
        if (!isNaN(value) && !isNaN(year)) {
          values.push(value);
          yearMinusValue.push(year - value);
        }
      }
  
      if (values.length === 0) continue;
  
      values.sort((a, b) => a - b);
      yearMinusValue.sort((a, b) => a - b);
  
      const min = values[0];
      const max = values[values.length - 1];
      const sum = values.reduce((a, b) => a + b, 0);
      const mean = sum / values.length;
      const median = values.length % 2 === 0
        ? (values[values.length / 2 - 1] + values[values.length / 2]) / 2
        : values[Math.floor(values.length / 2)];
  
      // const minYearDiff = Math.min(...yearMinusValue);
      const minYearDiff = yearMinusValue[0];
      const ageSum = yearMinusValue.reduce((a, b) => a + b, 0);
      const meanYearDiff = ageSum / yearMinusValue.length;
  
      results.push({
        colonne: colName.split(" ")[1],
        min, max, mean, median,
        minYearDiff, meanYearDiff
      });
    }
  
    displayStatsLangues(results);
  }  

  function displayStatsLangues(stats) {
    const container = document.getElementById("stats-langues");
    container.innerHTML = "";
  
    const labels = ["Texte le plus ancien", "Texte le plus récent", "Date moyenne", "Date médiane", 
      "Age minimal", "Age moyen"
    ];
  
    const table = document.createElement("table");
    const thead = document.createElement("thead");
    const tbody = document.createElement("tbody");
  
    // En-tête : nom des colonnes en 1ère ligne
    const headRow = document.createElement("tr");
    headRow.innerHTML = "<th></th>" +
      stats.map(s => `<th>${s.colonne}</th>`).join("");
    thead.appendChild(headRow);
  
    // Corps : une ligne par statistique
    labels.forEach(label => {
      const row = document.createElement("tr");
      const cells = stats.map(stat => {
        let value;
        switch (label) {
          case "Texte le plus ancien": value = stat.min; break;
          case "Texte le plus récent": value = stat.max; break;
          case "Date moyenne": value = stat.mean; break;
          case "Date médiane": value = stat.median; break;
          case "Age minimal": value = stat.minYearDiff; break;
          case "Age moyen": value = stat.meanYearDiff; break;
        }
        
        return `<td>${Math.round(value)}${label === "Age minimal" || label === "Age moyen" ? " ans" : ""}</td>`;

      });
      row.innerHTML = `<th>${label}</th>` + cells.join("");
      tbody.appendChild(row);
    });
  
    table.appendChild(thead);
    table.appendChild(tbody);
    container.appendChild(table);
  }
  
  
  
  