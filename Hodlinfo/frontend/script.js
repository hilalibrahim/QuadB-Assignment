
document.addEventListener('DOMContentLoaded', () => {
    fetch('/api/tickers')
      .then(response => response.json())
      .then(data => {
        const tickerContainer = document.getElementById('tablebody');
  
        const headerRow = document.createElement('tr');
        headerRow.innerHTML = `
          <th scope="col">#</th>
          <th scope="col">Name</th>
          <th scope="col">Last</th>
          <th scope="col">Buy/Sell</th>
          <th scope="col">Volume</th>
          <th scope="col">Base Unit</th>
        `;
        tickerContainer.appendChild(headerRow);
  
    
        data.forEach((ticker, index) => {
          const row = document.createElement('tr');
          row.innerHTML = `
            <td>${index + 1}</td>
            <td>${ticker.name}</td>
            <td>${ticker.last}</td>
            <td>${ticker.buy}/${ticker.sell}</td>
            <td>${ticker.volume}</td>
            <td>${ticker.base_unit}</td>
          `;
          tickerContainer.appendChild(row);
        });
      })
      .catch(error => console.error('Error:', error));
  });
  