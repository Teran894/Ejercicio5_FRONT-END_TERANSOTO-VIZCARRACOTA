//#region 1. VARIABLES GLOBALES

const imagePath = `../assets/img/catalogo_IMG/`;

const apiURL = 'https://65334237d80bd20280f65941.mockapi.io/Playwin';

let CatalogoJuegosList = [];

//#endregion

//#region 2. Consultar datos
class CatalogoJuegos {

  constructor(id, image, title, platform, description, price, rating) {
    this.id = id;
    this.image = image;
    this.title = title;
    this.platform = platform;
    this.description = description;
    this.price = price;
    this.rating = rating;
  }
}
//#endregion

/*
const game1 = new CatalogoJuegos(1,"honkaiST.jpg","Honkai Star Rail","PC|PS","Gacha turn based game",0,7.8)
const game2 = new CatalogoJuegos(2,"starfield.jpg","Starfield","Xbox|PC","Open world space exploration game",60,8.6)
const game3 = new CatalogoJuegos(3,"hollowknight.jpg","Hollow Knight","Xbox|PC|Switch","Slash and dash bug game",45,9.2)
const CatalogoJuegosList = [game1,game2,game3];
*/
/*
console.log('Impresion en consola de elementos accesados con forEach(): ');
CatalogoJuegosList.forEach(item => {console.log(item)});
*/

//#region VISTA DE LOS MODELOS EN HTML (VIEW)
function displayView(games) {
  clearTable();
  showLoadingMessage();
  setTimeout(() => { 
    if (games.length === 0) {
      showNotFoundMessage();
    } else {
      hideMessage();
      displayTable(games)
    }
  }, 2000);
}
    
function displayTable(games) {
  const tablaBody = document.getElementById('data-table-body');
  games.forEach(game => {
    const row = document.createElement('tr');
    row.innerHTML = `
    <td> ${game.id} </td>
    <td> <img src="${imagePath + game.image}" alt="${game.title}" width="100"> </td>
    <td>${game.title}</td>
    <td>${game.platform}</td>
    <td>${game.description}</td>
    <td>${game.price}</td>
    <td>${game.rating}</td>
    `;
    tablaBody.appendChild(row);
  });
}
  

function clearTable() {
  const tableBody = document.getElementById('data-table-body');
  tableBody.innerHTML = '';
}

function showLoadingMessage() {
  const messageNotFound = document.getElementById('message-not-found');
  messageNotFound.innerHTML = 'Cargando...';
  messageNotFound.style.display = 'block';
}

function showNotFoundMessage() {
  const messageNotFound = document.getElementById('message-not-found');
  messageNotFound.innerHTML = 'No se encontraron juegos con el filtro.';
  messageNotFound.style.display = 'block';
}

function hideMessage() {
  const messageNotFound = document.getElementById('message-not-found');
  messageNotFound.style.display = 'none';
}

displayTable(CatalogoJuegosList);
//#endregion

//#region filtros
function initButtonsHandler() {
  document.getElementById('filter-form').addEventListener('submit', event => {
    event.preventDefault();
    applyFilters();
  });

  document.getElementById('reset-filters').addEventListener('click', () => {
    document.querySelectorAll('input.filter-field').forEach(input => input.value = '');
    applyFilters();
  });

}

// Funcion que gestiona la aplicacion del filtro a los datos y su despliegue.
function applyFilters() {
  const filterText = document.getElementById('text').value.toLowerCase();
  const filterRating = parseFloat(document.getElementById('rating').value);
  const filterMinPrice = parseFloat(document.getElementById('price-min').value);
  const filterMaxPrice = parseFloat(document.getElementById('price-max').value);
  const filteredGames = filterGames(CatalogoJuegosList, filterText, filterRating, filterMinPrice, filterMaxPrice);
  displayTable(filteredGames);
}

// Funcion con la logica para filtrar las casas.
function filterGames(games, text, rating, minPrice, maxPrice) {
  return games.filter(game =>
    (!rating || game.rating === rating) &&
    (!minPrice || game.price >= minPrice) &&
    (!maxPrice || game.price <= maxPrice) &&
    (!text || game.title.toLowerCase().includes(text) || game.description.toLowerCase().includes(text))
  );
}
displayTable(CatalogoJuegosList);
//#endregion

//#region CONSUMO DE DATOS DESDE API
//Funcion que realiza una solicitud GET a la API para obtener datos de los modelos de casas.
function searchData() {
  const OPTIONS = {
    method: 'GET'
  };

  fetch(`${apiURL}/Catalogo`, OPTIONS)
    .then(response => response.json())
    .then(data => {
      // Mapeamos los datos de modelos a objetos de la clase CatalogoJuegos.
      CatalogoJuegosList = data.map(item => {
        return new CatalogoJuegos(
          item.id,
          item.image,
          item.title,
          item.platform,
          item.description,
          item.price,
          item.rating
        );
      });
      // Mostramos los datos en la vista.
      displayView(CatalogoJuegosList);
    })
    .catch(error => console.log(error));
}
//#endregion

//#region FUNCIONES INICIALIZADORAS Y CONTROLADORES DE EVENTOS (CONTROLLER)

initButtonsHandler();
showLoadingMessage();
searchData();

//#endregion