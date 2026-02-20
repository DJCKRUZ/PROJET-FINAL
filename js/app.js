// Configuration: si vous avez une clé TMDB, collez-la ici pour activer la recherche réelle.
const TMDB_API_KEY = ""; // <-- mettre votre clé TMDB ici (facultatif)

const moviesGrid = document.getElementById('moviesGrid');
const searchBtn = document.getElementById('searchBtn');
const searchInput = document.getElementById('searchInput');
const modal = document.getElementById('modal');
const modalBody = document.getElementById('modalBody');
const closeModal = document.getElementById('closeModal');
const filterBtns = Array.from(document.querySelectorAll('.filter-btn'));

const sampleMovies = [
  {id:1,title:'Inception',year:2010,rating:8.8,overview:'Un voleur capable d\'entrer dans les rêves et d\'y implanter des idées.',poster:'images/poster1.svg',genres:['Action','Sci-Fi']},
  {id:2,title:'The Matrix',year:1999,rating:8.7,overview:'Un hacker découvre la réalité simulée et rejoint la résistance.',poster:'images/poster2.svg',genres:['Action','Sci-Fi']},
  {id:3,title:'Interstellar',year:2014,rating:8.6,overview:'Voyage interstellaire pour sauver l\'humanité en franchissant les frontières de l\'espace-temps.',poster:'images/poster3.svg',genres:['Drama','Sci-Fi']},
  {id:4,title:'The Shawshank Redemption',year:1994,rating:9.3,overview:'Deux hommes tissent une amitié derrière les barreaux.',poster:'images/poster1.svg',genres:['Drama']},
  {id:5,title:'The Dark Knight',year:2008,rating:9.0,overview:'Batman affronte le Joker dans une lutte pour Gotham.',poster:'images/poster2.svg',genres:['Action','Drama']},
  {id:6,title:'Back to the Future',year:1985,rating:8.5,overview:'Un adolescent voyage accidentellement dans le passé.',poster:'images/poster3.svg',genres:['Comedy','Sci-Fi']}
];

let activeGenre = 'all';

function safeImg(src){
  // ensure relative svg exists; if not, return a data URL placeholder
  return src || 'images/poster1.svg';
}

function renderMovies(movies){
  moviesGrid.innerHTML = '';
  if(!movies || movies.length===0){
    moviesGrid.innerHTML = '<p>Aucun film trouvé.</p>';
    return;
  }
  movies.forEach(m=>{
    const card = document.createElement('article');
    card.className = 'card';
    const posterSrc = safeImg(m.poster);
    card.innerHTML = `
      <img class="poster" src="${posterSrc}" alt="Affiche ${m.title}" onerror="this.onerror=null;this.src='images/poster1.svg'">
      <div class="card-body">
        <h3 class="title">${m.title}</h3>
        <div class="meta"><div><span class="badge">${m.year}</span> <span style="margin-left:8px" class="badge">${m.genres[0]||''}</span></div><div class="rating">⭐ ${m.rating}</div></div>
      </div>
    `;
    card.addEventListener('click',()=>openModal(m));
    moviesGrid.appendChild(card);
  });
}

function openModal(m){
  modal.classList.remove('hidden');
  modalBody.innerHTML = `
    <img class="modal-poster" src="${safeImg(m.poster)}" alt="poster" onerror="this.onerror=null;this.src='images/poster1.svg'">
    <h3>${m.title} <small>(${m.year})</small></h3>
    <p class="meta">Genres: ${m.genres.join(', ')} • ⭐ ${m.rating}</p>
    <p>${m.overview || 'Pas de description disponible.'}</p>
    <div style="clear:both"></div>
  `;
}

function closeModalFn(){ modal.classList.add('hidden'); modalBody.innerHTML = ''; }
if(closeModal) closeModal.addEventListener('click',closeModalFn);
modal.addEventListener('click',(e)=>{ if(e.target===modal) closeModalFn(); });

async function fetchFromTMDB(query){
  try{
    const resp = await fetch(`https://api.themoviedb.org/3/search/movie?api_key=${TMDB_API_KEY}&language=fr-FR&query=${encodeURIComponent(query)}`);
    const data = await resp.json();
    return (data.results||[]).slice(0,20).map(r=>({
      id:r.id,title:r.title||r.original_title,year:(r.release_date||'').slice(0,4),rating:(r.vote_average||0).toFixed(1),overview:r.overview,poster:r.poster_path?`https://image.tmdb.org/t/p/w500${r.poster_path}`:'images/poster1.svg',genres:[]
    }));
  }catch(e){ console.error(e); return null; }
}

async function searchMovies(query){
  query = (query||'').trim();
  let results = sampleMovies.slice();
  if(query){
    if(TMDB_API_KEY){
      const remote = await fetchFromTMDB(query);
      if(remote) return renderMovies(remote);
    }
    const q = query.toLowerCase();
    results = sampleMovies.filter(m=>m.title.toLowerCase().includes(q) || (m.overview||'').toLowerCase().includes(q));
  }
  // apply genre filter
  if(activeGenre && activeGenre!=='all'){
    results = results.filter(m=> (m.genres||[]).includes(activeGenre));
  }
  renderMovies(results);
}

searchBtn.addEventListener('click',()=>searchMovies(searchInput.value));
searchInput.addEventListener('keydown',(e)=>{ if(e.key==='Enter') searchMovies(searchInput.value); });

filterBtns.forEach(b=>{
  b.addEventListener('click',()=>{
    filterBtns.forEach(x=>x.classList.remove('active'));
    b.classList.add('active');
    activeGenre = b.dataset.genre || 'all';
    searchMovies(searchInput.value);
  });
});

// set default active filter
const allBtn = document.querySelector('.filter-btn[data-genre="all"]');
if(allBtn) allBtn.classList.add('active');

// initial render
renderMovies(sampleMovies);
