// Configuration: si vous avez une clé TMDB, collez-la ici pour activer la recherche réelle.
const TMDB_API_KEY = ""; // <-- mettre votre clé TMDB ici (facultatif)

const moviesGrid = document.getElementById('moviesGrid');
const searchBtn = document.getElementById('searchBtn');
const searchInput = document.getElementById('searchInput');
const modal = document.getElementById('modal');
const modalBody = document.getElementById('modalBody');
const closeModal = document.getElementById('closeModal');

const sampleMovies = [
  {id:1,title:'Inception',year:2010,rating:8.8,overview:'Un voleur capable d\'entrer dans les rêves...',poster:'images/poster1.svg'},
  {id:2,title:'The Matrix',year:1999,rating:8.7,overview:'Un hacker découvre la réalité simulée...',poster:'images/poster2.svg'},
  {id:3,title:'Interstellar',year:2014,rating:8.6,overview:'Voyage interstellaire pour sauver l\'humanité...',poster:'images/poster3.svg'}
];

function renderMovies(movies){
  moviesGrid.innerHTML = '';
  if(!movies || movies.length===0){
    moviesGrid.innerHTML = '<p>Aucun film trouvé.</p>';
    return;
  }
  movies.forEach(m=>{
    const card = document.createElement('article');
    card.className = 'card';
    card.innerHTML = `
      <img class="poster" src="${m.poster}" alt="${m.title} poster">
      <div class="card-body">
        <h3 class="title">${m.title}</h3>
        <div class="meta">${m.year} • ⭐ ${m.rating}</div>
      </div>
    `;
    card.addEventListener('click',()=>openModal(m));
    moviesGrid.appendChild(card);
  });
}

function openModal(m){
  modal.classList.remove('hidden');
  modalBody.innerHTML = `
    <img class="modal-poster" src="${m.poster}" alt="poster">
    <h3>${m.title} <small>(${m.year})</small></h3>
    <p class="meta">⭐ ${m.rating}</p>
    <p>${m.overview || 'Pas de description disponible.'}</p>
    <div style="clear:both"></div>
  `;
}

function closeModalFn(){ modal.classList.add('hidden'); modalBody.innerHTML = ''; }
closeModal.addEventListener('click',closeModalFn);
modal.addEventListener('click',(e)=>{ if(e.target===modal) closeModalFn(); });

async function searchMovies(query){
  query = query.trim();
  if(!query) return renderMovies(sampleMovies);
  if(TMDB_API_KEY){
    try{
      const resp = await fetch(`https://api.themoviedb.org/3/search/movie?api_key=${TMDB_API_KEY}&language=fr-FR&query=${encodeURIComponent(query)}`);
      const data = await resp.json();
      const results = (data.results||[]).slice(0,20).map(r=>({
        id:r.id,title:r.title||r.original_title,year:(r.release_date||'').slice(0,4),rating:(r.vote_average||0).toFixed(1),overview:r.overview,poster:r.poster_path?`https://image.tmdb.org/t/p/w500${r.poster_path}`:'images/poster1.svg'
      }));
      return renderMovies(results);
    }catch(err){
      console.error(err); return renderMovies(sampleMovies);
    }
  }else{
    // Filtre local
    const q = query.toLowerCase();
    const results = sampleMovies.filter(m=>m.title.toLowerCase().includes(q));
    return renderMovies(results);
  }
}

searchBtn.addEventListener('click',()=>searchMovies(searchInput.value));
searchInput.addEventListener('keydown',(e)=>{ if(e.key==='Enter') searchMovies(searchInput.value); });

// initial render
renderMovies(sampleMovies);
