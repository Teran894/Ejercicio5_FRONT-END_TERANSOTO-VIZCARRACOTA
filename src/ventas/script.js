//#region 1. VARIABLES GLOBALES
const apiURL = 'https://65334237d80bd20280f65941.mockapi.io/';

let CatalogoJuegosList = [];
//#endregion


//#region 2. MODELO DE DATOS

//Definimos la clase Sale
class Sale {
    constructor(salesId, customerName, customerPhone, videoGame, publisher, salesDate, salesPrice, notes) {
      this.salesId = salesId; // Identificador de la venta
      this.customerName = customerName; // Nombre del cliente
      this.customerPhone = customerPhone; // Teléfono del cliente
      this.videoGame = videoGame; // Referencia al modelo del juego vendida
      this.publisher = publisher; // Empresa que distribuye el juego
      this.salesDate = salesDate; // Fecha de la venta
      this.salesPrice = salesPrice; // Precio de la venta
      this.notes = notes; // Información adicional sobre la venta
    }
  }
  
  function mapAPIToSales(data) {
    return data.map(item => {
      return new Sale(
        item.salesId,
        item.customerName,
        item.customerPhone,
        item.videoGame,
        item.publisher,
        new Date(item.salesDate),
        item.salesPrice,
        item.notes
      );
    });
  }
  
// Definimos la clase de RealEstate con los datos necesarios
  class RealEstateDescriptor {

    constructor(salesId, videoGame, salesPrice) {
      this.salesId = salesId;
      this.videoGame = videoGame;
      this.salesPrice = salesPrice;
    }

  }
  

  function mapAPIToRealEstateDescriptors(data) {
    return data.map(item => {
      return new RealEstateDescriptor(
        item.salesId,
        item.videoGame,
        item.salesPrice
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
      <td>${sale.salesId}</td>
      <td>${sale.customerName}</td>
      <td>${sale.customerPhone}</td>
      <td>${sale.videoGame}</td>
      <td>${sale.publisher}</td>
      <td>${formatDate(sale.salesDate)}</td>
      <td class="text-right">${sale.salesPrice}</td>
      <td>${sale.notes}</td>
      <td>
        <button class="btn-delete" data-sale-id="${sale.salesId}">Eliminar</button>
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
  
  message.innerHTML = 'No se encontraron juegos con el filtro proporcionado.';
  
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
  const videoGame = document.getElementById('videogame-filter').value;
  const customerName = document.getElementById('customer-filter').value;
  const publisher = document.getElementById('publisher-filter').value;
  const salesDate = document.getElementById('date-filter').value;
  
  getSalesData(videoGame, customerName, publisher, salesDate);
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
  const videoGame = document.getElementById('videogame-field').value;
  const publisher = document.getElementById('publisher-field').value;
  const saleDate = document.getElementById('sale-date-field').value;
  const salePrice = document.getElementById('sale-price-field').value;
  const notes = document.getElementById('notes-field').value;

  const saleToSave = new Sale(
    null,
    customerName,
    customerPhone,
    videoGame,
    publisher,
    saleDate,
    parseFloat(salePrice),
    notes
  );

  createSale(saleToSave);
}


function initDeleteSaleButtonHandler() {

  document.querySelectorAll('.btn-delete').forEach(button => {
    
    button.addEventListener('click', () => {
      
      const salesId = button.getAttribute('data-sale-id'); // Obtenemos el ID de la venta
      deleteSale(salesId); // Llamamos a la función para eleminar la venta
    
    });
  
  });

}


// Mostrar y ocultar el modal para agregar una nueva venta.

//#endregion


//#region 6. CARGAR DATOS DE MODELOS PARA FORM (VIEW)

// Funcion que agrega los datos de los modelos de casas a la tabla.
function displayRealEstateOptions(videoGames) {

  const videogamefilter = document.getElementById('videogame-filter');
  const videogameModal = document.getElementById('videogame-field');

  videoGames.forEach(videoGame => {

    const optionFilter = document.createElement('option');

    optionFilter.value = videoGame.name;
    optionFilter.text = `${videoGame.name} - ${formatCurrency(videoGame.price)}`;

    videogamefilter.appendChild(optionFilter);

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
      const videoGamesList = mapAPIToRealEstateDescriptors(data);
      displayRealEstateOptions(videoGamesList);
    });

}


function getSalesData(videoGame, customerName, publisher, salesDate) {

  const url = buildGetSalesDataUrl(videoGame, customerName, publisher, salesDate);

  fetchAPI(url, 'GET')
    .then(data => {
      const ventasList = mapAPIToSales(data);
      displayVentasView(ventasList);
    });
}


function createSale(sale) {

  fetchAPI(`${apiURL}/Ventas`, 'POST', sale)
    .then(sale => {
      closeAddSaleModal();
      resetSales();
      window.alert(`Venta ${sale.salesId} creada correctamente.`);
    });

}


function deleteSale(salesId) {

  const confirm = window.confirm(`¿Estás seguro de que deseas eliminar la venta ${salesId}?`);

  if (confirm) {

    fetchAPI(`${apiURL}/Ventas/${salesId}`, 'DELETE')
      .then(() => {
        resetSales();
        window.alert("Venta eliminada.");
      });

  }
}

// Funcion que genera la url para consultar ventas con filtros.
function buildGetSalesDataUrl(videoGame, customerName, publisher, salesDate) {
  // Tecnica de string dinamico: se aconseja cuando tenemos una cantidad limitada de parámetros y
  //    cierto control de los tipos de parametros (id, fechas).
  // const url = `${apiURL}/sales?realEstate=${realEstate}&customerName=${customerName}&salesman=${salesman}&saleDate=${saleDate}`;

  // URL y URLSearchParams: simplifican la construcción de URLs dinámicas y complejas,
  //    facilitan la gestión de múltiples parámetros y textos dinámicos al encargarse de
  //    la codificación y decodificación de caracteres especiales, lo que evita problemas
  //    comunes relacionados con espacios y caracteres no válidos.
  const url = new URL(`${apiURL}/Ventas`);

  if (videoGame) {
    url.searchParams.append('videoGame', videoGame);
  }

  if (customerName) {
    url.searchParams.append('customerName', customerName);
  }

  if (publisher) {
    url.searchParams.append('publisher', publisher);
  }

  if (salesDate) {
    url.searchParams.append('salesDate', salesDate);
  }

  return url;
}

//#endregion


//#region 8. INICIALIZAMOS FUNCIONALIDAD (CONTROLLER)

initAddSaleButtonsHandler();

initFilterButtonsHandler();

getRealEstateData();

//#endregion