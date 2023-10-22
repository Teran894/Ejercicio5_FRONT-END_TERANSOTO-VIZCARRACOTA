//#region VARIABLES GLOBALES
const imagePath = `../assets/img/catalogo_IMG/`;

const apiURL = 'https://65334237d80bd20280f65941.mockapi.io/api';

let CatalogoJuegosList = [];
//#endregion

//#region MODELO DE DATOS
class Sale {
  //Definimos la clase Sale
    constructor(id, customerName, customerPhone, saleDate, publisher, videoGame, salePrice, notes) {
      this.id = id; // Identificador de la venta
      this.customerName = customerName; // Nombre del cliente
      this.customerPhone = customerPhone; // Teléfono del cliente
      this.saleDate = saleDate; // Fecha de la venta
      this.publisher = publisher; // Empresa que distribuye el juego
      this.videoGame = videoGame; // Referencia al modelo del juego vendida
      //this.realEstate = realEstate; // Referencia al modelo de la casa vendida
      this.salePrice = salePrice; // Precio de la venta
      this.notes = notes; // Información adicional sobre la venta
    }
  }
  
  function mapAPIToSales(data) {
    return data.map(item => {
      return new Sale(
        item.id,
        item.customerName,
        item.customerPhone,
        new Date(item.saleDate),
        item.publisher,
        item.videoGame,
        item.salePrice,
        item.notes
      );
    });
  }
  
// Definimos la clase de RealEstate con los datos necesarios
  class RealEstateDescriptor {
    constructor(id, name, price) {
      this.id = id;
      this.name = name;
      this.price = price;
    }
  }
  
  function mapAPIToRealEstateDescriptors(data) {
    return data.map(item => {
      return new RealEstateDescriptor(
        item.id,
        item.name,
        item.price
      );
    });
  }
  
//#endregion

//#region 3. VENTAS (VIEW)

function displayVentasView(sales) {
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

// Funcion que agrega los datos de los modelos de casas a la tabla.
function displaySalesTable(sales) {
  const tablaBody = document.getElementById('data-table-body');
  sales.forEach(sale => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${sale.id}</td>
      <td>${sale.customerName}</td>
      <td>${sale.customerPhone}</td>
      <td>${sale.videoGame}</td>
      <td>${sale.publisher}</td>
      <td>${formatDate(sale.saleDate)}</td>
      <td class="text-right">${formatCurrency(sale.salePrice)}</td>
      <td>${sale.notes}</td>
      <td>
        <button class="btn-delete" data-sale-id="${sale.id}">Eliminar</button>
      </td>
    `;
    tablaBody.appendChild(row);

  });
  initDeleteSaleButtonHandler();
}

// Funcion que limpia la tabla
function clearTable() {
  const tableBody = document.getElementById('data-table-body');
  tableBody.innerHTML = '';
}


// Funcion que muestra mensaje de carga
function showLoadingMessage() {
  const message = document.getElementById('message');
  message.innerHTML = 'Cargando...';
  message.style.display = 'block';
}


// Funcion que muestra mensaje de carga
function showInitialMessage() {
  const message = document.getElementById('message');
  message.innerHTML = 'No se ha realizado una consulta de ventas.';
  message.style.display = 'block';
}


// Funcion que muestra mensaje de que no se encuentraron datos
function showNotFoundMessage() {
  const message = document.getElementById('message');
  message.innerHTML = 'No se encontraron casas con el filtro proporcionado.';
  message.style.display = 'block';
}


// Funcion que oculta mensaje
function hideMessage() {
  const message = document.getElementById('message');
  message.style.display = 'none';
}
//#endregion


//#region 3. VENTAS (VIEW)

function displayVentasView(sales) {

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


// Funcion que agrega los datos de los modelos de casas a la tabla.
function displaySalesTable(sales) {

  const tablaBody = document.getElementById('data-table-body');

  sales.forEach(sale => {

    const row = document.createElement('tr');

    row.innerHTML = `
      <td>${sale.id}</td>
      <td>${sale.customerName}</td>
      <td>${sale.customerPhone}</td>
      <td>${sale.videoGame}</td>
      <td>${sale.publisher}</td>
      <td>${formatDate(sale.saleDate)}</td>
      <td class="text-right">${formatCurrency(sale.salePrice)}</td>
      <td>${sale.notes}</td>
      <td>
        <button class="btn-delete" data-sale-id="${sale.id}">Eliminar</button>
      </td>
    `;

    tablaBody.appendChild(row);

  });

  initDeleteSaleButtonHandler();
}


// Funcion que limpia la tabla
function clearTable() {
  const tableBody = document.getElementById('data-table-body');

  tableBody.innerHTML = '';
}


// Funcion que muestra mensaje de carga
function showLoadingMessage() {
  const message = document.getElementById('message');

  message.innerHTML = 'Cargando...';

  message.style.display = 'block';
}


// Funcion que muestra mensaje de carga
function showInitialMessage() {
  const message = document.getElementById('message');

  message.innerHTML = 'No se ha realizado una consulta de ventas.';
  message.style.display = 'block';
}


// Funcion que muestra mensaje de que no se encuentraron datos
function showNotFoundMessage() {
  const message = document.getElementById('message');

  message.innerHTML = 'No se encontraron casas con el filtro proporcionado.';

  message.style.display = 'block';
}


// Funcion que oculta mensaje
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
  const videoGame = document.getElementById('real-estate-filter').value;
  const customerName = document.getElementById('customer-filter').value;
  const publisher = document.getElementById('publisher-filter').value;
  const saleDate = document.getElementById('date-filter').value;

  getSalesData(videoGame, customerName, publisher, saleDate);
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
  const customerName = document.getElementById('customer-name-field').value;
  const customerPhone = document.getElementById('customer-phone-field').value;
  const videoGame = document.getElementById('videogamefield').value;
  const salePrice = document.getElementById('sale-price-field').value;
  const saleDate = document.getElementById('sale-date-field').value;
  const publisher = document.getElementById('publisher-field').value;
  const notes = document.getElementById('notes-field').value;

  const saleToSave = new Sale(
    null,
    customerName,
    customerPhone,
    videoGame,
    parseFloat(salePrice),
    saleDate,
    publisher,
    notes
  );

  createSale(saleToSave);
}


function initDeleteSaleButtonHandler() {

  document.querySelectorAll('.btn-delete').forEach(button => {

    button.addEventListener('click', () => {

      const saleId = button.getAttribute('data-sale-id'); // Obtenemos el ID de la venta
      deleteSale(saleId); // Llamamos a la función para eleminar la venta

    });

  });

}
// Mostrar y ocultar el modal para agregar una nueva venta.
//#endregion


//#region 6. CARGAR DATOS DE MODELOS PARA FORM (VIEW)

// Funcion que agrega los datos de los modelos de casas a la tabla.
function displayRealEstateOptions() {

  const videogamefield = document.getElementById('real-estate-filter');
  const videogameModal = document.getElementById('videogamefield');

  realEstates.forEach(videogamefield => {

    const optionFilter = document.createElement('option');

    optionFilter.value = videoGame.name;
    optionFilter.text = `${videoGame.name} - ${formatCurrency(videoGame.price)}`;

    realEstateFilter.appendChild(optionFilter);

    const optionModal = document.createElement('option');

    optionModal.value = videoGame.name;
    optionModal.text = `${videoGame.name} - ${formatCurrency(videoGame.price)}`;

    videogameModal.appendChild(optionModal);
  });

}

//#endregion


//#region 7. CONSUMO DE DATOS DESDE API

function getRealEstateData() {

  fetchAPI(`${apiURL}/Ventas`, 'GET')
    .then(data => {
      const realEstatesList = mapAPIToRealEstateDescriptors(data);
      displayRealEstateOptions(realEstatesList);
    });

}


function getSalesData(videoGame, customerName, publisher, saleDate) {

  const url = buildGetSalesDataUrl(videoGame, customerName, publisher, saleDate);

  fetchAPI(url, 'GET')
    .then(data => {
      const ventasList = mapAPIToSales(data);
      displayVentasView(ventasList);
    });
}


function createSale(sale) {

  fetchAPI(`${apiURL}/sales`, 'POST', sale)
    .then(sale => {
      closeAddSaleModal();
      resetSales();
      window.alert(`Venta ${sale.id} creada correctamente.`);
    });

}


function deleteSale(saleId) {

  const confirm = window.confirm(`¿Estás seguro de que deseas eliminar la venta ${saleId}?`);

  if (confirm) {

    fetchAPI(`${apiURL}/sales/${saleId}`, 'DELETE')
      .then(() => {
        resetSales();
        window.alert("Venta eliminada.");
      });

  }
}

// Funcion que genera la url para consultar ventas con filtros.
function buildGetSalesDataUrl(videoGame, customerName, publisher, saleDate) {
  // Tecnica de string dinamico: se aconseja cuando tenemos una cantidad limitada de parámetros y
  //    cierto control de los tipos de parametros (id, fechas).
  // const url = `${apiURL}/sales?realEstate=${realEstate}&customerName=${customerName}&salesman=${salesman}&saleDate=${saleDate}`;

  // URL y URLSearchParams: simplifican la construcción de URLs dinámicas y complejas,
  //    facilitan la gestión de múltiples parámetros y textos dinámicos al encargarse de
  //    la codificación y decodificación de caracteres especiales, lo que evita problemas
  //    comunes relacionados con espacios y caracteres no válidos.
  const url = new URL(`${apiURL}/sales`);

  if (videoGame) {
    url.searchParams.append('videoGame', videoGame);
  }

  if (customerName) {
    url.searchParams.append('customerName', customerName);
  }

  if (publisher) {
    url.searchParams.append('publisher', publisher);
  }

  if (saleDate) {
    url.searchParams.append('saleDate', saleDate);
  }

  return url;
}

//#endregion


//#region 8. INICIALIZAMOS FUNCIONALIDAD (CONTROLLER)

initAddSaleButtonsHandler();

initFilterButtonsHandler();

getRealEstateData();

//#endregion
