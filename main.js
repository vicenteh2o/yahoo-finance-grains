import { createCard } from './card.js';

const container = document.createElement('div');
container.className = 'container-fluid mt-4';
document.body.appendChild(container);

// Date inputs form
const formContainer = document.createElement('div');
formContainer.className = 'row mb-4';
formContainer.innerHTML = `
  <div class="col-md-12">
    <div class="card">
      <div class="card-body">
        <div class="row align-items-end">
          <div class="col-md-4">
            <label for="period1" class="form-label">Fecha Inicio (Period 1)</label>
            <input type="date" class="form-control" id="period1" required>
          </div>
          <div class="col-md-4">
            <label for="period2" class="form-label">Fecha Fin (Period 2)</label>
            <input type="date" class="form-control" id="period2" required>
          </div>
          <div class="col-md-4">
            <button id="consultarBtn" class="btn btn-primary w-100" disabled>Consultar</button>
          </div>
        </div>
      </div>
    </div>
  </div>
`;
container.appendChild(formContainer);

const row = document.createElement('div');
row.className = 'row';
row.id = 'resultsRow';
row.style.display = 'none';
container.appendChild(row);

const symbols = [
  { code: 'ZS', name: 'Soja' },
  { code: 'ZC', name: 'Milho' },
  { code: 'ZW', name: 'Trigo' }
];

function dateToUnixTimestamp(dateString) {
  return Math.floor(new Date(dateString).getTime() / 1000);
}

// Enable/disable button based on input values
const period1Input = document.getElementById('period1');
const period2Input = document.getElementById('period2');
const consultarBtn = document.getElementById('consultarBtn');

function checkInputs() {
  if (period1Input.value && period2Input.value) {
    consultarBtn.disabled = false;
  } else {
    consultarBtn.disabled = true;
  }
}

period1Input.addEventListener('change', checkInputs);
period2Input.addEventListener('change', checkInputs);

consultarBtn.addEventListener('click', () => {
  const period1 = dateToUnixTimestamp(period1Input.value);
  const period2 = dateToUnixTimestamp(period2Input.value);
  
  // Clear previous results
  row.innerHTML = '';
  row.style.display = 'flex';
  
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
    
    fetch(`http://localhost:3000/api/data?symbol=${symbol.code}&period1=${period1}&period2=${period2}`)
      .then(response => response.json())
      .then(data => {
        data.card.forEach(item => {
          const card = createCard(item);
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
});
