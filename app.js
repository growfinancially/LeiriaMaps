/*
  Leiria Maps — versão inicial.
  Para ativar a base de dados, preenche SUPABASE_URL e SUPABASE_ANON_KEY.
  Nunca coloques uma chave service_role neste ficheiro público.
*/
const SUPABASE_URL = (window.LEIRIA_MAPS_CONFIG||{}).SUPABASE_URL || "";
const SUPABASE_ANON_KEY = (window.LEIRIA_MAPS_CONFIG||{}).SUPABASE_ANON_KEY || "";
const hasSupabase = Boolean(SUPABASE_URL && SUPABASE_ANON_KEY && window.supabase);
const db = hasSupabase ? window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY) : null;

const categoryNames = {
  restaurantes:"Restaurantes", barbearias:"Barbearias", eventos:"Eventos", lojas:"Lojas",
  ginasios:"Ginásios", turismo:"Turismo", estudo:"Estudo", servicos:"Serviços"
};

// Exemplos demonstrativos: confirmar e substituir por negócios reais antes de publicar.
const demoPlaces = [
  {id:"demo-1",name:"Castelo de Leiria",category:"turismo",address:"Largo de São Pedro, Leiria",description:"Um dos pontos históricos mais conhecidos da cidade.",lat:39.7461,lng:-8.8071},
  {id:"demo-2",name:"Jardim Luís de Camões",category:"turismo",address:"Praça Rodrigues Lobo, Leiria",description:"Espaço central para passear e descansar.",lat:39.7436,lng:-8.8072},
  {id:"demo-3",name:"Praça Rodrigues Lobo",category:"restaurantes",address:"Praça Rodrigues Lobo, Leiria",description:"Zona central com cafés e restauração. Exemplo de localização.",lat:39.7435,lng:-8.8079},
  {id:"demo-4",name:"Mercado de Sant'Ana",category:"eventos",address:"Largo de Sant'Ana, Leiria",description:"Espaço cultural e de eventos. Confirma a programação.",lat:39.7448,lng:-8.8101},
  {id:"demo-5",name:"Estádio Municipal de Leiria",category:"ginasios",address:"Rua do Estádio, Leiria",description:"Equipamento desportivo. Verifica atividades e acesso.",lat:39.7487,lng:-8.8152},
  {id:"demo-6",name:"Biblioteca Municipal Afonso Lopes Vieira",category:"estudo",address:"Largo Cândido dos Reis, Leiria",description:"Confirma horários e condições de utilização.",lat:39.7446,lng:-8.8070}
];

let allPlaces = [...demoPlaces];
let activeCategory = "todos";
let markers = [];
const map = L.map("map").setView([39.7444,-8.8073],13);
L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",{
  maxZoom:19, attribution:'&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener">OpenStreetMap</a>'
}).addTo(map);

function escapeHTML(value="") {
  return String(value).replace(/[&<>"']/g, ch => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[ch]));
}
function filteredPlaces() {
  const term = document.getElementById("searchInput").value.trim().toLocaleLowerCase("pt-PT");
  return allPlaces.filter(p => {
    const matchesCategory = activeCategory==="todos" || p.category===activeCategory;
    const haystack = [p.name,p.address,p.description,categoryNames[p.category]].join(" ").toLocaleLowerCase("pt-PT");
    return matchesCategory && (!term || haystack.includes(term));
  });
}
function render() {
  const places = filteredPlaces();
  markers.forEach(m=>map.removeLayer(m)); markers=[];
  const list = document.getElementById("placeList");
  list.innerHTML = "";
  places.forEach(p=>{
    if(Number.isFinite(Number(p.lat)) && Number.isFinite(Number(p.lng))) {
      const marker=L.marker([Number(p.lat),Number(p.lng)]).addTo(map);
      marker.bindPopup(`<b>${escapeHTML(p.name)}</b><br>${escapeHTML(p.address||"")}<br><small>${escapeHTML(categoryNames[p.category]||"Local")}</small>`);
      markers.push(marker);
    }
    const card=document.createElement("button");
    card.className="place-card"; card.type="button"; card.style.width="100%"; card.style.textAlign="left"; card.style.borderLeft="0";card.style.borderRight="0";card.style.borderTop="0";
    card.innerHTML=`<div class="place-top"><div><h3>${escapeHTML(p.name)}</h3><p>${escapeHTML(p.address||"Morada não indicada")}</p></div><span class="pill">${escapeHTML(categoryNames[p.category]||"Local")}</span></div><p style="margin-top:8px">${escapeHTML(p.description||"")}</p>`;
    card.addEventListener("click",()=>{
      if(Number.isFinite(Number(p.lat)) && Number.isFinite(Number(p.lng))){map.setView([Number(p.lat),Number(p.lng)],16);const marker=markers.find(m=>{const ll=m.getLatLng();return Math.abs(ll.lat-p.lat)<0.000001&&Math.abs(ll.lng-p.lng)<0.000001});if(marker)marker.openPopup();}
      else if(p.address) window.open("https://www.openstreetmap.org/search?query="+encodeURIComponent(p.address)," _blank");
    });
    list.appendChild(card);
  });
  document.getElementById("resultCount").textContent=`${places.length} ${places.length===1?"resultado":"resultados"}`;
  document.getElementById("listCount").textContent=places.length;
  if(!places.length) list.innerHTML='<div class="empty-state">Não encontrámos locais com esses critérios. Experimenta outra pesquisa ou categoria.</div>';
}
async function loadBusinesses() {
  if(!db) { render(); return; }
  try {
    const {data,error}=await db.from("businesses").select("id,name,category,address,description,lat,lng").eq("status","approved").limit(500);
    if(error) throw error;
    allPlaces=[...demoPlaces,...(data||[])]; render();
  } catch(err) { console.error("Não foi possível carregar os negócios:",err); render(); }
}

document.getElementById("searchInput").addEventListener("input",render);
document.getElementById("searchButton").addEventListener("click",()=>{render();document.getElementById("explorar").scrollIntoView({behavior:"smooth"});});
document.getElementById("clearFilters").addEventListener("click",()=>{activeCategory="todos";document.getElementById("searchInput").value="";document.querySelectorAll(".category").forEach(b=>b.classList.toggle("active",b.dataset.category==="todos"));render();});
document.querySelectorAll(".category").forEach(button=>button.addEventListener("click",()=>{
  activeCategory=button.dataset.category;
  document.querySelectorAll(".category").forEach(b=>b.classList.toggle("active",b===button));
  render();
}));

document.getElementById("businessForm").addEventListener("submit",async event=>{
  event.preventDefault();
  const form=event.currentTarget, msg=document.getElementById("formMessage"), data=Object.fromEntries(new FormData(form).entries());
  data.website=data.website||null; data.phone=data.phone||null; data.description=data.description||null;
  msg.className="form-message"; msg.textContent="";
  if(data.website && !/^https?:\/\//i.test(data.website)){msg.classList.add("error");msg.textContent="O website deve começar por https:// ou http://.";return;}
  if(!db){msg.classList.add("error");msg.textContent="A demonstração está ativa, mas a base de dados ainda não foi ligada. Configura o Supabase seguindo o README.";return;}
  try {
    const {error}=await db.from("business_submissions").insert([data]);
    if(error) throw error;
    form.reset();msg.textContent="Proposta enviada! Será revista antes de aparecer no mapa.";
  } catch(err) { console.error(err);msg.classList.add("error");msg.textContent="Não foi possível enviar. Confirma a configuração e tenta novamente."; }
});
document.getElementById("year").textContent=new Date().getFullYear();
loadBusinesses();
