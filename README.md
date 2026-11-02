<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">
<meta name="theme-color" content="#D86A3A">
<meta name="apple-mobile-web-app-capable" content="yes">
<meta name="apple-mobile-web-app-status-bar-style" content="default">
<meta name="apple-mobile-web-app-title" content="Los Cuates">
<link rel="manifest" href="/manifest.webmanifest">
<link rel="icon" href="/icon.svg" type="image/svg+xml">
<title>Los Cuates - Tamales Hoja Plátano</title>
<link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"/>
<script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
<script src="https://cdn.jsdelivr.net/npm/jsqr@1.4.0/dist/jsQR.min.js"></script>
<script src="https://www.gstatic.com/firebasejs/10.12.2/firebase-app-compat.js"></script>
<script src="https://www.gstatic.com/firebasejs/10.12.2/firebase-storage-compat.js"></script>
<script src="./firebase-config.js"></script>
<style>
:root{--bg:#f8f5ee;--card:#fff;--shadow:12px 12px 24px #e6dfd1,-12px -12px 24px #ffffff;--shadow-in:inset 6px 6px 12px #e6dfd1,inset -6px -6px 12px #ffffff;--terra:#D86A3A;--verde:#4A7C59;--maiz:#E8C36A;--azul:#1e3a5f;--text:#1f1d1a}
*{box-sizing:border-box;margin:0;padding:0;font-family:'Segoe UI',system-ui,sans-serif}
body{background:var(--bg);color:var(--text);background-image:radial-gradient(#e6dfd1 0.5px, transparent 0.5px);background-size:12px 12px}
#splash{position:fixed;inset:0;background:var(--bg);z-index:9999;display:flex;flex-direction:column;align-items:center;justify-content:center;transition:opacity .6s}
.logo-circle{width:150px;height:150px;border-radius:50%;background:var(--card);box-shadow:var(--shadow);display:grid;place-items:center;animation:zoom 1.2s ease infinite alternate;padding:10px}
.logo-circle img{width:100%;height:100%;object-fit:contain;border-radius:50%}
@keyframes zoom{from{transform:scale(.92)}to{transform:scale(1.06)}}
.bar{width:220px;height:10px;background:#e6dfd1;border-radius:20px;overflow:hidden;margin-top:22px;box-shadow:var(--shadow-in)}
.bar>div{height:100%;background:linear-gradient(90deg,var(--terra),var(--maiz));width:0%;transition:width .1s}
.badge{margin-top:14px;background:var(--azul);color:#fff;padding:6px 14px;border-radius:20px;font-size:11px;letter-spacing:1px;font-weight:800}
header{max-width:1100px;margin:0 auto;padding:14px 16px;display:flex;justify-content:space-between;align-items:center;position:sticky;top:0;z-index:100;background:rgba(248,245,238,.9);backdrop-filter:blur(12px)}
.h-card{background:var(--card);box-shadow:var(--shadow);border-radius:18px;padding:10px 16px;display:flex;align-items:center;gap:10px;font-weight:800;font-size:13px}
.h-card img{width:36px;height:36px;border-radius:50%;object-fit:cover}
.grid{max-width:1100px;margin:0 auto;padding:12px;display:grid;grid-template-columns:repeat(auto-fit,minmax(300px,1fr));gap:20px}
.card{background:var(--card);border-radius:26px;box-shadow:var(--shadow);padding:20px;transition:transform .2s}
.card:active{transform:scale(.98)}
.emoji{font-size:58px;text-align:center;display:block;filter:drop-shadow(0 8px 12px rgba(0,0,0,.12))}
.price{font-size:22px;font-weight:900;text-align:center;margin:8px 0;color:var(--terra)}
.qty{display:flex;justify-content:center;gap:14px;align-items:center;margin-top:12px}
.qty button{width:48px;height:48px;border-radius:50%;border:none;background:var(--bg);box-shadow:var(--shadow);font-size:22px;font-weight:900;cursor:pointer}
.qty button:active{box-shadow:var(--shadow-in)}
.section{max-width:1100px;margin:20px auto;padding:0 14px}
.box{background:var(--card);box-shadow:var(--shadow);border-radius:22px;padding:20px}
#map{height:280px;border-radius:18px;box-shadow:var(--shadow-in);margin-top:12px}
.cart{position:sticky;bottom:0;z-index:200;background:rgba(248,245,238,.92);backdrop-filter:blur(12px);padding:12px;border-top:1px solid #e6dfd1}
.cart-inner{max-width:1100px;margin:0 auto;background:var(--card);box-shadow:var(--shadow);border-radius:20px;padding:14px;display:flex;flex-wrap:wrap;gap:12px;justify-content:space-between;align-items:center}
.btn{background:var(--terra);color:#fff;border:none;padding:14px 22px;border-radius:14px;font-weight:900;cursor:pointer;box-shadow:0 8px 18px rgba(216,106,58,.3)}
.btn:active{transform:scale(.96)}
.btn2{background:var(--azul);color:#fff}
input,select,textarea{width:100%;padding:12px 14px;border-radius:14px;border:none;background:var(--bg);box-shadow:var(--shadow-in);margin-top:8px;font-size:14px}
#adminModal{display:none;position:fixed;inset:0;background:rgba(0,0,0,.55);z-index:10000;align-items:center;justify-content:center;padding:10px}
#adminModal.active{display:flex}
.admin-box{background:var(--card);border-radius:22px;max-width:860px;width:100%;max-height:92vh;overflow:auto;padding:20px;box-shadow:var(--shadow)}
.tab{display:flex;flex-wrap:wrap;gap:8px;margin:14px 0}
.tab button{padding:10px 14px;border-radius:14px;border:none;background:var(--bg);box-shadow:var(--shadow);font-weight:800;cursor:pointer;font-size:12px}
.tab button.active{background:var(--terra);color:#fff}
.ad-preview{border:2px dashed #d1c7b5;border-radius:16px;overflow:hidden;background:#fff;display:grid;place-items:center;aspect-ratio:1;position:relative}
.kpi{display:grid;grid-template-columns:repeat(auto-fit,minmax(140px,1fr));gap:12px;margin:12px 0}
.kpi div{background:var(--card);box-shadow:var(--shadow);border-radius:18px;padding:14px;text-align:center}
.kpi b{font-size:22px;color:var(--terra);display:block}
.qrbox{display:flex;gap:16px;flex-wrap:wrap;align-items:center}
.qrbox img{border-radius:12px;box-shadow:var(--shadow)}
.footer{max-width:1100px;margin:30px auto;padding:20px;text-align:center}
.footer .jm-logo{width:54px;height:54px;border-radius:50%;box-shadow:var(--shadow);cursor:pointer;transition:transform .2s;object-fit:cover;background:#000}
.footer .jm-logo:active{transform:scale(1.2)}
.pagos-preview{background:var(--bg);box-shadow:var(--shadow-in);border-radius:14px;padding:12px;font-size:12px;margin-top:10px}.schedule-card,.terms-card{margin-top:12px;padding:12px;border-radius:14px;background:var(--bg);box-shadow:var(--shadow-in)}
</style>
<script>
(function(){
  if('serviceWorker' in navigator){
    window.addEventListener('load',()=>navigator.serviceWorker.register('/sw.js').catch(()=>{}));
  }
})();
</script>
</head>
<body>
<div id="splash">
  <div class="logo-circle"><img id="splashLogoCuates" src="data:image/png;base64,UklGRo5RAwBXRUJQVlA4WAoAAAAEAAAAPwYAPwYAVlA4IGRPAwAw5wqdASpABkAGPhkMhUIhBC57HwQYYSzgGiDjZhA8Qecfv36r8f/7R/1v8X8w3Jfeh7Z/D/5z/S" alt="Logo Los Cuates"></div>
  <div style="margin-top:14px" class="logo-circle"><img id="splashLogoJM" src="data:image/png;base64,UklGRv7TAgBXRUJQVlA4WAoAAAAEAAAAPwYAPwYAVlA4INTRAgCQrAmdASpABkAGPhkMhUIhBDJFGQQYYSzgGmvjPuZ/GDxM5z5hvxt/un/R/yXzSck+B/r7wd/ff9f/nv+" alt="Logo JM"></div>
  <h2 style="margin-top:16px;font-weight:900;letter-spacing:1px;color:var(--azul)">LOS CUATES</h2>
  <small>Tamales en Hoja de Plátano • Tradición Saltillo</small>
  <div class="bar"><div id="progress"></div></div>
  <div class="badge">V8 100% - FIREBASE + PAGOS EDITABLES</div>
</div>

<header>
  <div class="h-card"><img id="headerLogo" src="data:image/png;base64,UklGRo5RAwBXRUJQVlA4WAoAAAAEAAAAPwYAPwYAVlA4IGRPAwAw5wqdASpABkAGPhkMhUIhBC57HwQYYSzgGiDjZhA8Qecfv36r8f/7R/1v8X8w3Jfeh7Z/D/5z/S" alt="Los Cuates"><span id="nombreNegocio">Los Cuates Tamales</span></div>
  <div class="h-card" id="estadoBadge">🟢 ABIERTO 07:00-12:00</div>
</header>

<div class="section">
  <div class="box" style="display:flex;gap:10px;flex-wrap:wrap;justify-content:space-between;align-items:center">
    <div><b>Hoja de Plátano Premium</b><br><small style="opacity:.7">Hecho con masa nixtamalizada y guisos tradicionales</small></div>
    <div id="promoBanner" style="background:linear-gradient(90deg,var(--maiz),var(--terra));color:#fff;padding:8px 14px;border-radius:20px;font-weight:800;font-size:12px;display:none"></div>
  </div>
</div>

<div class="grid" id="menu"></div>

<div class="section">
  <div class="box">
    <h3 id="extrasTitle">☕ Extras</h3>
    <div id="extrasList"></div>
  </div>
</div>

<div class="section">
  <div class="box">
    <h3 id="deliveryTitle">📍 Entrega y Pago</h3>
    <input id="nombreCliente" placeholder="Tu nombre">
    <input id="dir" placeholder="Calle y colonia">
    <div style="display:flex;gap:8px;margin-top:8px"><input id="km" type="number" step="0.1" placeholder="km (ej 2.5)" style="flex:1"><button class="btn" style="padding:10px 14px" onclick="calcKm()">Calcular</button></div>
    <div id="map"></div>
    <div class="schedule-card"><label><b>¿Cuándo deseas recibirlo?</b><select id="tipoPedido" onchange="toggleSchedule()"><option value="ahora">Lo antes posible</option><option value="programado">Programado</option></select></label><div id="scheduleFields" hidden><input id="fechaPedido" type="datetime-local"></div></div>
    <div class="terms-card" id="termsPreview"></div>
    <div style="display:flex;gap:8px;margin-top:10px"><button class="btn btn2" onclick="openGmaps()">Abrir en Google Maps</button><span id="distTxt" style="font-size:12px;align-self:center"></span></div>
    <div class="pagos-preview" id="pagosPreviewFooter"></div>
  </div>
</div>

<div class="section">
  <div class="box" id="ticketBox">
    <h3>🧾 Ticket Membretado con QR</h3>
    <div id="ticket" style="font-size:13px;white-space:pre-line;margin-top:10px;opacity:.85;background:var(--bg);box-shadow:var(--shadow-in);border-radius:14px;padding:14px">Aún no hay pedido.</div>
    <div class="qrbox" style="margin-top:12px"><img id="qrImg" src="" style="display:none;width:160px;height:160px"><div id="qrInfo" style="font-size:11px;opacity:.7"></div></div>
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-top:14px">
      <button class="btn" onclick="sendWA()">WhatsApp <span id="waNumBtn">844-225-2582</span></button>
      <button class="btn btn2" onclick="sendEmail()">Email Comprobante</button>
      <button class="btn" style="background:var(--verde)" onclick="copyBanco()">Copiar Datos Bancarios</button>
      <button class="btn" style="background:#222" onclick="openTicket()">Abrir Ticket para Captura</button>
    </div>
  </div>
</div>

<div class="cart">
  <div class="cart-inner">
    <div><b id="totalTamales">0 tamales</b> - Envío $<span id="envio">0</span> - <b>Total $<span id="total">0</span></b><br><small id="folio" style="opacity:.6">Folio: CUATES-PLAT-</small></div>
    <button class="btn" onclick="document.getElementById('ticketBox').scrollIntoView({behavior:'smooth'})">Ver Ticket + QR</button>
  </div>
</div>

<div class="footer">
  <img id="footerJM" class="jm-logo" src="data:image/png;base64,UklGRv7TAgBXRUJQVlA4WAoAAAAEAAAAPwYAPwYAVlA4INTRAgCQrAmdASpABkAGPhkMhUIhBDJFGQQYYSzgGmvjPuZ/GDxM5z5hvxt/un/R/yXzSck+B/r7wd/ff9f/nv+" alt="Logo JM">
  <div style="margin-top:10px;font-weight:800">Hecho con ❤️ por JM Design</div>
  <div style="font-size:12px;opacity:.7;margin-top:6px"><span id="footerEmail">loscuates.tamales@gmail.com</span> • <span id="footerWA">WhatsApp 844-225-2582</span></div>
  <div style="font-size:10px;opacity:.5;margin-top:6px" id="footerBanco">Transferencia: BBVA - Titular: Los Cuates</div>
  <div style="font-size:9px;opacity:.3;margin-top:12px">Los Cuates - Tamales Hoja Plátano - Saltillo - Toca logo JM 3x + largo para Admin (1a2b3c4d)</div>
</div>

<div id="adminModal">
  <div class="admin-box">
    <div style="display:flex;justify-content:space-between;align-items:center"><h3>Admin Los Cuates V8 100% - Hoja Plátano</h3><button onclick="closeAdmin()" style="border:none;background:var(--bg);padding:8px 12px;border-radius:10px;font-weight:800;cursor:pointer">Cerrar</button></div>
    <div class="tab">
      <button id="tb-dash" class="active" onclick="tab('dash')">Dashboard</button>
      <button id="tb-prod" onclick="tab('prod')">Productos</button>
      <button id="tb-marca" onclick="tab('marca')">Marca/Logos</button>
      <button id="tb-promo" onclick="tab('promo')">Promos QR</button>
      <button id="tb-pagos" onclick="tab('pagos')">Pagos/Contacto</button>
      <button id="tb-inv" onclick="tab('inv')">Inventario</button>
      <button id="tb-lotes" onclick="tab('lotes')">Lotes</button>
      <button id="tb-cli" onclick="tab('cli')">Clientes</button>
      <button id="tb-gastos" onclick="tab('gastos')">Corte</button>
      <button id="tb-fb" onclick="tab('fb')">Neon / Estado</button>
    </div>

    <div id="pane-dash">
      <div class="kpi"><div><b id="k-ventas">$0</b>Ventas hoy</div><div><b id="k-tam">0</b>Tamales</div><div><b id="k-ticket">$0</b>Ticket prom</div><div><b id="k-gan">$0</b>Ganancia</div></div>
      <canvas id="chart" width="400" height="120" style="background:var(--bg);box-shadow:var(--shadow-in);border-radius:14px;margin-top:12px"></canvas>
      <div id="alerts" style="margin-top:12px;font-size:12px"></div>
      <pre id="pedidosList" style="background:var(--bg);box-shadow:var(--shadow-in);padding:10px;border-radius:12px;font-size:11px;max-height:180px;overflow:auto;margin-top:12px"></pre>
    </div>

    <div id="pane-prod" style="display:none">
      <div id="prodList"></div>
      <button class="btn" style="margin-top:12px;width:100%" onclick="addProd()">+ Agregar Tamal Nuevo</button>
    </div>

    <div id="pane-marca" style="display:none">
      <h4>Identidad visual y textos</h4>
      <label>Nombre negocio encabezado<input id="cfgNombre" oninput="saveMarca()"></label>
      <label>Texto principal<input id="cfgHeroTitle" oninput="saveVisual()"></label>
      <label>Subtítulo<input id="cfgHeroSubtitle" oninput="saveVisual()"></label>
      <label>Texto de entrega y pago<input id="cfgDeliveryTitle" oninput="saveVisual()"></label>
      <label>Texto de extras<input id="cfgExtrasTitle" oninput="saveVisual()"></label>
      <div class="admin-inline"><label>Color principal<input id="cfgColorTerra" type="color" oninput="saveVisual()"></label><label>Color secundario<input id="cfgColorAzul" type="color" oninput="saveVisual()"></label><label>Color maíz<input id="cfgColorMaiz" type="color" oninput="saveVisual()"></label></div>
      <p style="font-size:12px;opacity:.65;margin-top:8px">Los dibujos de cada tamal se cambian en Productos usando un emoji, símbolo o URL de imagen.</p>
      <label>Logo Los Cuates (encabezado y splash) - URL o subir<input id="cfgLogoCuates" type="file" accept="image/*" onchange="uploadLogo(this,'cuates')"><input id="cfgLogoCuatesUrl" placeholder="o pega URL" oninput="saveMarca()"></label>
      <label>Logo JM pie (admin) - URL o subir<input id="cfgLogoJM" type="file" accept="image/*" onchange="uploadLogo(this,'jm')"><input id="cfgLogoJMUrl" placeholder="o pega URL" oninput="saveMarca()"></label>
      <div style="display:flex;gap:12px;margin-top:10px"><img id="prevCuates" style="width:80px;height:80px;border-radius:50%;box-shadow:var(--shadow);object-fit:cover"><img id="prevJM" style="width:80px;height:80px;border-radius:50%;box-shadow:var(--shadow);object-fit:cover"></div>
    </div>

    <div id="pane-promo" style="display:none">
      <label>Título promo<input id="promoTitulo" placeholder="Ej: 3x2 Lunes"></label>
      <label>Tipo<select id="promoTipo"><option value="3x2">3x2</option><option value="2x1">2x1</option><option value="porc">% Descuento</option><option value="gratis">Producto Gratis</option></select></label>
      <label>Valor (si % o cantidad)<input id="promoValor" type="number" placeholder="10 = 10%"></label>
      <label>Vigencia<input id="promoVig" type="date"></label>
      <label>Texto QR<input id="promoQR" placeholder="Presenta este QR para..."></label>
      <button class="btn" style="width:100%;margin-top:10px" onclick="addPromo()">Crear Promoción</button>
      <div id="promoActivas" style="margin-top:12px"></div>
      <div class="ad-preview" id="adPreview" style="margin-top:12px"></div>
      <button class="btn btn2" style="width:100%;margin-top:8px" onclick="openAd()">Abrir Anuncio para Captura</button>
    </div>

    <div id="pane-pagos" style="display:none">
      <h4>💳 Pagos y Contacto - Editable 100%</h4>
      <label>WhatsApp con lada<input id="cfgWA" placeholder="528442252582" oninput="savePagos()"></label>
      <label>Email<input id="cfgEmail" placeholder="loscuates.tamales@gmail.com" oninput="savePagos()"></label>
      <label>Banco<select id="cfgBanco" onchange="savePagos()"><option>BBVA</option><option>Santander</option><option>Banorte</option><option>Azteca</option><option>HSBC</option></select></label>
      <label>CLABE 18 dígitos<input id="cfgCLABE" placeholder="012180..." maxlength="18" oninput="savePagos()"></label>
      <label>No. Cuenta<input id="cfgCuenta" placeholder="1234567890" oninput="savePagos()"></label>
      <label>Titular<input id="cfgTitular" placeholder="Nestor Jonathan Atondo" oninput="savePagos()"></label>
      <label>Concepto transferencia<input id="cfgConcepto" placeholder="Tamales Los Cuates + folio" oninput="savePagos()"></label>
      <label>Instrucciones<textarea id="cfgInstr" placeholder="Enviar comprobante a WhatsApp" oninput="savePagos()"></textarea></label>
      <label><input type="checkbox" id="cfgShowBanco" checked onchange="savePagos()"> Mostrar datos bancarios en ticket</label>
      <label><input type="checkbox" id="cfgShowQR" checked onchange="savePagos()"> Mostrar QR pago/promo en ticket</label>
      <label>Términos y condiciones de pedidos<textarea id="cfgTerms" rows="5" placeholder="Pedidos para eventos y domicilio sujetos a disponibilidad..." oninput="saveTerms()"></textarea></label>
      <div class="pagos-preview" id="pagosPreview"></div>
    </div>

    <div id="pane-inv" style="display:none">
      <h4>Inventario Hoja Plátano - ¿Cuántos tamales puedo hacer?</h4>
      <div id="invList"></div>
      <div style="margin-top:12px;background:var(--maiz);padding:12px;border-radius:14px;font-weight:800" id="calcTam">Calculando...</div>
      <button class="btn" style="width:100%;margin-top:10px" onclick="addInsumo()">+ Insumo</button>
    </div>

    <div id="pane-lotes" style="display:none">
      <div style="display:flex;gap:8px"><select id="loteTipo"></select><input id="loteCant" type="number" placeholder="Cant" style="max-width:100px"><button class="btn" onclick="crearLote()">Crear lote</button></div>
      <div id="lotesAct" style="margin-top:12px"></div>
    </div>

    <div id="pane-cli" style="display:none">
      <div id="cliList"></div>
    </div>

    <div id="pane-gastos" style="display:none">
      <div style="display:flex;gap:8px"><input id="gastoConcept" placeholder="Gas, hojas, etc"><input id="gastoMonto" type="number" placeholder="$" style="max-width:100px"><button class="btn" onclick="addGasto()">+ Gasto</button></div>
      <div id="gastosList" style="margin-top:12px"></div>
      <button class="btn btn2" style="width:100%;margin-top:12px" onclick="corteCaja()">Cerrar Corte del Día - Utilidad</button>
      <div id="corteHist" style="margin-top:10px;font-size:11px"></div>
    </div>

    <div id="pane-fb" style="display:none">
      <h4>Base de datos Neon - Pedidos y clientes reales</h4>
      <p style="font-size:12px;opacity:.7">La app guarda pedidos, clientes y configuración de contacto en Neon. El modo offline queda como respaldo local.</p>
      <div id="fbConfig" style="padding:12px;background:var(--bg);box-shadow:var(--shadow-in);border-radius:12px;font-size:12px">Conexión administrada por el proyecto. No pegues credenciales en el front.</div>
      <button class="btn" style="width:100%;margin-top:8px" onclick="probarNeon()">Comprobar conexión Neon</button>
      <div id="fbStatus" style="margin-top:10px;font-size:12px;background:var(--bg);box-shadow:var(--shadow-in);padding:10px;border-radius:12px"></div>
      <button class="btn btn2" style="width:100%;margin-top:8px" onclick="probarNeon()">Probar guardado en Neon</button>
      <small style="opacity:.6">Los datos se almacenan en Neon mediante endpoints protegidos del proyecto. La configuración de contacto y transferencias se edita desde Pagos/contacto.</small>
    </div>

  </div>
</div>

<script>
let state={productos:[
  {id:'queso',nombre:'Queso con Rajas',desc:'Rajas poblanas y queso Oaxaca en hoja plátano',precio:45,costo:18,stock:50,emoji:'🧀'},
  {id:'verde',nombre:'Verde Pollo',desc:'Pollo deshebrado en salsa verde tomatillo',precio:50,costo:22,stock:40,emoji:'🍅'},
  {id:'rojo',nombre:'Rojo Puerco',desc:'Puerco en chile rojo tradicional',precio:50,costo:22,stock:40,emoji:'🌶️'},
  {id:'mole',nombre:'Mole',desc:'Mole negro oaxaqueño con pollo',precio:55,costo:25,stock:30,emoji:'🍫'},
  {id:'dulce',nombre:'Dulce',desc:'Masa dulce con pasas hoja plátano',precio:40,costo:15,stock:30,emoji:'🍬'}
],extras:[
  {id:'champ',nombre:'Champurrado 12 Oz',precio:28,costo:10,stock:100},
  {id:'atole',nombre:'Atole Vainilla',precio:25,costo:8,stock:100}
],carrito:{},km:0,folio:'',promos:[],insumos:[
  {id:'hoja',nombre:'Hojas Plátano',stock:200,min:50,costo:2.5,prov:'Central'},
  {id:'masa',nombre:'Masa nixtamalizada kg',stock:20,min:5,costo:25,prov:'Molino'},
  {id:'pollo',nombre:'Pollo kg',stock:10,min:3,costo:85,prov:'Pollería'},
  {id:'puerco',nombre:'Puerco kg',stock:8,min:2,costo:110,prov:'Carnicería'},
  {id:'queso',nombre:'Queso Oaxaca kg',stock:5,min:1,costo:120,prov:'Cremería'}
],lotes:[],clientes:[],gastos:[],config:{nombre:'Los Cuates Tamales',wa:'528442252582',email:'loscuates.tamales@gmail.com',banco:'BBVA',clabe:'012180012345678901',cuenta:'1234567890',titular:'Nestor Jonathan Atondo',concepto:'Tamales Los Cuates',instr:'Enviar comprobante a WhatsApp',showBanco:true,showQR:true,precioKm:25,terms:'Pedidos para eventos y domicilio sujetos a disponibilidad.'}};
state.folio='CUATES-PLAT-'+Math.floor(1000+Math.random()*9000);
document.getElementById('folio').innerText='Folio: '+state.folio;

function loadAll(){
  let s=localStorage.getItem('cuates_v8'); if(s){ try{ let o=JSON.parse(s); state={...state,...o}; if(o.config) state.config={...state.config,...o.config}; }catch(e){} }
  document.getElementById('nombreNegocio').innerText=state.config.nombre;
  document.getElementById('cfgNombre')&&(document.getElementById('cfgNombre').value=state.config.nombre);
  let colors=state.config.colors||{}; let texts=state.config.texts||{};
  const setConfigField=(id,value)=>{ const field=document.getElementById(id); if(field) field.value=value; };
  setConfigField('cfgHeroTitle',texts.heroTitle||'LOS CUATES'); setConfigField('cfgHeroSubtitle',texts.heroSubtitle||''); setConfigField('cfgDeliveryTitle',texts.deliveryTitle||'📍 Entrega y Pago'); setConfigField('cfgExtrasTitle',texts.extrasTitle||'☕ Extras'); setConfigField('cfgColorTerra',colors.terra||'#D86A3A'); setConfigField('cfgColorAzul',colors.azul||'#1e3a5f'); setConfigField('cfgColorMaiz',colors.maiz||'#E8C36A'); applyVisualConfig();
  document.getElementById('cfgWA').value=state.config.wa;
  document.getElementById('cfgEmail').value=state.config.email;
  document.getElementById('cfgBanco').value=state.config.banco;
  document.getElementById('cfgCLABE').value=state.config.clabe;
  document.getElementById('cfgCuenta').value=state.config.cuenta;
  document.getElementById('cfgTitular').value=state.config.titular;
  document.getElementById('cfgConcepto').value=state.config.concepto;
  document.getElementById('cfgInstr').value=state.config.instr;
  document.getElementById('cfgShowBanco').checked=state.config.showBanco;
  document.getElementById('cfgShowQR').checked=state.config.showQR;
  document.getElementById('cfgTerms').value=state.config.terms||'';
  document.getElementById('termsPreview').innerText=state.config.terms||'';
  renderMenu(); renderExtras(); renderPagos(); renderInv(); renderLotesSel(); renderGastos(); renderClientes(); renderDash(); renderPromo();
}
function saveAll(){ localStorage.setItem('cuates_v8', JSON.stringify(state)); }
async function hydrateNeon(){ try{ let r=await fetch('/api/settings'); if(!r.ok)return; let remote=await r.json(); if(remote.contact){ state.config={...state.config,...remote.contact}; localStorage.setItem('cuates_v8', JSON.stringify(state)); }}catch(e){} }
async function probarNeon(){ try{ let r=await fetch('/api/settings'); if(!r.ok)throw new Error(); document.getElementById('fbStatus').innerText='Conectado a Neon: configuración y clientes listos'; }catch(e){ document.getElementById('fbStatus').innerText='Neon no responde. La app sigue funcionando en localStorage.'; }}

function renderMenu(){
  let cont=document.getElementById('menu'); cont.innerHTML='';
  state.productos.forEach(p=>{
    let cant=state.carrito[p.id]||0;
    let d=document.createElement('div'); d.className='card';
    d.innerHTML=`${String(p.emoji||'🫔').startsWith('http')?`<img class="emoji" src="${p.emoji}" alt="${p.nombre}">`:`<span class="emoji">${p.emoji||'🫔'}</span>`}<h3 style="text-align:center">${p.nombre}</h3><div class="price">$${p.precio}</div><div class="qty"><button onclick="chg('${p.id}',-1)">−</button><span id="q-${p.id}" style="font-weight:900">${cant}</span><button onclick="chg('${p.id}',1)">+</button></div>`;
    cont.appendChild(d);
  });
}
function renderExtras(){
  let cont=document.getElementById('extrasList'); cont.innerHTML='';
  state.extras.forEach(e=>{
    let cant=state.carrito[e.id]||0;
    cont.innerHTML+=`<label style="display:flex;justify-content:space-between;align-items:center;margin-top:8px"><span><input type=checkbox id="c-${e.id}" ${cant>0?'checked':''} onchange="toggleExtra('${e.id}')"> ${e.nombre}</span><span>$${e.precio}</span></label>`;
  });
}
function chg(id,d){
  let cur=state.carrito[id]||0; cur=Math.max(0,cur+d); if(cur===0) delete state.carrito[id]; else state.carrito[id]=cur;
  let el=document.getElementById('q-'+id); if(el) el.textContent=cur;
  let cb=document.getElementById('c-'+id); if(cb) cb.checked=cur>0;
  calc();
}
function toggleExtra(id){
  let cb=document.getElementById('c-'+id); if(cb.checked){ if(!state.carrito[id]) state.carrito[id]=1; } else { delete state.carrito[id]; }
  let el=document.getElementById('q-'+id); if(el) el.textContent=state.carrito[id]||0;
  calc();
}
function calcKm(){ let km=parseFloat(document.getElementById('km').value||0); state.km=km; document.getElementById('distTxt').innerText=km? km+' km • $'+(km*state.config.precioKm).toFixed(0):''; calc(); }
function calc(){
  let totalTam=0, subtotal=0;
  for(let id in state.carrito){
    let cant=state.carrito[id];
    let prod=state.productos.find(p=>p.id===id) || state.extras.find(e=>e.id===id);
    if(!prod) continue;
    subtotal+=prod.precio*cant;
    if(state.productos.find(p=>p.id===id)) totalTam+=cant;
  }
  let envio=state.km*state.config.precioKm;
  let promoDesc=0;
  let promoAct=state.promos.find(p=>p.activa!==false);
  if(promoAct){
    if(promoAct.tipo==='3x2' && totalTam>=3){ promoDesc=Math.floor(totalTam/3)* Math.min(...state.productos.map(p=>p.precio)); }
    if(promoAct.tipo==='2x1' && totalTam>=2){ promoDesc=Math.floor(totalTam/2)* Math.min(...state.productos.map(p=>p.precio)); }
    if(promoAct.tipo==='porc'){ promoDesc=subtotal*(promoAct.valor/100); }
  }
  let total=subtotal+envio-promoDesc;
  document.getElementById('totalTamales').innerText=totalTam+' tamales hoja plátano';
  document.getElementById('envio').innerText=envio.toFixed(0);
  document.getElementById('total').innerText=total.toFixed(0);
  let ticket=`${state.config.nombre} - Hoja Plátano\nFolio: ${state.folio}\nFecha: ${new Date().toLocaleString()}\nCliente: ${document.getElementById('nombreCliente').value||'(mostrador)'}\nDir: ${document.getElementById('dir').value||'(por definir)'}\n\n`;
  for(let id in state.carrito){
    let cant=state.carrito[id];
    let prod=state.productos.find(p=>p.id===id) || state.extras.find(e=>e.id===id);
    if(prod) ticket+=`${prod.nombre} x${cant} = $${(prod.precio*cant).toFixed(0)}\n`;
  }
  ticket+=`\nSubtotal: $${subtotal.toFixed(0)}\n`;
  if(promoDesc>0) ticket+=`Promo ${promoAct?promoAct.titulo:''}: -$${promoDesc.toFixed(0)}\n`;
  ticket+=`Envío (${state.km}km x $${state.config.precioKm}): $${envio.toFixed(0)}\nTOTAL: $${total.toFixed(0)}\n\n`;
  if(state.config.showBanco){
    ticket+=`PAGO TRANSFERENCIA:\nBanco: ${state.config.banco}\nCLABE: ${state.config.clabe}\nCuenta: ${state.config.cuenta}\nTitular: ${state.config.titular}\nConcepto: ${state.config.concepto} ${state.folio}\n${state.config.instr}\n\n`;
  }
  ticket+=`Contacto: WA ${state.config.wa} • ${state.config.email}\n`;
  if(state.config.terms) ticket+=`\nTÉRMINOS: ${state.config.terms}\n`;
  if(promoAct) ticket+=`PROMO: ${promoAct.qr||promoAct.titulo} - Presenta QR\n`;
  document.getElementById('ticket').innerText=ticket;
  let qrData=`Folio:${state.folio}|Total:${total}|Cliente:${document.getElementById('nombreCliente').value}|WA:${state.config.wa}|Banco:${state.config.banco} ${state.config.clabe}|Promo:${promoAct?promoAct.titulo:'Ninguna'}`;
  let qrUrl=`https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(qrData)}`;
  let qrImg=document.getElementById('qrImg'); qrImg.src=qrUrl; qrImg.style.display=state.config.showQR?'block':'none';
  document.getElementById('qrInfo').innerHTML=state.config.showQR?`QR válido para promo<br><small>${qrData.slice(0,80)}...</small>`:'' ;
  renderPagos();
  saveAll();
  renderDash();
}
function renderPagos(){
  let p=state.config;
  document.getElementById('pagosPreviewFooter').innerHTML=`💳 <b>Pago:</b> ${p.banco} CLABE ${p.clabe.slice(0,4)}... Titular ${p.titular} • WA ${p.wa} • ${p.email}`;
  document.getElementById('pagosPreview').innerHTML=`<b>Preview Ticket:</b><br>Banco ${p.banco}<br>CLABE ${p.clabe}<br>Cuenta ${p.cuenta}<br>Titular ${p.titular}<br>Concepto ${p.concepto}<br>${p.terms||''}`;
  document.getElementById('footerEmail').innerText=p.email;
  document.getElementById('footerWA').innerText='WhatsApp '+p.wa;
  document.getElementById('footerBanco').innerText=`Transferencia: ${p.banco} CLABE ${p.clabe} - ${p.titular}`;
  document.getElementById('waNumBtn').innerText=p.wa;
}
function openGmaps(){ let d=document.getElementById('dir').value||'Chihuahua y Candela, Republica Pte, Saltillo'; window.open('https://www.google.com/maps/search/?api=1&query='+encodeURIComponent(d),'_blank'); }
function sendWA(){ let ticket=document.getElementById('ticket').innerText; let url=`https://wa.me/${state.config.wa}?text=${encodeURIComponent('Hola '+state.config.nombre+'! 🫔 Hoja Plátano\n'+ticket)}`; window.open(url,'_blank'); }
function sendEmail(){ let ticket=document.getElementById('ticket').innerText; let subject=`Comprobante ${state.folio} - ${state.config.nombre}`; window.open(`mailto:${state.config.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(ticket)}`,'_blank'); }
function copyBanco(){ let txt=`Banco: ${state.config.banco}\nCLABE: ${state.config.clabe}\nCuenta: ${state.config.cuenta}\nTitular: ${state.config.titular}\nConcepto: ${state.config.concepto} ${state.folio}\nTotal: ${document.getElementById('total').innerText}`; navigator.clipboard.writeText(txt).then(()=>alert('Datos bancarios copiados')); }
function openTicket(){ let ticket=document.getElementById('ticket').innerText; let qr=document.getElementById('qrImg').src; let w=window.open('','_blank','width=400,height=700'); w.document.write(`<html><head><meta charset=utf-8><title>${state.folio}</title><style>body{font-family:monospace;padding:20px;max-width:380px;margin:0 auto} img{width:100%} .header{text-align:center}</style></head><body><div class="header"><h3>${state.config.nombre}</h3><p>Folio: ${state.folio}</p></div><pre>${ticket}</pre><img src="${qr}"></body></html>`); w.document.close(); }

let taps=0,lastTap=0,holdTimer=null;
function initAdminTrigger(){
  let el=document.getElementById('footerJM');
  el.addEventListener('touchstart',()=>{handleTap(); holdTimer=setTimeout(()=>{if(taps>=3) openAdmin()},800)});
  el.addEventListener('touchend',()=>clearTimeout(holdTimer));
  el.addEventListener('mousedown',()=>{handleTap(); holdTimer=setTimeout(()=>{if(taps>=3) openAdmin()},800)});
  el.addEventListener('mouseup',()=>clearTimeout(holdTimer));
}
function handleTap(){ let now=Date.now(); if(now-lastTap<350){taps++}else{taps=1} lastTap=now; setTimeout(()=>{if(Date.now()-lastTap>1200)taps=0},1500); }
function openAdmin(){ let pw=prompt('Password admin:'); if(pw!=='1a2b3c4d'){alert('Incorrecto');taps=0;return;} document.getElementById('adminModal').classList.add('active'); taps=0; }
function closeAdmin(){ document.getElementById('adminModal').classList.remove('active'); }
function tab(name){
  document.querySelectorAll('[id^=pane-]').forEach(p=>p.style.display='none');
  document.getElementById('pane-'+name).style.display='block';
  document.querySelectorAll('.tab button').forEach(b=>b.classList.remove('active'));
  document.getElementById('tb-'+name).classList.add('active');
  if(name==='dash') renderDash();
  if(name==='promo') renderPromo();
  if(name==='inv') renderInv();
  if(name==='prod') renderProdAdmin();
}
function renderProdAdmin(){ let cont=document.getElementById('prodList'); cont.innerHTML=''; state.productos.forEach((p,i)=>{ cont.innerHTML+=`<div style="background:var(--bg);box-shadow:var(--shadow-in);border-radius:12px;padding:10px;margin-top:8px"><label>Nombre<input value="${p.nombre}" onchange="state.productos[${i}].nombre=this.value; saveAll(); renderMenu(); calc();"></label><label>Precio<input value="${p.precio}" type="number" onchange="state.productos[${i}].precio=parseFloat(this.value)||0; saveAll(); renderMenu(); calc();"></label><label>Emoji<input value="${p.emoji||''}" onchange="state.productos[${i}].emoji=this.value; saveAll(); renderMenu(); calc();"></label></div>`; }); }
function addProd(){ state.productos.push({id:'p'+Date.now(),nombre:'Nuevo Tamal Hoja Plátano',desc:'Descripción',precio:50,costo:20,stock:20,emoji:'🫔'}); saveAll(); renderProdAdmin(); renderMenu(); calc(); }
function applyVisualConfig(){ let c=state.config.colors||{}; let t=state.config.texts||{}; document.documentElement.style.setProperty('--terra',c.terra||'#D86A3A'); document.documentElement.style.setProperty('--azul',c.azul||'#1e3a5f'); document.documentElement.style.setProperty('--maiz',c.maiz||'#E8C36A'); }
function saveVisual(){ state.config.colors={terra:document.getElementById('cfgColorTerra').value,azul:document.getElementById('cfgColorAzul').value,maiz:document.getElementById('cfgColorMaiz').value}; state.config.texts={heroTitle:document.getElementById('cfgHeroTitle').value,heroSubtitle:document.getElementById('cfgHeroSubtitle').value,deliveryTitle:document.getElementById('cfgDeliveryTitle').value,extrasTitle:document.getElementById('cfgExtrasTitle').value}; applyVisualConfig(); saveAll(); }
function saveMarca(){ state.config.nombre=document.getElementById('cfgNombre').value||state.config.nombre; let urlC=document.getElementById('cfgLogoCuatesUrl').value; if(urlC) state.config.logoCuates=urlC; let urlJ=document.getElementById('cfgLogoJMUrl').value; if(urlJ) state.config.logoJM=urlJ; document.getElementById('nombreNegocio').innerText=state.config.nombre; if(state.config.logoCuates){ document.getElementById('headerLogo').src=state.config.logoCuates; document.getElementById('splashLogoCuates').src=state.config.logoCuates; document.getElementById('prevCuates').src=state.config.logoCuates; } if(state.config.logoJM){ document.getElementById('footerJM').src=state.config.logoJM; document.getElementById('splashLogoJM').src=state.config.logoJM; document.getElementById('prevJM').src=state.config.logoJM; } saveAll(); }
function toggleSchedule(){ let enabled=document.getElementById('tipoPedido').value==='programado'; document.getElementById('scheduleFields').hidden=!enabled; }
function validateSchedule(){ let input=document.getElementById('fechaPedido'); if(document.getElementById('tipoPedido').value!=='programado'){ state.pedidoProgramado=null; return true; } let value=input.value; if(!value){ return false; } let date=new Date(value); let max=new Date(Date.now()+60*24*60*60*1000); return date>new Date() && date<max; }
function saveTerms(){ state.config.terms=document.getElementById('cfgTerms').value; document.getElementById('termsPreview').innerText=state.config.terms; saveAll(); }
function savePagos(){ state.config.wa=document.getElementById('cfgWA').value||state.config.wa; state.config.email=document.getElementById('cfgEmail').value||state.config.email; state.config.banco=document.getElementById('cfgBanco').value; state.config.clabe=document.getElementById('cfgCLABE').value||state.config.clabe; state.config.cuenta=document.getElementById('cfgCuenta').value||state.config.cuenta; state.config.titular=document.getElementById('cfgTitular').value||state.config.titular; state.config.concepto=document.getElementById('cfgConcepto').value||state.config.concepto; state.config.instr=document.getElementById('cfgInstr').value||state.config.instr; state.config.showBanco=document.getElementById('cfgShowBanco').checked; state.config.showQR=document.getElementById('cfgShowQR').checked; saveAll(); renderPagos(); calc(); }
function addPromo(){ let t=document.getElementById('promoTitulo').value||'Promo'; let tipo=document.getElementById('promoTipo').value; let valor=parseFloat(document.getElementById('promoValor').value||0); let vig=document.getElementById('promoVig').value; let qr=document.getElementById('promoQR').value||t; state.promos.push({id:Date.now(),titulo:t,tipo,valor,vig,qr,activa:true}); saveAll(); renderPromo(); calc(); }
function renderPromo(){ let cont=document.getElementById('promoActivas'); if(!cont) return; cont.innerHTML=state.promos.map(p=>`<div style="background:var(--bg);box-shadow:var(--shadow-in);border-radius:12px;padding:10px;margin-top:8px;display:flex;justify-content:space-between"><span>${p.titulo} • ${p.tipo}</span><button onclick="togglePromo(${p.id})">${p.activa?'On':'Off'}</button></div>`).join(''); let activa=state.promos.find(p=>p.activa!==false); document.getElementById('promoBanner').style.display=activa?'block':'none'; if(activa) document.getElementById('promoBanner').innerText=activa.titulo+' • '+activa.qr; }
function togglePromo(id){ let p=state.promos.find(x=>x.id===id); if(p) p.activa=!p.activa; saveAll(); renderPromo(); calc(); }
function renderInv(){ let cont=document.getElementById('invList'); cont.innerHTML=''; state.insumos.forEach((ins,i)=>{ cont.innerHTML+=`<div style="background:var(--bg);box-shadow:var(--shadow-in);border-radius:12px;padding:10px;margin-top:8px;display:grid;grid-template-columns:1fr 60px 60px"><span><b>${ins.nombre}</b></span><input value="${ins.stock}" type="number" onchange="state.insumos[${i}].stock=parseInt(this.value)||0; saveAll(); renderInv(); renderDash();"></label><input value="${ins.min}" type="number" onchange="state.insumos[${i}].min=parseInt(this.value)||0; saveAll(); renderInv();"></div>`; }); }
function addInsumo(){ state.insumos.push({id:'ins'+Date.now(),nombre:'Nuevo insumo',stock:10,min:5,costo:10,prov:''}); saveAll(); renderInv(); }
function renderLotesSel(){ let sel=document.getElementById('loteTipo'); if(!sel) return; sel.innerHTML=state.productos.map(p=>`<option value="${p.id}">${p.nombre}</option>`).join(''); }
function crearLote(){ let tipo=document.getElementById('loteTipo').value; let cant=parseInt(document.getElementById('loteCant').value||0); if(!cant) return; let prod=state.productos.find(p=>p.id===tipo); state.lotes.push({id:Date.now(),tipo:prod.nombre,cant,inicio:Date.now(),fin:Date.now()+90*60000,estado:'vaporera'}); saveAll(); renderLotes(); }
function renderLotes(){ let cont=document.getElementById('lotesAct'); if(!cont) return; cont.innerHTML=state.lotes.map(l=>`<div style="background:var(--bg);box-shadow:var(--shadow-in);border-radius:12px;padding:10px;margin-top:8px"><b>${l.tipo} x${l.cant}</b> - ${Math.max(0,Math.floor((l.fin-Date.now())/60000))} min restantes</div>`).join(''); }
function renderClientes(){ let cont=document.getElementById('cliList'); if(!cont) return; let hist=JSON.parse(localStorage.getItem('cuates_hist_v8')||'[]'); let map={}; hist.forEach(h=>{ if(!map[h.cliente]) map[h.cliente]={nombre:h.cliente,pedidos:0,total:0}; map[h.cliente].pedidos++; map[h.cliente].total+=parseFloat(h.total||0); }); cont.innerHTML=Object.values(map).map(c=>`<div style="background:var(--bg);box-shadow:var(--shadow-in);border-radius:12px;padding:10px;margin-top:8px"><b>${c.nombre||'Sin nombre'}</b> - ${c.pedidos} pedidos • $${c.total}</div>`).join(''); }
function renderGastos(){ let cont=document.getElementById('gastosList'); if(!cont) return; cont.innerHTML=state.gastos.map((g,i)=>`<div style="display:flex;justify-content:space-between;background:var(--bg);box-shadow:var(--shadow-in);border-radius:12px;padding:8px;margin-top:6px"><span>${g.concept}</span><span>$${g.monto}</span></div>`).join(''); }
function addGasto(){ let c=document.getElementById('gastoConcept').value; let m=parseFloat(document.getElementById('gastoMonto').value||0); if(!c||!m) return; state.gastos.push({concept:c,monto:m,fecha:Date.now()}); saveAll(); renderGastos(); renderDash(); }
function corteCaja(){ let ventas=parseFloat(document.getElementById('k-ventas').innerText.replace('$',''))||0; let gastos=state.gastos.reduce((a,b)=>a+b.monto,0); let utilidad=ventas-gastos; let cortes=JSON.parse(localStorage.getItem('cuates_cortes')||'[]'); cortes.unshift({fecha:new Date().toISOString(),ventas,gastos,utilidad}); localStorage.setItem('cuates_cortes',JSON.stringify(cortes)); alert(`Corte cerrado: Ventas $${ventas} - Gastos $${gastos} = Utilidad $${utilidad}`); document.getElementById('corteHist').innerHTML=cortes.slice(0,5).map(c=>`${new Date(c.fecha).toLocaleDateString()} Ventas $${c.ventas} Gastos $${c.gastos} Util $${c.utilidad}`).join('<br>'); }
function renderDash(){ let hist=JSON.parse(localStorage.getItem('cuates_hist_v8')||'[]'); let hoy=new Date().toDateString(); let ventasHoy=hist.filter(h=>new Date(h.fecha).toDateString()===hoy).reduce((a,b)=>a+parseFloat(b.total||0),0); let tamHoy=hist.filter(h=>new Date(h.fecha).toDateString()===hoy).reduce((a,b)=>{ let sum=0; for(let k in b.items){ if(state.productos.find(p=>p.id===k)) sum+=b.items[k]; } return a+sum; },0); let ticketProm=hist.length? (hist.reduce((a,b)=>a+parseFloat(b.total||0),0)/hist.length):0; let gastos=state.gastos.reduce((a,b)=>a+b.monto,0); document.getElementById('k-ventas').innerText='$'+ventasHoy.toFixed(0); document.getElementById('k-tam').innerText=tamHoy; document.getElementById('k-ticket').innerText='$'+ticketProm.toFixed(0); document.getElementById('k-gan').innerText='$'+(ventasHoy-gastos).toFixed(0); document.getElementById('pedidosList').innerText=JSON.stringify(hist.slice(0,10),null,2); }

loadAll(); hydrateNeon(); calc(); initAdminTrigger(); setInterval(renderLotes,60000);

setTimeout(()=>{
  try{
    let m=L.map('map').setView([25.438,-100.983],13);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(m);
    let icon=L.divIcon({html:'<div style="font-size:32px">🫔</div>',iconSize:[40,40],className:''});
    let marker=L.marker([25.438,-100.983],{icon}).addTo(m).bindPopup('Base Los Cuates');
    m.on('click',e=>{ marker.setLatLng(e.latlng); let d=m.distance([25.438,-100.983],e.latlng)/1000; document.getElementById('km').value=d.toFixed(1); calcKm(); });
  }catch(e){}
},800);
</script>
<script src="./firebase-logo.js"></script>
</body>
</html>
