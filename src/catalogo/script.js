//#region MODELO DE DATOS
class CatalogoJuegos{

constructor (id, title, platform, description, price, rating, image){
    this.id = id;
    this.title =title;
    this.platform = platform;
    this.description = description;
    this.price = price;
    this.rating = rating;
    this.image = image ;
    }
}

const game1 = new CatalogoJuegos(1,"Honkai Star Rail","PC|PS","Gacha turn based game",0,7.8,"honkaiST.jpg")
const game2 = new CatalogoJuegos(2,"Starfield","Xbox|PC","Open world space exploration game",60,8.6,"starfield.jpg")
const game3 = new CatalogoJuegos(3,"Hollow Knight","Xbox|PC|Switch","Slash and dash bug game",45,9.2,"hollowknight.jpg")

const CatalogoJuegosList = [game1,game2,game3];

console.log('Impresion en consola de elementos accesados con forEach(): ');
CatalogoJuegosList.forEach(item => {console.log(item)});
//#endregion

//#region VISTA HTML
function displayTable(games){
    clearTable();

    showLoadingMessage();

    setTimeout(() => {

        if (games.length === 0) {
    
          showNotFoundMessage();
    
        } else {
    
            hideMessage();
    
            const tablaBody = document.getElementById('data-table-body');
    
            const imagePath = `../assets/img/catalogo_IMG/`;
    
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
    
      }, 2000);

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

//#endregion

displayTable(CatalogoJuegosList);

function initButtonsHandler() {

  document.getElementById('filter-form').addEventListener('submit', event => {
    event.preventDefault();
    applyFilters();
  });

}



function applyFilters() {
  const filterText = document.getElementById('text').value.toLowerCase();;
  const filterRating = parseFloat(document.getElementById('rating').value);
  const filterMinPrice = parseFloat(document.getElementById('price-min').value);
  const filterMaxPrice = parseFloat(document.getElementById('price-max').value);

  const filteredGames = filteredGames(realEstateList, filterText, filterRating, filterMinPrice, filterMaxPrice);

  displayTable(filteredGames);
}



function filteredGames(  text, rating, minPrice, maxPrice) {

  return games.filter( games =>
      (!rating || games.rating === rating) &&
      (!minPrice || games.price >= minPrice) &&
      (!maxPrice || games.price <= maxPrice) &&
      (!text     || games.name.toLowerCase().includes(text) || games.description.toLowerCase().includes(text))
    );
}
