//#region 2. MODELO DE DATOS (MODELS)

class Sale {
  constructor(id, client, telNumber, game, dateOfSale, seller, price, notes) {
    this.id = id; // Identificador de la venta
    this.client = client; // Nombre del cliente
    this.telNumber = telNumber; // Teléfono del cliente
    this.game = game; // Referencia al juego
    this.seller = seller; // Vendedor
    this.dateOfSale = dateOfSale; // Fecha de la venta
    this.price = price; // Precio de la venta
    this.notes = notes; // Información adicional sobre la venta
  }
}

function mapAPIToSales(data) {
  return data.map(item => {
    return new Sale(
      item.id,
      item.client,
      item.telNumber,
      item.game,
      new Date(item.dateOfSale),
      item.seller,
      item.price,
      item.notes
    );
  });
}

class GameDescriptor {

  constructor(id, title, price) {
    this.id = id;
    this.title = title;
    this.price = price;
  }

}


function mapAPIToGameDescriptors(data) {
  return data.map(game => {
    return new GameDescriptor(
      game.id,
      game.title,
      game.price
    );
  });
}

//#endregion

//#region 3. VENTAS (VIEW)

function displaySalesView(sales) {

  clearTable();

  showLoadingMessage();

  if (sales.length === 0) {

    showNotFoundMessage();

  } else {

    hideMessage();

    displaySalesTable(sales);
  }

}


function displayClearSalesView() {
  clearTable();

  showInitialMessage();
}

function displaySalesTable(sales) {

  const tablaBody = document.getElementById('data-table-body');

  sales.forEach(sale => {

    const row = document.createElement('tr');

    row.innerHTML = `
      <td>${sale.id}</td>
      <td>${sale.client}</td>
      <td>${sale.telNumber}</td>
      <td>${sale.game}</td>
      <td>${sale.seller}</td>
      <td>${formatDate(sale.dateOfSale)}</td>
      <td class="text-right">${formatCurrency(sale.price)}</td>
      <td>${sale.notes}</td>
      <td>
        <button class="btn-delete" data-sale-id="${sale.id}">Eliminar</button>
      </td>
    `;

    tablaBody.appendChild(row);

  });

  initDeleteSaleButtonHandler();
}

function clearTable() {
  const tableBody = document.getElementById('data-table-body');

  tableBody.innerHTML = '';
}

function showLoadingMessage() {
  const message = document.getElementById('message');

  message.innerHTML = 'Cargando...';

  message.style.display = 'block';
}

function showInitialMessage() {
  const message = document.getElementById('message');

  message.innerHTML = 'No se ha realizado una consulta de ventas.';

  message.style.display = 'block';
}

function showNotFoundMessage() {
  const message = document.getElementById('message');

  message.innerHTML = 'No se encontraron juegos con el filtro proporcionado.';

  message.style.display = 'block';
}

function hideMessage() {
  const message = document.getElementById('message');

  message.style.display = 'none';
}

//#endregion

//#region 4. FILTROS (VIEW)

function initFilterButtonsHandler() {

  document.getElementById('filter-form').addEventListener('submit', event => {
    event.preventDefault();
    searchSales();
  });

  document.getElementById('reset-filters').addEventListener('click', () => clearSales());

}


function clearSales() {
  document.querySelector('select.filter-field').selectedIndex = 0;
  document.querySelectorAll('input.filter-field').forEach(input => input.value = '');

  displayClearSalesView();
}


function resetSales() {
  document.querySelector('select.filter-field').selectedIndex = 0;
  document.querySelectorAll('input.filter-field').forEach(input => input.value = '');
  searchSales();
}


function searchSales() {
  const game = document.getElementById('game-filter').value;
  const client = document.getElementById('customer-filter').value;
  const seller = document.getElementById('salesman-filter').value;
  const dateOfSale = document.getElementById('date-filter').value;

  getSalesData(game, client, seller, dateOfSale);
}

//#endregion

//#region 5. BOTONES PARA AGREGAR Y ELIMINAR VENTAS (VIEW)

function initAddSaleButtonsHandler() {

document.getElementById('addSale').addEventListener('click', () => {
  openAddSaleModal()
});

document.getElementById('modal-background').addEventListener('click', () => {
  closeAddSaleModal();
});

document.getElementById('sale-form').addEventListener('submit', event => {
  event.preventDefault();
  processSubmitSale();
});

}
function openAddSaleModal() {
  document.getElementById('sale-form').reset();
  document.getElementById('modal-background').style.display = 'block';
  document.getElementById('modal').style.display = 'block';
}


function closeAddSaleModal() {
  document.getElementById('sale-form').reset();
  document.getElementById('modal-background').style.display = 'none';
  document.getElementById('modal').style.display = 'none';
}


function processSubmitSale() {
  const client = document.getElementById('client-field').value;
  const telNumber = document.getElementById('telNumber-field').value;
  const game = document.getElementById('game-field').value;
  const seller = document.getElementById('seller-field').value;
  const dateofSale = document.getElementById('dateofSale-field').value;
  const price = document.getElementById('price-field').value;
  const notes = document.getElementById('notes-field').value;

  const saleToSave = new Sale(
    null,
    client,
    telNumber,
    game,
    dateofSale,
    seller,
    parseFloat(price),
    notes
  );

  createSale(saleToSave);
}


function initDeleteSaleButtonHandler() {

  document.querySelectorAll('.btn-delete').forEach(button => {

    button.addEventListener('click', () => {

      const saleId = button.getAttribute('data-sale-id');
      deleteSale(saleId); 

    });

  });

}


//#endregion

//#region 6. CARGAR DATOS DE MODELOS PARA FORM (VIEW)
function displayGameOptions(games) {

  const gameFilter = document.getElementById('game-filter');
  const gameModal = document.getElementById('game-field');

  games.forEach(game => {

    const optionFilter = document.createElement('option');

    optionFilter.value = game.title;
    optionFilter.text = `${game.title} - ${formatCurrency(game.price)}`;

    gameFilter.appendChild(optionFilter);

    const optionModal = document.createElement('option');

    optionModal.value = game.title;
    optionModal.text = `${game.title} - ${formatCurrency(game.price)}`;

    gameModal.appendChild(optionModal);
  });

}

//#endregion
 
//#region 7. CONSUMO DE DATOS DESDE API

function getGameData() {
  fetchAPI(`${apiURL}/Catalogo`, 'GET')
    .then(data => {
      const gamesList = mapAPIToGameDescriptors(data);
      displayGameOptions(gamesList);
    });

}


function getSalesData(game, client, seller, dateOfSale) {

  const url = buildGetSalesDataUrl(game,client,seller,dateOfSale);

  fetchAPI(url, 'GET')
    .then(data => {
      const salesList = mapAPIToSales(data);
      displaySalesView(salesList);
    });
}


function deleteSale(saleId) {

  const confirm = window.confirm(`¿Estás seguro de que deseas eliminar la venta ${saleId}?`);

  if (confirm) {

    fetchAPI(`${apiURL}/Ventas/${saleId}`, 'DELETE')
      .then(() => {
        resetSales();
        window.alert("Venta eliminada.");
      });

  }
}

function createSale(sale) {

  fetchAPI(`${apiURL}/Ventas`, 'POST', sale)
    .then(sale => {
      closeAddSaleModal();
      resetSales();
      window.alert(`Venta ${sale.id} creada correctamente.`);
    });

}


function buildGetSalesDataUrl(game, client, seller, dateofSale) {

const url = new URL(`${apiURL}/Ventas`);

if (game) {
  url.searchParams.append('game', game);
}

if (client) {
  url.searchParams.append('client', client);
}

if (seller) {
  url.searchParams.append('seller', seller);
}

if (dateofSale) {
  url.searchParams.append('dateofSale', dateofSale);
}

return url;
}





//#endregion

//#region 8. INICIALIZAMOS FUNCIONALIDAD (CONTROLLER)

initAddSaleButtonsHandler();

initFilterButtonsHandler();

getGameData();

//#endregion