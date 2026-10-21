# Los Cuates V8 100% - Tamales Hoja Plátano - Gestión Completa

## Nuevas funciones V8
- Logo real Los Cuates en encabezado y splash (subido por ti)
- Logo real JM en splash y pie de página - entrada admin tocando logo JM 3x rápido + largo 800ms (pass 1a2b3c4d)
- Módulo Pagos y Contacto 100% editable desde admin: WhatsApp, Email, Banco, CLABE, Cuenta, Titular, Concepto, Instrucciones
- Ticket membretado con QR para promociones y datos bancarios
- Promociones con QR auto-generado (3x2, 2x1, % descuento, producto gratis)
- Cambio de nombres de productos, logos encabezado/pie desde admin (upload)
- Inventario hoja plátano real: calcula cuántos tamales puedes hacer
- Lotes y cocción con temporizador 90min vaporera
- Dashboard, clientes, gastos, corte caja
- Firebase integrado: pega tu firebaseConfig en tab Firebase para guardar pedidos reales en Firestore
- Estilo Neumorfismo mexicano contemporáneo 3D suave con colores terracota, verde plátano, maíz, azul talavera

## Como subir a GitHub
1. Copia index.html a tu repo Los-CuatesApp (reemplaza todo)
2. Settings > Pages > Source: GitHub Actions
3. Espera 2 min

## Firebase - Para que pedidos se guarden de verdad
1. Ve a console.firebase.google.com > Crear proyecto "los-cuates"
2. Firestore Database > Crear > Modo producción > Región us-central
3. Project Settings > General > Your apps > Web app > Copia config JSON
4. En tu app > Admin (toca logo JM 3x+largo) > Tab Firebase > Pega JSON > Conectar
5. Prueba: Botón Probar Guardado

Pedidos se guardan en colección "pedidos" con folio, total, cliente, dirección, estado, pagos, QR

## Datos bancarios editables
Admin > Pagos/Contacto > Edita Banco, CLABE, Titular, etc. Se reflejan instantáneo en ticket, footer y QR

## Admin
Toca logo JM en pie de página 3 veces rápido + mantén 800ms > pass 1a2b3c4d
