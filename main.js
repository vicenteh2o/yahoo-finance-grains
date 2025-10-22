fetch('http://localhost:3000/api/data')
  .then(response => response.json())
  .then(data => {
    const p = document.createElement('p');
    p.style.whiteSpace = 'pre-wrap';
    p.textContent = JSON.stringify(data, null, 2);
    document.body.appendChild(p);
  })
  .catch(error => {
    const p = document.createElement('p');
    p.textContent = 'Error: ' + error.message;
    document.body.appendChild(p);
  });
