const container = document.createElement('div');
container.className = 'container-fluid mt-4';
document.body.appendChild(container);

const row = document.createElement('div');
row.className = 'row';
container.appendChild(row);

const symbols = [
  { code: 'ZS', name: 'Soja' },
  { code: 'ZC', name: 'Milho' },
  { code: 'ZW', name: 'Trigo' }
];

const months = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];

function formatDate(timestamp) {
  const date = new Date(timestamp * 1000);
  const month = months[date.getMonth()];
  const year = date.getFullYear().toString().slice(-2);
  return `${month} ${year}`;
}

function formatPrice(value) {
  return value.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

symbols.forEach(symbol => {
  const column = document.createElement('div');
  column.className = 'col-md-4';
  
  const title = document.createElement('h3');
  title.className = 'mb-3';
  title.textContent = symbol.name;
  column.appendChild(title);
  
  const cardsContainer = document.createElement('div');
  column.appendChild(cardsContainer);
  
  row.appendChild(column);
  
  fetch(`http://localhost:3000/api/data?symbol=${symbol.code}`)
    .then(response => response.json())
    .then(data => {
      data.card.forEach(item => {
        const card = document.createElement('div');
        card.className = 'card mb-2';
        
        const cardBody = document.createElement('div');
        cardBody.className = 'card-body p-2';
        
        const dateRow = document.createElement('div');
        dateRow.className = 'fw-bold mb-2';
        dateRow.textContent = formatDate(item.timestamp);
        cardBody.appendChild(dateRow);
        
        const priceRow = document.createElement('div');
        priceRow.className = 'd-flex justify-content-between align-items-center';
        
        const openPrice = document.createElement('span');
        openPrice.textContent = `${formatPrice(item.open)} /bushel`;
        priceRow.appendChild(openPrice);
        
        const difference = item.close - item.open;
        const diffSpan = document.createElement('span');
        diffSpan.className = 'fw-bold';
        diffSpan.style.color = difference >= 0 ? 'green' : 'red';
        diffSpan.textContent = `${difference >= 0 ? '+' : ''}${formatPrice(difference)}`;
        priceRow.appendChild(diffSpan);
        
        cardBody.appendChild(priceRow);
        card.appendChild(cardBody);
        cardsContainer.appendChild(card);
      });
    })
    .catch(error => {
      const errorDiv = document.createElement('div');
      errorDiv.className = 'alert alert-danger';
      errorDiv.textContent = 'Error: ' + error.message;
      cardsContainer.appendChild(errorDiv);
    });
});
