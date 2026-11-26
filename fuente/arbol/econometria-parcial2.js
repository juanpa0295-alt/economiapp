// Econometría I · árbol de fórmulas del parcial 2 (hoja «Fórmulas para el segundo parcial» del profesor)
// Nodos, glosario, hoja y escenas 3D. Los números de las escenas salen de datos simulados con semilla fija.
AF.iniciar(function(AFX){
const {L,PL,Q,Pt,T,Ar,box,rgba,lerp,ease,A_,ch,fm,fp,esc,C,V,lsq,inv,cdf,pdf,qnt,rnd,rn}=AFX;
/* ---------- datos de ejemplo para las escenas ---------- */
const PT=[];
for(let i=0;i<16;i++){const x2=rnd()*10,x3=rnd()*10;PT.push({x2,x3,y:3+0.9*x2+0.4*x3+1.2*rn(),p:1})}
for(let i=0;i<12;i++){const x2=rnd()*10,x3=rnd()*10;PT.push({x2,x3,y:4.4+0.7*x2+0.62*x3+1.2*rn(),p:2})}
const P1=PT.filter(p=>p.p===1),P2=PT.filter(p=>p.p===2),P2f=P2.slice(0,4),N=PT.length;
const row=p=>[1,p.x2,p.x3],Y=a=>a.map(p=>p.y);
const F1=lsq(P1.map(row),Y(P1)),F2=lsq(P2.map(row),Y(P2)),FP=lsq(PT.map(row),Y(PT)),FC=lsq([...P1,...P2f].map(row),Y([...P1,...P2f]));
const FI=lsq(PT.map(p=>[p.p===1?1:0,p.p===2?1:0,p.x2,p.x3]),Y(PT));
const FS=lsq(PT.map(p=>[1,p.p===1?p.x2:0,p.p===1?p.x3:0,p.p===2?p.x2:0,p.p===2?p.x3:0]),Y(PT));
const RNR=F1.rss+F2.rss,n1=P1.length;
const STAT={
 chow:{t:'F',d1:4,d2:n1-3,x:((FC.rss-F1.rss)/4)/(F1.rss/(n1-3)),lab:'F pronóstico'},
 cambio:{t:'F',d1:3,d2:N-6,x:((FP.rss-RNR)/3)/(RNR/(N-6)),lab:'F Chow'},
 inter:{t:'F',d1:1,d2:N-4,x:(FP.rss-FI.rss)/(FI.rss/(N-4)),lab:'F intercepto'},
 pend:{t:'F',d1:2,d2:N-5,x:((FP.rss-FS.rss)/2)/(FS.rss/(N-5)),lab:'F pendientes'}};
const xr=FP.rss/RNR;
STAT.W={t:'chi',d1:3,x:N*(xr-1),lab:'W'};STAT.LR={t:'chi',d1:3,x:N*Math.log(xr),lab:'LR'};STAT.LM={t:'chi',d1:3,x:N*(1-1/xr),lab:'LM'};
for(const s of Object.values(STAT)){s.p=1-cdf(s.t,s.x,s.d1,s.d2);s.c=qnt(s.t,.95,s.d1,s.d2)}
/* datos MV */
const MD=[];for(let i=0;i<9;i++){const x=0.6+i*1.1+rnd()*.5;MD.push({x,y:1.5+0.85*x+1.1*rn()})}
const FM=lsq(MD.map(p=>[1,p.x]),MD.map(p=>p.y)),s2MV=FM.rss/MD.length;
const ymd=MD.map(p=>p.y),yMin=Math.min(...ymd)-2,yMax=Math.max(...ymd)+2;


/* ---------- contenido: árbol, nodos, glosario ---------- */
const S=(t,f,sc,k,c,p)=>({t,f,sc,k,c,p});
const pv=(key,gl)=>{const st=STAT[key];return[
 S('Dibuja la distribución de la estadística bajo H₀ con sus grados de libertad: '+gl+'.','', 'fd',0,'Curva de la distribución bajo H₀ (datos de ejemplo de las escenas).',st),
 S('Busca el valor crítico al nivel α = 5 %: el punto que deja 5 % de área a la derecha.','','fd',1,'Línea del valor crítico; la cola sombreada es la región de rechazo.',st),
 S('Ubica tu estadística calculada. El área a su derecha es el p-valor.','p-valor = P[distribución > estadística]','fd',2,'Marcador naranja en la estadística; área morada = p-valor.',st),
 S('Decide: si estadística > crítico (equivalente: p-valor < α) rechazas H₀; si no, no la rechazas.','','fd',3,'Veredicto con los números de ejemplo.',st)]};
const NODES={
A1:{t:'Modelo lineal en matrices',f:`y = Xβ + μ,   μ ~ N(0, σ²I)\ny: n×1   X: n×k   β: k×1`,
 que:'Cada observación Y_t es una combinación lineal de las columnas de X más un error. k cuenta el intercepto (la columna de unos).',
 uso:'Es la base de todo el parcial: cada prueba compara dos versiones de este modelo, una restringida y otra no restringida.',
 ctx:'Cuando el enunciado diga «modelo restringido» o «no restringido», piensa siempre en este mismo y = Xβ + μ con más o menos columnas, o con β obligados a ser iguales.',
 st:[S('Escribe una fila por observación.','Y_t = β₁ + β₂X₂t + … + β_kX_kt + μ_t','ols',0,'Los ejes son las observaciones 1, 2 y 3: con n = 3, cada variable es una flecha en el espacio.'),
  S('Apila las n filas: el vector y (n×1) y la matriz X (n×k), cuya primera columna son unos.','','ols',1,'Aparecen las columnas de X como flechas: x₁ (unos) y x₂.'),
  S('Xβ es una combinación de columnas.','Xβ = β₁x₁ + β₂x₂','ols',2,'Todas las combinaciones posibles forman el plano gris: el espacio columna de X.'),
  S('y casi nunca cae sobre ese plano por culpa de μ.','','ols',3,'La flecha y sale del plano.')]},
A2:{t:'Estimador MCO b',f:`b = (X'X)⁻¹X'y`,
 que:'b es el vector de coeficientes que hace más corta la distancia entre y y el plano de X.',
 uso:'Toda RSS del parcial (RSS_R, RSS_NR, RSS₁, RSS₂) sale de correr MCO sobre algún conjunto de datos.',
 ctx:'En R: lm(y ~ x2 + x3); coef() da b y deviance() da la RSS.',
 st:[S('Define el residuo para un b cualquiera.',`e(b) = y − Xb`,'ols',3,'Cualquier punto del plano es un Xb candidato; e(b) es la flecha que va de ese punto hasta y.'),
  S('Suma de cuadrados de esos residuos.',`S(b) = e'e = (y − Xb)'(y − Xb)`,'ols',3,'S(b) es la longitud al cuadrado de esa flecha.'),
  S('Expande el producto (b\'X\'y es un escalar, igual a y\'Xb).',`S(b) = y'y − 2b'X'y + b'X'Xb`,'ols',3,'Mover b es deslizar el punto Xb sobre el plano.'),
  S('Deriva respecto a b e iguala a cero.',`∂S/∂b = −2X'y + 2X'Xb = 0`,'ols',4,'El mínimo está donde la flecha baja en ángulo recto.'),
  S('Ecuaciones normales: el residuo es perpendicular a cada columna de X.',`X'Xb = X'y   ⇔   X'(y − Xb) = 0   ⇔   X'e = 0`,'ols',4,'X\'e = 0 significa e ⟂ x₁ y e ⟂ x₂: perpendicular al plano.'),
  S('Despeja b (si X\'X es invertible). El ajuste es la proyección de y.',`b = (X'X)⁻¹X'y\nŷ = Xb = Py,   P = X(X'X)⁻¹X'`,'ols',4,'ŷ es la sombra de y sobre el plano.')]},
A3:{t:'Residuos, RSS y σ^²',f:`e = y − Xb = My,   M = I − X(X'X)⁻¹X'\nRSS = e'e = Σ e_t²\nσ^² = RSS/(n − k)`,
 que:'RSS es lo que el modelo no logra explicar. Es la pieza que comparan todas las pruebas F.',
 uso:'Numeradores y denominadores de las F del parcial son RSS divididas por sus grados de libertad.',
 ctx:'Grados de libertad de una RSS = n − (número de coeficientes estimados en esa regresión).',
 st:[S('Residuo como lo que queda fuera del plano.',`e = y − ŷ = (I − P)y = My`,'ols',5,'e es la flecha perpendicular desde ŷ hasta y (marca de ángulo recto).'),
  S('RSS es la suma de los residuos al cuadrado.',`RSS = e'e`,'ols',6,'RSS es el área del cuadrado construido sobre e.'),
  S('Pitágoras, porque ŷ ⟂ e.',`y'y = ŷ'ŷ + e'e`,'ols',6,'Triángulo rectángulo entre y, ŷ y e.'),
  S('e vive en un espacio de dimensión n − k: por eso σ^² = RSS/(n − k) es insesgado y RSS/σ² ~ χ²(n − k).','','ols',6,'Con n = 3 y k = 2 queda 1 dimensión libre para e: la recta normal al plano.')]},
B1:{t:'Paso 1: estimar con la submuestra 1',f:`y₁ = X₁β + μ₁,   t = 1, …, n₁\nb₁ = (X₁'X₁)⁻¹X₁'y₁\nRSS₁ = e₁'e₁`,
 que:'Se estima el modelo solo con el primer periodo. b₁ es la regla aprendida antes del posible cambio.',
 uso:'Prueba de pronósticos de Chow: se usa cuando el segundo periodo tiene pocas observaciones (típicamente n₂ < k) y no se puede estimar una regresión solo con él.',
 ctx:'Pregunta típica: «¿el modelo estimado hasta 2019 predice bien 2020–2021?». Pocas observaciones nuevas ⇒ pronósticos de Chow.',
 st:[S('Separa la muestra: filas 1…n₁ forman (X₁, y₁); filas n₁+1…n forman (X₂, y₂).','','chow',0,'Solo se ven los puntos azules del periodo 1 en el espacio (X₂, X₃, Y).'),
  S('Calcula X₁\'X₁ (k×k) y X₁\'y₁ (k×1), invierte y multiplica.',`b₁ = (X₁'X₁)⁻¹X₁'y₁`,'chow',1,'Se ajusta el plano azul a esos puntos.'),
  S('Residuos y RSS₁, con n₁ − k grados de libertad.',`e₁ = y₁ − X₁b₁,   RSS₁ = e₁'e₁`,'chow',1,'Los palitos verticales azules son e₁; RSS₁ es la suma de sus cuadrados.')]},
B2:{t:'Paso 2: predecir y₂ con b₁',f:`ŷ₂ = X₂b₁`,
 que:'Lo que diría el modelo viejo para los datos nuevos, sin mirar y₂.',uso:'Insumo del vector de errores de predicción d.',ctx:'ŷ₂ es n₂×1: una predicción por observación nueva.',
 st:[S('Toma las filas X₂ del periodo 2.','','chow',2,'Aparecen los puntos naranjas reales del periodo 2.'),
  S('Multiplica por b₁.',`ŷ₂ = X₂b₁   (n₂×1)`,'chow',3,'Círculos huecos naranjas sobre el plano azul: la predicción de cada punto nuevo.')]},
B3:{t:'Paso 3: errores de predicción d',f:`d = y₂ − ŷ₂ = y₂ − X₂b₁`,
 que:'d mide cuánto falla el modelo viejo en el periodo nuevo.',uso:'Si no hay cambio, d debería ser ruido con media cero.',ctx:'Ojo: d no son residuos MCO; b₁ nunca vio y₂.',
 st:[S('Resta observado menos predicho.',`d = y₂ − X₂b₁`,'chow',4,'Palitos naranjas entre cada punto real y su predicción.'),
  S('Sustituye y₂ = X₂β + μ₂.',`d = X₂β + μ₂ − X₂b₁ = μ₂ − X₂(b₁ − β)`,'chow',4,'Cada palito tiene dos fuentes: ruido nuevo (μ₂) y error del plano (b₁ − β).'),
  S('Bajo H₀ (mismo β en los dos periodos): E[d] = 0, porque E[μ₂] = 0 y E[b₁] = β.','','chow',4,'Sin cambio, los palitos se reparten arriba y abajo sin patrón.')]},
B4:{t:'F de pronóstico (forma con d)',f:`       d'[ I + X₂(X₁'X₁)⁻¹X₂' ]⁻¹ d / n₂\nF = ───────────────────────────────── ~ F(n₂, n₁ − k)\n             e₁'e₁ / (n₁ − k)`,
 que:'Mide los errores de predicción en unidades de su propia varianza y los compara con el ruido del periodo 1.',
 uso:'Contraste formal de estabilidad cuando solo hay unas pocas observaciones nuevas.',ctx:'Grados de libertad: (n₂, n₁ − k). Es el error más común del parcial confundirlos con (k, n − 2k).',
 st:[S('Varianza de b₁.',`b₁ − β = (X₁'X₁)⁻¹X₁'μ₁   ⇒   Var(b₁) = σ²(X₁'X₁)⁻¹`,'chow',1,'El plano azul tiene incertidumbre: podría inclinarse un poco distinto.'),
  S('μ₂ es independiente de μ₁, así que no hay covarianza entre μ₂ y b₁.',`Cov(μ₂, b₁) = 0`,'chow',4,''),
  S('Suma las dos varianzas.',`Var(d) = Var(μ₂) + X₂Var(b₁)X₂' = σ²[ I + X₂(X₁'X₁)⁻¹X₂' ]`,'chow',5,'Envoltura alrededor del plano: el «I» es el ancho base (ruido nuevo); X₂(X₁\'X₁)⁻¹X₂\' la ensancha lejos del centro de los datos azules.'),
  S('Con normalidad, la forma cuadrática estandarizada es χ².',`d ~ N(0, σ²[I + X₂(X₁'X₁)⁻¹X₂'])\nd'[…]⁻¹d / σ² ~ χ²(n₂)`,'chow',5,'Medir los palitos naranjas en «unidades de envoltura».'),
  S('El ruido del periodo 1 también es χ², independiente de d.',`RSS₁/σ² ~ χ²(n₁ − k)`,'chow',1,''),
  S('Divide cada χ² por sus grados de libertad y haz el cociente: σ² se cancela.',`F = [χ²(n₂)/n₂] / [χ²(n₁−k)/(n₁−k)] ~ F(n₂, n₁ − k)`,'chow',5,'Si los palitos se salen mucho de la envoltura, F es grande.')]},
B5:{t:'F de pronóstico (forma con RSS)',f:`     (RSS − RSS₁) / n₂\nF = ────────────────── ~ F(n₂, n₁ − k)\n     RSS₁ / (n₁ − k)\nRSS: regresión con las n = n₁ + n₂ observaciones`,
 que:'Cuánto empeora el ajuste al obligar al plano a pasar también por los datos nuevos, por cada dato nuevo.',
 uso:'Es la forma que más sale en el parcial: te dan RSS y RSS₁.',ctx:'RSS − RSS₁ ≥ 0 siempre: agregar datos nunca baja la suma de cuadrados.',
 st:[S('Corre la regresión con todas las observaciones.','→ RSS','chow',6,'Aparece el plano gris ajustado a azules y naranjas.'),
  S('Resultado clave que conecta las dos formas.',`RSS − RSS₁ = d'[ I + X₂(X₁'X₁)⁻¹X₂' ]⁻¹ d`,'chow',6,'Barras: RSS (todas) frente a RSS₁; la diferencia es lo que cuestan los n₂ puntos nuevos.'),
  S('Numerador: aumento de RSS por observación nueva. Denominador: σ^² del periodo 1.','','chow',6,''),
  S('Reemplaza los números y compara con F(n₂, n₁ − k).','','chow',6,'La lectura muestra el F con los datos de la escena.')]},
B6:{t:'p-valor y decisión (pronósticos)',f:`p-valor = P[ F(n₂, n₁ − k) > F_c ]\nRechaza H₀ (estabilidad) si F_c > F_tabla(α)  ⇔  p-valor < α`,
 que:'Probabilidad de ver un F tan grande o mayor si el modelo fuera estable.',uso:'Cierra la prueba.',ctx:'En R: pf(Fc, n2, n1-k, lower.tail = FALSE).',st:pv('chow','F(n₂, n₁ − k)')},
C1:{t:'Modelo restringido (sin cambio)',f:`Y_t = β₁ + β₂X₂t + … + β_kX_kt + μ_t,   t = 1, …, n\n→ RSS_R   (n − k gl)`,
 que:'Una sola regresión con todos los datos: obliga a que los β sean iguales en los dos periodos.',uso:'Es el modelo «bajo H₀» de todas las pruebas de cambio estructural.',ctx:'También llamado pooled. En R: lm(y ~ x2 + x3, data = todo).',
 st:[S('Junta los dos periodos.','','cambio',0,'Todos los puntos grises: no distinguimos periodos.'),
  S('Corre MCO y guarda RSS_R.','','cambio',1,'Un solo plano gris con los palitos de residuo: RSS_R.'),
  S('Es «restringido» porque impone β′ = β″.','','cambio',1,'Un plano para dos nubes que quizá quieren planos distintos.')]},
C2:{t:'Modelo no restringido (k* = 2k)',f:`Periodo 1: Y_t = β₁′ + β₂′X₂t + … + β_k′X_kt + μ_t,   t = 1, …, n₁\nPeriodo 2: Y_t = β₁″ + β₂″X₂t + … + β_k″X_kt + μ_t,   t = n₁+1, …, n\nk* = 2k`,
 que:'Cada periodo tiene su propio juego de coeficientes.',uso:'Es el modelo libre contra el que se compara la pooled.',ctx:'β′ = periodo 1, β″ = periodo 2.',
 st:[S('Permite un juego de β por periodo.','','cambio',2,'Los puntos se colorean: azul periodo 1, naranja periodo 2.'),
  S('Cuenta parámetros.',`k* = k + k = 2k`,'cambio',2,'Dos planos, cada uno con k coeficientes.')]},
C3:{t:'Forma matricial y MCO por bloques',f:`y = X_NR β_NR + μ\nX_NR = [ X₁  0 ;  0  X₂ ],   β_NR = [ β′ ; β″ ]\nb_NR = [ b₁ ; b₂ ] = [ (X₁'X₁)⁻¹X₁'y₁ ; (X₂'X₂)⁻¹X₂'y₂ ]`,
 que:'Estimar el modelo no restringido de una vez es lo mismo que correr dos regresiones separadas.',uso:'Justifica que RSS_NR = RSS₁ + RSS₂.',ctx:'Los «;» separan filas de bloques.',
 st:[S('Apila: arriba las filas del periodo 1 con X₁ en las primeras k columnas y ceros en las otras k; abajo al revés.','','cambio',2,''),
  S('Los ceros matan los productos cruzados: X\'X es bloque diagonal.',`X_NR'X_NR = [ X₁'X₁  0 ;  0  X₂'X₂ ]`,'cambio',3,''),
  S('La inversa de una bloque diagonal es bloque diagonal.',`(X_NR'X_NR)⁻¹ = [ (X₁'X₁)⁻¹  0 ;  0  (X₂'X₂)⁻¹ ]`,'cambio',3,''),
  S('Multiplica por X_NR\'y = [X₁\'y₁ ; X₂\'y₂]: b_NR se separa en b₁ y b₂.','','cambio',4,'Plano azul ajustado solo a azules; plano naranja solo a naranjas.')]},
C4:{t:'RSS_NR = RSS₁ + RSS₂',f:`RSS_NR = RSS₁ + RSS₂    (n − 2k gl)`,
 que:'La suma de cuadrados del modelo libre es la suma de las dos regresiones separadas.',uso:'En el parcial casi siempre te dan RSS₁ y RSS₂ por separado: súmalas.',ctx:'Se extiende a 3 o más periodos: RSS_NR = RSS₁ + RSS₂ + RSS₃, con n − 3k gl.',
 st:[S('Los residuos del modelo libre se separan por bloques.',`e_NR = [ y₁ − X₁b₁ ; y₂ − X₂b₂ ] = [ e₁ ; e₂ ]`,'cambio',3,'Plano azul con sus palitos: RSS₁.'),
  S('Mismo razonamiento para el periodo 2.','','cambio',4,'Plano naranja con sus palitos: RSS₂.'),
  S('El producto interno de un vector apilado es la suma de los productos.',`e_NR'e_NR = e₁'e₁ + e₂'e₂   ⇒   RSS_NR = RSS₁ + RSS₂`,'cambio',5,'Barras: RSS_R frente a RSS₁ + RSS₂ apiladas.')]},
C5:{t:'H₀ de no cambio y la matriz R',f:`H₀: β′ = β″   ⇔   Rβ_NR = r\nR = [ I_k   −I_k ]  (k × 2k),   r = 0,   q = k`,
 que:'Escribe «los dos planos son iguales» como un sistema de restricciones lineales.',uso:'R y q alimentan la F en forma de Wald y las pruebas LR, W, LM.',ctx:'q = número de filas de R = número de restricciones.',
 st:[S('Componente a componente.',`β_j′ − β_j″ = 0,   j = 1, …, k   ⇒ k ecuaciones`,'dummy',3,'Diferencia entre el plano azul y el naranja.'),
  S('En matriz.',`[ I_k  −I_k ] [ β′ ; β″ ] = β′ − β″ = 0`,'dummy',3,''),
  S('Cada fila de R es una restricción.',`q = k`,'dummy',4,'Si todas se cumplen, los dos planos colapsan en uno.')]},
C6:{t:'F de cambio estructural (forma Wald)',f:`     (Rb_NR − r)'[ R(X_NR'X_NR)⁻¹R' ]⁻¹(Rb_NR − r) / k\nF = ──────────────────────────────────────────── ~ F(k, n − 2k)\n                 RSS_NR / (n − 2k)`,
 que:'Distancia entre b₁ y b₂ medida en unidades de su varianza.',uso:'Forma general de la F para cualquier Rβ = r.',ctx:'k* = 2k en el denominador.',
 st:[S('El vector que se contrasta es la diferencia de estimaciones.',`Rb_NR − r = b₁ − b₂`,'trin',4,'Distancia horizontal en el piso entre el estimador libre y la restricción.'),
  S('Su varianza.',`Var(Rb_NR) = σ² R(X_NR'X_NR)⁻¹R'`,'trin',4,'Las elipses del piso dicen cuánto «pesa» cada dirección.'),
  S('Forma cuadrática estandarizada.',`(Rb − r)'[σ²R(X'X)⁻¹R']⁻¹(Rb − r) ~ χ²(k)`,'trin',4,''),
  S('Sustituye σ² por σ^² = RSS_NR/(n − 2k) y divide por k.','~ F(k, n − 2k)','trin',4,'')]},
C7:{t:'F con la diferencia b₁ − b₂',f:`     (b₁ − b₂)'[ (X₁'X₁)⁻¹ + (X₂'X₂)⁻¹ ]⁻¹(b₁ − b₂) / k\nF = ─────────────────────────────────────────── ~ F(k, n − 2k)\n                 RSS_NR / (n − 2k)`,
 que:'La misma F de C6 con R ya multiplicada.',uso:'Útil si te dan b₁, b₂ y las (X_i\'X_i)⁻¹.',ctx:'(X₁\'X₁)⁻¹ + (X₂\'X₂)⁻¹: las varianzas se suman porque los periodos son independientes.',
 st:[S('Multiplica R por la inversa bloque diagonal.',`R(X'X)⁻¹R' = [I −I][A₁ 0 ; 0 A₂][I ; −I] = A₁ + A₂,   A_i = (X_i'X_i)⁻¹`,'dummy',1,''),
  S('Rb_NR es la diferencia de coeficientes.',`Rb_NR = b₁ − b₂`,'dummy',2,'b₂ − b₁ es lo que mueve el plano azul hasta el naranja.'),
  S('Sustituye ambas piezas en C6.','','dummy',3,'El plano llega al naranja: esa es toda la diferencia que mide F.')]},
C8:{t:'F de Chow con RSS (la del parcial)',f:`     (RSS_R − RSS_NR) / k\nF = ───────────────────── ~ F(k, n − 2k)\n      RSS_NR / (n − 2k)`,
 que:'Cuánto sube la RSS por restricción al obligar un solo plano, comparado con el ruido del modelo libre.',uso:'Es la versión que se calcula a mano con las RSS que da el enunciado.',ctx:'Receta: RSS_R de la pooled, RSS_NR = RSS₁ + RSS₂, q = k, gl = (k, n − 2k).',
 st:[S('Identidad para restricciones lineales.',`RSS_R − RSS_NR = (Rb − r)'[R(X'X)⁻¹R']⁻¹(Rb − r)`,'cambio',5,'La franja entre las barras es RSS_R − RSS_NR.'),
  S('Numerador: aumento de RSS por cada restricción.',`(RSS_R − RSS_NR)/k`,'cambio',5,''),
  S('Denominador: σ^² del modelo libre.',`RSS_NR/(n − 2k)`,'cambio',4,''),
  S('Sustituye y compara con F(k, n − 2k).','','cambio',6,'La lectura muestra la F con los datos de la escena.')]},
C9:{t:'p-valor (Chow clásico)',f:`p-valor = P[ F(k, n − 2k) > F_c ]`,que:'Probabilidad de una F tan grande bajo «no hay cambio».',uso:'Cierra la prueba de Chow.',ctx:'En R: pf(Fc, k, n-2*k, lower.tail = FALSE).',st:pv('cambio','F(k, n − 2k)')},
D1:{t:'Definir la dicótoma D_t',f:`D_t = 0   si t = 1, …, n₁\nD_t = 1   si t = n₁+1, …, n`,
 que:'Una columna que «enciende» el periodo 2.',uso:'Permite hacer Chow en una sola regresión.',ctx:'También se multiplica D por cada regresor (interacciones).',
 st:[S('Crea la columna D: 0 en el periodo 1 y 1 en el periodo 2.','','dummy',0,'Plano azul base: lo que vale cuando D = 0.'),
  S('Multiplica D por cada regresor.',`D_tX₂t, D_tX₃t, …, D_tX_kt`,'dummy',0,'')]},
D2:{t:'Modelo NR con interacciones',f:`Y_t = β₁ + δ₁D_t + β₂X₂t + δ₂D_tX₂t + … + β_kX_kt + δ_kD_tX_kt + μ_t\nk* = 2k   →   RSS_NR_Dum`,
 que:'Periodo 1: coeficientes β. Periodo 2: β + δ. Cada δ es el cambio de un coeficiente.',uso:'Misma información que el Chow clásico, en una sola regresión.',ctx:'En la hoja del profe los coeficientes de D llevan otra letra; aquí se llaman δ.',
 st:[S('Periodo 1 (D = 0).',`Y = β₁ + β₂X₂ + … + β_kX_k   ⇒   β′ = β`,'dummy',0,'Plano azul.'),
  S('Periodo 2 (D = 1): agrupa términos.',`Y = (β₁ + δ₁) + (β₂ + δ₂)X₂ + …   ⇒   β″ = β + δ`,'dummy',1,'δ₁ levanta el plano (cambio de intercepto).'),
  S('El δ de X₂ cambia la inclinación en esa dirección.','','dummy',2,'δ₂ inclina el plano en X₂.'),
  S('El δ de X₃ completa el cambio.','','dummy',3,'δ₃ inclina en X₃: llegamos al plano naranja.'),
  S('Mismo ajuste que dos regresiones separadas, otra parametrización.',`RSS_NR_Dum = RSS₁ + RSS₂ = RSS_NR`,'dummy',3,'')]},
D3:{t:'H₀: todos los δ = 0',f:`H₀: δ₁ = δ₂ = … = δ_k = 0   vs   H_a: algún δ_j ≠ 0\nq = k`,
 que:'Sin cambio estructural, encender D no cambia nada.',uso:'Es una prueba F conjunta sobre los coeficientes de D y sus interacciones.',ctx:'En R: linearHypothesis(mNR, c("D=0","D:x2=0","D:x3=0")).',
 st:[S('Cada δ = 0 es una restricción.','q = k','dummy',4,'Si todos los δ son cero, el plano naranja cae sobre el azul: queda uno solo.')]},
D4:{t:'Modelo restringido (dummies)',f:`Y_t = β₁ + β₂X₂t + … + β_kX_kt + μ_t   →   RSS_R`,
 que:'Quitar D y sus interacciones deja la pooled.',uso:'Su RSS es el RSS_R de la F.',ctx:'Es el mismo modelo restringido del Chow clásico.',
 st:[S('Elimina D y todos los D·X.','','dummy',4,'Los dos planos se funden en el plano pooled.'),S('Corre MCO con todas las observaciones.','','cambio',1,'Plano gris único y sus residuos: RSS_R.')]},
D5:{t:'F con dummies',f:`     (RSS_R − RSS_NR_Dum) / k\nF = ───────────────────────── ~ F(k, n − 2k)\n       RSS_NR_Dum / (n − 2k)`,
 que:'Idéntica a la F de Chow clásico.',uso:'Cuando la salida de R trae el modelo con dicótomas.',ctx:'anova(mR, mNR) en R da esta F directamente.',
 st:[S('Lee RSS_R y RSS_NR_Dum.','','cambio',5,'Las mismas barras que en Chow clásico.'),S('q = k; gl del denominador n − k* = n − 2k.','',null),S('Calcula y compara.','','cambio',6,'F con los datos de ejemplo.')]},
D6:{t:'p-valor (dummies)',f:`p-valor = P[ F(k, n − 2k) > F_c ]`,que:'Igual que en Chow clásico.',uso:'Cierra la prueba con dicótomas.',ctx:'Mismos gl que C9.',st:pv('cambio','F(k, n − 2k)')},
E0:{t:'Variables por periodo',f:`D₁t = 1 en el periodo 1 (0 en el 2);   D₂t = 1 en el periodo 2 (0 en el 1);   D₁t + D₂t = 1\nX_j1t = X_jt en el periodo 1 (0 en el 2);   X_j2t = X_jt en el periodo 2 (0 en el 1)\nX_j1t + X_j2t = X_jt\nY_t = β₁′D₁t + β₂′X₂₁t + … + β_k′X_k1t + β₁″D₂t + β₂″X₂₂t + … + β_k″X_k2t + μ_t`,
 que:'Reescribe el modelo libre con columnas que solo «viven» en un periodo.',uso:'Base para probar por separado intercepto o pendientes.',ctx:'Sin constante común: D₁ y D₂ son los dos interceptos (si pones constante y las dos D, caes en la trampa de las dicótomas).',
 st:[S('Dos dicótomas complementarias.',`D₁t + D₂t = 1`,'cambio',2,'Cada color es un periodo.'),
  S('Parte cada regresor en su versión de periodo 1 y de periodo 2.',`X_j1t + X_j2t = X_jt`,'cambio',3,''),
  S('El modelo con todo libre tiene 2k parámetros (igual al Chow clásico).','','cambio',4,'Dos planos completamente libres.')]},
E1:{t:'Solo intercepto: modelo NR (k* = k + 1)',f:`Y_t = β₁′D₁t + β₁″D₂t + β₂X₂t + … + β_kX_kt + μ_t\nk* = k + 1   →   RSS_NR_Intercepto`,
 que:'Las pendientes son comunes; solo la altura cambia entre periodos.',uso:'Probar si el cambio fue solo un salto de nivel.',ctx:'Pendientes comunes ⇒ planos paralelos.',
 st:[S('Supón pendientes comunes.',`β_j′ = β_j″ = β_j,   j = 2, …, k`,'inter',0,'Puntos coloreados por periodo.'),
  S('Agrupa usando X_j1t + X_j2t = X_jt.',`β_jX_j1t + β_jX_j2t = β_j(X_j1t + X_j2t) = β_jX_jt`,'inter',1,''),
  S('Cuenta: 2 interceptos + (k − 1) pendientes.',`k* = 2 + (k − 1) = k + 1`,'inter',1,'Dos planos paralelos: misma inclinación, distinta altura.')]},
E2:{t:'Solo intercepto: H₀ y F',f:`H₀: β₁′ = β₁″   vs   H_a: β₁′ ≠ β₁″,   q = 1\n     (RSS_R − RSS_NR_Inter) / 1\nF = ─────────────────────────── ~ F(1, n − k − 1)\n     RSS_NR_Inter / (n − k − 1)`,
 que:'¿El salto de nivel es significativo?',uso:'Después de saber que hay cambio, para saber de qué tipo.',ctx:'Con q = 1, F = t² del coeficiente de D en Y = β₁ + γD + β₂X₂ + … (γ = β₁″ − β₁′).',
 st:[S('Una sola restricción.','q = 1','inter',1,'La flecha vertical entre los planos es β₁″ − β₁′.'),
  S('Bajo H₀ un solo intercepto: vuelve la pooled.','→ RSS_R','inter',2,'Los planos paralelos se funden.'),
  S('Grados de libertad del denominador.',`n − k* = n − (k + 1)`,'inter',2,''),
  ...pv('inter','F(1, n − k − 1)')]},
E3:{t:'Solo pendientes: modelo NR (k* = 2k − 1)',f:`Y_t = β₁ + β₂′X₂₁t + … + β_k′X_k1t + β₂″X₂₂t + … + β_k″X_k2t + μ_t\nk* = 2(k − 1) + 1 = 2k − 1   →   RSS_NR_Pendiente`,
 que:'Intercepto común; las pendientes cambian.',uso:'Probar si cambió la respuesta de Y a los regresores.',ctx:'Planos que comparten el punto en X = 0 y giran.',
 st:[S('Intercepto común; como D₁ + D₂ = 1, la suma es la constante.',`β₁D₁t + β₁D₂t = β₁(D₁t + D₂t) = β₁`,'pend',0,'Puntos por periodo.'),
  S('Cada X_j entra partido en X_j1 y X_j2.','','pend',1,''),
  S('Cuenta parámetros.',`1 + 2(k − 1) = 2k − 1`,'pend',1,'Dos planos que parten del mismo punto en X₂ = X₃ = 0 (alfiler) con inclinaciones distintas.')]},
E4:{t:'Solo pendientes: H₀ y F',f:`H₀: β_j′ = β_j″,   j = 2, …, k,   q = k − 1\n     (RSS_R − RSS_NR_Pend) / (k − 1)\nF = ──────────────────────────────── ~ F(k − 1, n − 2k + 1)\n      RSS_NR_Pend / (n − 2k + 1)`,
 que:'¿Las pendientes difieren entre periodos?',uso:'Distinguir cambio de pendientes de cambio de nivel.',ctx:'gl denominador: n − (2k − 1) = n − 2k + 1.',
 st:[S('Cada pendiente igualada es una restricción.','q = k − 1','pend',1,''),
  S('Bajo H₀ vuelve la ecuación original con todas las observaciones.',`β_jX_j1t + β_jX_j2t = β_jX_jt   ⇒   RSS_R`,'pend',2,'Los planos giran sobre el alfiler hasta coincidir.'),
  S('Grados de libertad del denominador.',`n − k* = n − 2k + 1`,'pend',2,''),
  ...pv('pend','F(k − 1, n − 2k + 1)')]},
F1:{t:'Función de verosimilitud',f:`L(θ; y) = f(y₁; θ) · f(y₂; θ) · … · f(y_n; θ) = Π f(y_i; θ)`,
 que:'Con los datos fijos, L dice qué tan probable era observar esa muestra si el parámetro fuera θ.',uso:'Punto de partida de MV y de LR, W y LM.',ctx:'Producto porque las observaciones son independientes.',
 st:[S('Densidad normal de cada observación.',`f(y_t; θ) = (2πσ²)^(−1/2) · exp[ −(y_t − x_t'β)² / (2σ²) ],   θ = (β, σ²)`,'mld',0,'Puntos en el piso: (x, y) de cada observación.'),
  S('f(y_t; θ) es la altura de la campana justo en el y_t observado.','','mld',1,'Sobre cada x_t se levanta una campana centrada en la recta candidata; la barra naranja es f(y_t).'),
  S('L multiplica todas esas alturas.',`L = f(y₁) · f(y₂) · … · f(y_n)`,'mld',2,'La lectura muestra L (producto) y l (suma de logaritmos).')]},
F2:{t:'Log-verosimilitud',f:`l(θ) = ln L = Σ ln f(y_i; θ)\nNormal: l(β, σ²) = −(n/2)ln(2π) − (n/2)ln σ² − (y − Xβ)'(y − Xβ) / (2σ²)`,
 que:'El logaritmo convierte el producto en suma y no mueve el máximo.',uso:'Se maximiza l en lugar de L.',ctx:'El último término es −RSS(β)/(2σ²): maximizar l en β es minimizar la RSS.',
 st:[S('ln de un producto es la suma de los ln.',`ln(a·b·c) = ln a + ln b + ln c`,'mld',2,''),
  S('ln es creciente: el máximo de l está en el mismo θ que el de L.','','mld',2,''),
  S('Sustituye la normal y suma n veces.',`ln f(y_t) = −½ln(2π) − ½ln σ² − (y_t − x_t'β)² / (2σ²)`,'mld',3,'Al llevar la recta al ajuste MCO las barras crecen y l sube.')]},
F3:{t:'Score y condiciones de primer orden',f:`s(θ; y) = ∂l/∂θ = [ ∂l/∂θ₁, …, ∂l/∂θ_k ]'\nMLE:  s(θ^) = 0\n∂l/∂β = X'(y − Xβ)/σ² = 0   ⇒   β^ = (X'X)⁻¹X'y = b\n∂l/∂σ² = −n/(2σ²) + RSS/(2σ⁴) = 0   ⇒   σ^² = RSS/n`,
 que:'El score es el gradiente de l: indica hacia dónde sube la colina. En el máximo vale cero.',uso:'Resolver s(θ) = 0 da el MLE; evaluarlo en el modelo restringido da la prueba LM.',ctx:'σ^²_MV = RSS/n es sesgado (MCO usa n − k).',
 st:[S('El score es el gradiente.','','mls',1,'Flecha verde sobre la colina apuntando cuesta arriba.'),
  S('Deriva respecto a β el término −(y − Xβ)\'(y − Xβ)/(2σ²).',`∂l/∂β = X'(y − Xβ)/σ² = 0   ⇒   X'Xβ = X'y   ⇒   β^ = b`,'mls',2,'En la cima el gradiente es cero: plano tangente horizontal.'),
  S('Deriva respecto a σ² e iguala a cero; multiplica por 2σ⁴.',`−n/(2σ²) + RSS/(2σ⁴) = 0   ⇒   −nσ² + RSS = 0   ⇒   σ^² = RSS/n`,'mld',4,'Las campanas se ajustan al ancho σ^.'),
  S('Sustituye en l.',`l_max = −(n/2)ln(2π) − (n/2)ln(RSS/n) − n/2   ⇒   L_max = kte · RSS^(−n/2)`,'mld',4,'Máximo valor de l con los datos de ejemplo.')]},
F4:{t:'Matriz Hessiana',f:`H(θ) = ∂²l/∂θ∂θ'   (k×k),   H_ij = ∂²l/∂θ_i∂θ_j\nNormal: ∂²l/∂β∂β' = −X'X/σ²\n        ∂²l/∂(σ²)² = n/(2σ⁴) − RSS/σ⁶\n        ∂²l/∂β∂σ² = −X'μ/σ⁴`,
 que:'Curvatura de la colina: qué tan rápido baja l al alejarse del máximo.',uso:'Su esperanza (con signo menos) es la información.',ctx:'En el máximo H es definida negativa: colina, no silla.',
 st:[S('Deriva cada componente del score respecto a cada parámetro.','','mls',3,''),
  S('Diagonal: curvatura en cada dirección; fuera de la diagonal: cómo se tuercen juntas.','','mls',3,'Cortes de la colina en las direcciones β₁ y β₂: parábolas resaltadas.'),
  S('En el máximo, H definida negativa.','','mls',3,'Ambos cortes abren hacia abajo.')]},
F5:{t:'Matriz de información',f:`I(θ) = −E[ ∂²l/∂θ∂θ' ] = E[ (∂l/∂θ)(∂l/∂θ)' ]\nNormal: I(β, σ²) = [ X'X/σ²   0 ;  0   n/(2σ⁴) ]`,
 que:'Cuánta información traen los datos sobre θ: colina más puntiaguda ⇒ más información.',uso:'Su inversa es la varianza asintótica del MLE; aparece en Wald y LM.',ctx:'Igualdad de la información: Var(s) = E[ss\'] = −E[H].',
 st:[S('Toma −E[H]. El bloque cruzado se anula porque E[X\'μ] = 0.','','mls',3,''),
  S('Para σ²: E[RSS] evaluada en el β verdadero es nσ².',`−E[ n/(2σ⁴) − nσ²/σ⁶ ] = n/(2σ⁴)`,'mls',3,''),
  S('Más datos ⇒ colina más afilada ⇒ más información.','','mls',4,'La colina se afila y la elipse del piso se encoge.')]},
F6:{t:'Normalidad asintótica',f:`θ^ ~a N( θ, I(θ)⁻¹ )\nNormal: Var(b) = σ²(X'X)⁻¹,   Var(σ^²) = 2σ⁴/n`,
 que:'En muestras grandes el MLE es normal, centrado en el verdadero θ, con varianza I⁻¹.',uso:'Base de los errores estándar y de las pruebas asintóticas.',ctx:'I bloque diagonal ⇒ inviertes cada bloque por separado.',
 st:[S('Invierte I bloque a bloque.',`[X'X/σ²]⁻¹ = σ²(X'X)⁻¹,   [n/(2σ⁴)]⁻¹ = 2σ⁴/n`,'mls',4,''),
  S('La elipse bajo la cima es la región de confianza: su tamaño es I⁻¹.','','mls',4,'Elipse morada en el piso.')]},
F7:{t:'Propiedades del MLE',f:`Consistencia:  θ^ →p θ\nEficiencia asintótica:  Var(θ~) − Var(θ^_MV) es semidefinida positiva\nInvarianza:  el MLE de g(θ) es g(θ^)\nScore:  E[s] = 0,   Var(s) = E[ss'] = I(θ)`,
 que:'Por qué se confía en MV: converge, es el más eficiente entre los consistentes y asintóticamente normales, y respeta transformaciones.',uso:'Preguntas teóricas del parcial.',ctx:'Ejemplo de invarianza: el MLE de σ es √σ^².',
 st:[S('Consistencia: con n creciente, la cima se acerca al θ verdadero.','','mls',4,''),
  S('Eficiencia: ningún otro estimador consistente y asintóticamente normal tiene una elipse más pequeña.','','mls',4,''),
  S('Score con media cero: en promedio, la pendiente en el θ verdadero es plana.','E[∂l/∂θ] = 0','mls',2,'Tangente horizontal en la cima.')]},
G1:{t:'L máxima no restringida',f:`σ^²_NR = RSS_NR / n\nL_MNR = (2πσ^²_NR)^(−n/2) · e^(−n/2) = kte · RSS_NR^(−n/2)`,
 que:'El valor más alto que alcanza la verosimilitud sin restricciones.',uso:'Denominador de λ.',ctx:'H₀: Rβ = r (q restricciones lineales).',
 st:[S('Evalúa l en (b, σ^²_NR): el término de la RSS queda n/2.',`RSS_NR / (2·RSS_NR/n) = n/2`,'trin',0,'Cima de la colina: θ^ (punto naranja).'),
  S('Agrupa lo que no depende de los datos.',`l_MNR = kte − (n/2)ln RSS_NR`,'trin',0,''),
  S('La kte solo depende de n.',`kte = (2π/n)^(−n/2) e^(−n/2)`,'trin',0,'')]},
G2:{t:'L máxima restringida',f:`Max l sujeto a Rβ = r   ⇒   β^_R = b_R,   σ^²_R = RSS_R / n\nL_MR = kte · RSS_R^(−n/2)`,
 que:'Lo más alto que se puede llegar caminando solo sobre la restricción.',uso:'Numerador de λ.',ctx:'Misma kte que G1 porque n es igual.',
 st:[S('La restricción es una recta en el espacio de parámetros.','Rβ = r','trin',1,'Recta en el piso y la cortina vertical: solo vale moverse sobre ella.'),
  S('Maximiza l sobre la cortina.','','trin',2,'El punto más alto de la cortina es θ~ (punto morado).'),
  S('Mismo cálculo que G1 con RSS_R.',`l_MR = kte − (n/2)ln RSS_R`,'trin',2,'')]},
G3:{t:'Razón de verosimilitud λ',f:`λ = L_MR / L_MNR = ( RSS_R / RSS_NR )^(−n/2)\n0 < λ ≤ 1`,
 que:'Qué fracción de la verosimilitud se pierde al imponer H₀.',uso:'Base de la prueba LR.',ctx:'λ cerca de 1 ⇒ la restricción casi no cuesta.',
 st:[S('Divide G2 entre G1: la kte se cancela.',`[kte · RSS_R^(−n/2)] / [kte · RSS_NR^(−n/2)]`,'trin',3,''),
  S('Como RSS_R ≥ RSS_NR, λ ≤ 1.','','trin',3,'La cima restringida nunca supera la cima libre.')]},
G4:{t:'Prueba LR',f:`LR = −2 ln λ = 2( l_MNR − l_MR )\n   = n ln( RSS_R / RSS_NR )  ~a χ²(q)\nRechaza H₀ si LR > χ²_q(α)`,
 que:'Compara alturas: cuánto baja l al imponer la restricción.',uso:'Necesita estimar los dos modelos.',ctx:'Ecuaciones (17) y (18) de la hoja.',
 st:[S('Aplica −2 ln a λ.',`−2 · (−n/2) · ln(RSS_R/RSS_NR) = n ln(RSS_R/RSS_NR)`,'trin',3,'Segmento vertical rojo: caída de altura entre la cima libre y la restringida (LR = 2 × caída).'),
  S('Necesita los dos modelos.','','trin',3,''),...pv('LR','χ²(q)')]},
G5:{t:'Prueba de Wald',f:`W = (Rb − r)'[ R(X'X)⁻¹R' ]⁻¹(Rb − r) / σ^²_NR\n  = n( RSS_R − RSS_NR ) / RSS_NR  ~a χ²(q)\nσ^²_NR = RSS_NR / n`,
 que:'Mide cuánto incumple el estimador libre la restricción.',uso:'Solo necesita el modelo no restringido.',ctx:'Relación con F: W = n·q·F / (n − k).',
 st:[S('Incumplimiento de la restricción.',`Rb − r`,'trin',4,'En el piso, segmento desde θ^ hasta la recta; las elipses dicen cuánto pesa cada dirección.'),
  S('Estandariza con su varianza.',`Var(Rb) = σ^²_NR R(X'X)⁻¹R'`,'trin',4,''),
  S('El numerador es RSS_R − RSS_NR (identidad de C8); divide por RSS_NR/n.',`W = (RSS_R − RSS_NR) / (RSS_NR/n)`,'trin',4,''),
  S('Despeja la relación con F.',`(RSS_R − RSS_NR)/RSS_NR = qF/(n − k)   ⇒   W = nqF/(n − k)`,'trin',4,''),
  ...pv('W','χ²(q)')]},
G6:{t:'Prueba LM (score)',f:`LM = s(θ~)' I(θ~)⁻¹ s(θ~)\n   = n · e_r'X(X'X)⁻¹X'e_r / e_r'e_r\n   = n( RSS_R − RSS_NR ) / RSS_R\n   = n·R²_aux  ~a χ²(q)\nAuxiliar: e_r = Xβ + μ   (X del modelo NR)`,
 que:'Mide qué tan empinada está la colina en el punto restringido.',uso:'Solo necesita el modelo restringido y una regresión auxiliar.',ctx:'Receta: estima el restringido, guarda e_r, regresa e_r sobre todas las X, LM = n·R².',
 st:[S('Evalúa el score en el estimador restringido.',`s_β = X'e_r / σ^²_R`,'trin',5,'Flecha verde en θ~: pendiente de la colina; si es empinada, H₀ es mala.'),
  S('Usa la información en ese punto.',`I_ββ = X'X/σ^²_R   ⇒   s'I⁻¹s = e_r'X(X'X)⁻¹X'e_r / σ^²_R`,'trin',5,''),
  S('e_r\'X(X\'X)⁻¹X\'e_r es la suma de cuadrados explicada al regresar e_r sobre X; vale RSS_R − RSS_NR.','','trin',5,''),
  S('Sustituye σ^²_R = RSS_R/n.',`LM = n(RSS_R − RSS_NR)/RSS_R`,'trin',5,''),
  S('e_r tiene media 0 (hay intercepto) ⇒ SCT = e_r\'e_r.',`R²_aux = (RSS_R − RSS_NR)/RSS_R   ⇒   LM = n·R²_aux`,'trin',5,''),
  ...pv('LM','χ²(q)')]},
G7:{t:'W ≥ LR ≥ LM y decisión',f:`Sea x = RSS_R / RSS_NR ≥ 1:\nW = n(x − 1)     LR = n ln x     LM = n(1 − 1/x)\nx − 1 ≥ ln x ≥ 1 − 1/x   ⇒   W ≥ LR ≥ LM\np-valor = P[ χ²_q > estadística ]`,
 que:'Las tres miden lo mismo desde puntos distintos y siempre quedan en este orden en el modelo lineal.',uso:'Pregunta típica: ordenar o explicar por qué pueden discrepar.',ctx:'Puede pasar que W rechace y LM no: por eso se reportan las tres.',
 st:[S('Las tres a la vez: horizontal (W), vertical (LR), pendiente (LM).','','trin',6,'Las tres medidas dibujadas juntas.'),
  S('Desigualdad de logaritmos para x > 0.',`1 − 1/x ≤ ln x ≤ x − 1`,'trin',6,''),
  S('Multiplica por n.',`LM ≤ LR ≤ W`,'trin',6,'La lectura muestra los tres valores de ejemplo.')]}
};
const TREE=[
 {id:'fA',t:'1 · Base: MCO',c:['A1','A2','A3']},
 {id:'fB',t:'2 · Pronósticos de Chow',c:['B1','B2','B3','B4','B5','B6']},
 {id:'fC',t:'3 · Cambio estructural',c:[
  {id:'fC1',t:'3.1 Chow clásico',c:['C1','C2','C3','C4','C5','C6','C7','C8','C9']},
  {id:'fC2',t:'3.2 Con variables dummy',c:['D1','D2','D3','D4','D5','D6']},
  {id:'fC3',t:'3.3 Solo intercepto',c:['E0','E1','E2']},
  {id:'fC4',t:'3.4 Solo pendientes',c:['E3','E4']}]},
 {id:'fF',t:'4 · Máxima verosimilitud',c:['F1','F2','F3','F4','F5','F6','F7']},
 {id:'fG',t:'5 · LR, Wald y LM',c:['G1','G2','G3','G4','G5','G6','G7']}];

const GL=[
 ['rss','RSS (suma de cuadrados de los residuos)',['rss','scr',"e'e",'sumadecuadrados'],"Suma de los residuos al cuadrado e'e = Σe_t². Todas las F del parcial comparan dos RSS.",['A3','C8','B5']],
 ['rssr','RSS_R (modelo restringido)',['rssr'],'RSS de la regresión que impone H₀; en cambio estructural es la pooled con todas las observaciones. Siempre RSS_R ≥ RSS_NR.',['C1','C8','D4','G2']],
 ['rssnr','RSS_NR (modelo no restringido)',['rssnr'],'RSS del modelo que permite el cambio. En Chow clásico RSS_NR = RSS₁ + RSS₂, con n − 2k gl.',['C4','C8','G1']],
 ['rss12','RSS₁ y RSS₂',['rss1','rss2'],'RSS de las regresiones separadas con el periodo 1 y con el periodo 2.',['B1','C4']],
 ['rssd','RSS_NR_Dum',['rssnrdum','nrdum'],'RSS del modelo con D y sus interacciones (k* = 2k). Igual a RSS₁ + RSS₂.',['D2','D5']],
 ['rssi','RSS_NR_Intercepto',['rssnrintercepto','rssnrinter','nrintercepto','nrinter'],'RSS del modelo con dos interceptos y pendientes comunes (k* = k + 1).',['E1','E2']],
 ['rssp','RSS_NR_Pendiente',['rssnrpendiente','rssnrpend','nrpend','nrpendiente'],'RSS del modelo con intercepto común y pendientes por periodo (k* = 2k − 1).',['E3','E4']],
 ['k','k',['k'],'Número de coeficientes del modelo original, contando el intercepto β₁.',['A1','C2','C8']],
 ['ks','k*',['k*'],'Coeficientes del modelo no restringido: 2k (Chow y dummies), k + 1 (solo intercepto), 2k − 1 (solo pendientes). gl del denominador = n − k*.',['C2','E1','E3']],
 ['q','q',['q'],'Número de restricciones de H₀ (filas de R): gl del numerador de F y gl de la χ².',['C5','E2','E4','G4']],
 ['n','n, n₁, n₂',['n','n1','n2','n=n1+n2'],'n₁: observaciones del periodo 1; n₂: del periodo 2; n = n₁ + n₂.',['B1','C2']],
 ['b1','b₁',['b1','b2'],"Estimadores MCO por submuestra: b_i = (X_i'X_i)⁻¹X_i'y_i.",['B1','C3','C7']],
 ['d','d (errores de predicción)',['d','y2-x2b1'],'d = y₂ − X₂b₁: fallas del modelo viejo en los datos nuevos.',['B3','B4']],
 ['X','X (matriz de datos)',['x',"x'x","(x'x)-1",'x1','x2'],'Matriz n×k de regresores; su espacio columna es el plano donde vive Xb.',['A1','A2']],
 ['beta','β (coeficientes)',['β','beta',"β'",'β"','βnr'],"Parámetros poblacionales. β′ periodo 1, β″ periodo 2, β_NR = [β′ ; β″].",['A1','C2','C5']],
 ['mu','μ (perturbación)',['μ','mu'],'Error del modelo, normal con media 0 y varianza σ².',['A1','B3']],
 ['D','D_t (dicótoma)',['dt','dummy','dicotoma','d1t','d2t','dummies'],'Variable 0/1 que identifica el periodo.',['D1','D2','E0']],
 ['delta','δ (coeficientes de las interacciones)',['δ','delta'],'Cambio de cada coeficiente entre periodos: β″ = β + δ.',['D2','D3']],
 ['F','Estadística F',['f','fc','estadisticaf','pruebaf'],'Cociente de dos χ² divididas por sus gl. Grande ⇒ la restricción cuesta mucho.',['C8','B5','D5']],
 ['pv','p-valor',['p-valor','pvalor','p–valor','pvalue'],'Probabilidad, bajo H₀, de una estadística igual o más extrema que la observada.',['C9','B6','G4']],
 ['R','R y r (restricciones)',['r','rβ=r','rb-r','[ik-ik]','rβnr'],'H₀: Rβ = r. Cada fila de R es una restricción lineal.',['C5','C6','G5']],
 ['L','L (verosimilitud)',['l(θ;y)','verosimilitud','lmnr','lmr','likelihood'],'L(θ; y) = Π f(y_i; θ): probabilidad de la muestra como función de θ.',['F1','G1','G2']],
 ['l','l = ln L',['lnl','logverosimilitud','l=lnl','lmnr','lmr'],'Log-verosimilitud: suma de los ln f(y_i; θ).',['F2','G4']],
 ['th','θ y θ^',['θ','θ^','theta','θmv','θmle'],'θ: vector de parámetros. θ^: el que maximiza l (MLE).',['F1','F3','F6']],
 ['sc','Score s(θ; y)',['score','s(θ;y)','s(θ)','∂l/∂θ','funcionscore'],'Gradiente de l. Vale 0 en el MLE; en el modelo restringido alimenta LM.',['F3','G6']],
 ['H','Hessiana H(θ)',['hessiana','h(θ)','matrizhessiana'],'Matriz de segundas derivadas de l: curvatura de la colina.',['F4']],
 ['I','Información I(θ)',['i(θ)','informacion','matrizdeinformacion','i(θ)-1'],"I(θ) = −E[H] = E[ss']. Su inversa es la varianza asintótica del MLE.",['F5','F6']],
 ['sg','σ² y σ^²',['σ2','σ^2','sigma','σ^2mle','σ^2nr','σ^2r'],'σ^²_MCO = RSS/(n − k) (insesgado). σ^²_MV = RSS/n (el que usan LR, W y LM).',['A3','F3','G1']],
 ['er','e_r (residuos restringidos)',['er',"e'r","er'er"],'Residuos MCO del modelo restringido; se regresan sobre X para la LM.',['G6']],
 ['r2','R²_aux',['r2aux','raux','r2'],'R² de regresar e_r sobre la X del modelo no restringido. LM = n·R²_aux.',['G6']],
 ['chi','χ²',['χ2','chi','chi2','chicuadrado','ji'],'Distribución asintótica de LR, W y LM, con q gl.',['G4','G5','G6']],
 ['lam','λ (razón de verosimilitud)',['λ','lambda','razondeverosimilitud'],'λ = L_MR / L_MNR ∈ (0, 1].',['G3','G4']],
 ['LR','LR',['lr','razondeverosimilitud'],'LR = n ln(RSS_R/RSS_NR): caída de altura de la colina.',['G4','G7']],
 ['W','Wald',['w','wald','pruebadewald'],'W = n(RSS_R − RSS_NR)/RSS_NR: distancia del estimador libre a la restricción.',['G5','G7']],
 ['LM','LM',['lm','multiplicadoresdelagrange','lagrange','pruebalm'],'LM = n(RSS_R − RSS_NR)/RSS_R = nR²_aux: pendiente en el punto restringido.',['G6','G7']],
 ['pool','Pooled / todas las observaciones',['pooled','todaslasobservaciones','modelorestringido'],'Regresión única con los dos periodos: el modelo bajo H₀.',['C1','D4']],
 ['nr','Modelo no restringido',['modelonorestringido','norestringido'],'El que permite cambio: 2k, k + 1 o 2k − 1 parámetros según la prueba.',['C2','E1','E3']],
 ['ce','Cambio estructural',['cambioestructural'],'Los coeficientes no son los mismos en todos los periodos.',['C1','C8']],
 ['ch','Prueba de Chow',['chow','pronosticos','pronosticosdechow'],'Chow clásico (C8) si hay datos suficientes en ambos periodos; pronósticos (B5) si n₂ es pequeño.',['B5','C8']],
 ['mle','MLE / MV',['mle','mv','maximaverosimilitud','emv','maximoverosimil'],'Estimador que maximiza l. En el modelo normal: β^ = b y σ^² = RSS/n.',['F2','F3']],
 ['pr','Propiedades del MLE',['consistencia','eficiencia','invarianza','normalidadasintotica','eficienciaasintotica','semidefinidapositiva'],'Consistencia, normalidad asintótica, eficiencia asintótica e invarianza.',['F6','F7']],
 ['kte','kte',['kte'],'Constante que solo depende de n: (2π/n)^(−n/2)e^(−n/2). Se cancela en λ.',['G1','G3']]];
const CS={k:'k',q:'q',d:'d',D:'D',F:'F',R:'R',r:'R',L:'L',l:'l',H:'H',W:'W',X:'X',n:'n',I:'I'};

const DOC=[['h','Base común: MCO (repaso)'],['p','No está en la hoja, pero todas las fórmulas lo suponen.','A1'],['n','A1'],['n','A2'],['n','A3'],
 ['h','Prueba de pronósticos de Chow'],['p','La prueba se desarrolla como sigue. 1. Estimar el modelo con la primera submuestra; X_i, y_i con i = 1, 2 indican las submuestras. El RSS de esta regresión lo denotamos RSS₁.','B1'],['n','B1'],
 ['p','2. Usando b₁ se obtiene una predicción de y₂.','B2'],['n','B2'],['p','3. Obtenga el vector de errores de predicción.','B3'],['n','B3'],
 ['p','La estadística de la prueba de pronósticos de Chow es:','B4'],['n','B4'],['p','La estadística F también se puede escribir con RSS, la suma de cuadrados de los errores de la regresión con todas las observaciones:','B5'],['n','B5'],['p','El p-valor para la prueba es:','B6'],['n','B6'],
 ['h','Pruebas de cambio estructural'],['p','El modelo inicial, sin cambio estructural, es el modelo restringido: no admite cambio en los coeficientes β en los dos periodos. De esta regresión se obtiene RSS_R.','C1'],['n','C1'],
 ['p','El modelo no restringido admite cambio en todos los coeficientes; se estiman k* = 2k coeficientes.','C2'],['n','C2'],['p','Forma matricial y estimador OLS del modelo no restringido:','C3'],['n','C3'],
 ['p','Para este modelo se verifica la suma de RSS; RSS₁ es el RSS con el primer grupo de observaciones y RSS₂ con el segundo. El resultado se extiende de forma natural a tres o más periodos.','C4'],['n','C4'],
 ['p','La hipótesis nula es que no hay cambio estructural; β es el vector común a los dos periodos y hay q = k restricciones sobre β_NR.','C5'],['n','C5'],
 ['p','La estadística de prueba (k* = 2k):','C6'],['n','C6'],['p','La F también se obtiene con las diferencias de coeficientes:','C7'],['n','C7'],['p','… o con las sumas de cuadrados:','C8'],['n','C8'],['p','El valor p para la prueba:','C9'],['n','C9'],
 ['h','Cambio estructural con variables dummy'],['p','Definimos una variable dummy para diferenciar entre las muestras:','D1'],['n','D1'],
 ['p','Con esta variable estimamos el modelo no restringido; se estiman k* = 2k coeficientes y su RSS se denota RSS_NR_Dum.','D2'],['n','D2'],
 ['p','La hipótesis de que no hay cambio estructural tiene q = k restricciones:','D3'],['n','D3'],['p','Bajo H₀ el modelo restringido es el usual; su RSS es RSS_R.','D4'],['n','D4'],['p','La estadística de prueba y el valor p:','D5'],['n','D5'],['n','D6'],
 ['h','Pruebas para los coeficientes de la pendiente'],['p','El modelo no restringido se puede escribir con dos dicótomas y cada regresor partido por periodo:','E0'],['n','E0'],
 ['s','Cambios solo en el intercepto (pendientes comunes)'],['p','Se asume β_j′ = β_j″ y, como X_j1t + X_j2t = X_jt, el modelo no restringido estima k* = k + 1 parámetros; su RSS es RSS_NR_Intercepto.','E1'],['n','E1'],
 ['p','Hipótesis, modelo restringido (el usual con todas las observaciones), q = 1 y k* = k + 1:','E2'],['n','E2'],
 ['s','Cambios en los coeficientes de la pendiente (interceptos comunes)'],['p','Se asume β₁′ = β₁″ y, como D₁t + D₂t = 1, se estiman k* = 2k − 1 coeficientes; su RSS es RSS_NR_Pendiente.','E3'],['n','E3'],
 ['p','Hay q = k − 1 restricciones; bajo H₀ el modelo restringido es la ecuación original con todas las observaciones.','E4'],['n','E4'],
 ['h','Estimación máximo verosímil'],['p','La función de verosimilitud muestral se define como:','F1'],['n','F1'],['p','El MLE es el vector θ^ que maximiza L(θ; y); en la práctica se maximiza ln L.','F2'],['n','F2'],
 ['p','El MLE se obtiene al resolver ∂l/∂θ = 0; ese vector se conoce como la función score.','F3'],['n','F3'],['p','La matriz de segundas derivadas se conoce como matriz Hessiana.','F4'],['n','F4'],
 ['p','La matriz de información:','F5'],['n','F5'],['p','Normalidad asintótica: I(θ)⁻¹ es la inversa de la matriz de información y representa la varianza asintótica del MLE.','F6'],['n','F6'],
 ['p','Propiedades: consistencia, eficiencia asintótica, invarianza; el score tiene media cero y varianza I(θ).','F7'],['n','F7'],
 ['h','Pruebas LR, Wald y LM'],['p','Pruebas asintóticas para q restricciones lineales H₀: Rβ = r frente a H_a: Rβ ≠ r. En el modelo lineal normal, el máximo de la verosimilitud del modelo no restringido es:','G1'],['n','G1'],
 ['p','Al estimar por MLE con la restricción Rβ = r:','G2'],['n','G2'],['p','La razón de verosimilitud:','G3'],['n','G3'],['p','Prueba de razón de verosimilitud, ecuaciones (17) y (18):','G4'],['n','G4'],
 ['p','Prueba de Wald, ecuaciones (19) y (20):','G5'],['n','G5'],['p','Prueba LM; R²_aux es el coeficiente de determinación de regresar los residuos restringidos e_r sobre la X del modelo no restringido:','G6'],['n','G6'],
 ['p','Comparación de las tres (agregado de estudio, no está en la hoja):','G7'],['n','G7']];

/* mapa de datos de regresión */
const ys=PT.map(p=>p.y),YM=(Math.min(...ys)+Math.max(...ys))/2,YS=(Math.max(...ys)-Math.min(...ys))/2*1.15;
const Wd=(x2,x3,y)=>[(x2-5)/5,(x3-5)/5,(y-YM)/YS];
const prd=(b,x2,x3)=>b[0]+b[1]*x2+b[2]*x3;
function plane(fn,col,al,lab){const n=6;for(let i=0;i<n;i++)for(let j=0;j<n;j++){const a=i*10/n,b=j*10/n,c=(i+1)*10/n,d=(j+1)*10/n;Q([Wd(a,b,fn(a,b)),Wd(c,b,fn(c,b)),Wd(c,d,fn(c,d)),Wd(a,d,fn(a,d))],col,al,col,al*1.8)}if(lab)T(Wd(10,10,fn(10,10)),lab,col,Math.min(1,al*5),{b:1,dx:8,al:'left'})}
function sticks(pts,fn,col,al,w=2){pts.forEach(p=>L(Wd(p.x2,p.x3,p.y),Wd(p.x2,p.x3,fn(p.x2,p.x3)),col,w,al))}
const dots=(pts,col,al,r=4.5)=>pts.forEach(p=>Pt(Wd(p.x2,p.x3,p.y),col,r,al));
const bfn=b=>(x2,x3)=>prd(b,x2,x3);



const SC={};
SC.ols=(k,a)=>{const al=A_(k,a),O=[-.75,-.75,-.85],add=(p,v,s=1)=>[p[0]+v[0]*s,p[1]+v[1]*s,p[2]+v[2]*s];
 const c1=[.75,.75,.75],c2=[1.35,.15,.35],y=[.9,1.5,.2];
 const A11=c1.reduce((s,x)=>s+x*x,0),A12=c1.reduce((s,x,i)=>s+x*c2[i],0),A22=c2.reduce((s,x)=>s+x*x,0),v1=c1.reduce((s,x,i)=>s+x*y[i],0),v2=c2.reduce((s,x,i)=>s+x*y[i],0),det=A11*A22-A12*A12,b1=(A22*v1-A12*v2)/det,b2=(A11*v2-A12*v1)/det;
 const yh=[0,1,2].map(i=>b1*c1[i]+b2*c2[i]),e=[0,1,2].map(i=>y[i]-yh[i]);
 const g=C.grid;L(O,add(O,[2,0,0]),C.soft,1.4);L(O,add(O,[0,2,0]),C.soft,1.4);L(O,add(O,[0,0,2.1]),C.soft,1.4);T(add(O,[2.12,0,0]),'obs. 1',C.soft);T(add(O,[0,2.12,0]),'obs. 2',C.soft);T(add(O,[0,0,2.22]),'obs. 3',C.soft);
 if(k>=1){Ar(O,add(O,c1),C.blue,3,al(1));Ar(O,add(O,c2),C.blue,3,al(1));T(add(O,c1,1.08),'x₁ (unos)',C.blue,al(1),{b:1});T(add(O,c2,1.1),'x₂',C.blue,al(1),{b:1})}
 if(k>=2){const n=5;for(let i=0;i<n;i++)for(let j=0;j<n;j++){const u0=-.25+i*1.6/n,v0=-.25+j*1.6/n,u1=u0+1.6/n,v1_=v0+1.6/n,f=(u,v)=>[0,1,2].map(m=>O[m]+u*c1[m]+v*c2[m]);Q([f(u0,v0),f(u1,v0),f(u1,v1_),f(u0,v1_)],C.gray,.13*al(2),C.gray,.3*al(2))}T(add(add(O,c1,1.25),c2,1.2),'espacio columna de X',C.gray,al(2),{b:1})}
 if(k>=3){Ar(O,add(O,y),C.ink,3.2,al(3));T(add(O,y,1.08),'y',C.ink,al(3),{b:1,sz:15})}
 if(k>=4){L(add(O,y),add(O,yh),C.or,1.6,al(4),[5,4]);Ar(O,add(O,yh),C.gn,3.2,al(4));T(add(O,yh,1.12),'ŷ = Xb',C.gn,al(4),{b:1})}
 if(k>=5){Ar(add(O,yh),add(O,y),C.or,3.4,al(5));const ne=Math.hypot(...e),u=c1.map(x=>x/Math.sqrt(A11)),s=.12,p0=add(O,yh),pe=e.map(x=>x/ne*s);PL([add(p0,u,s),add(add(p0,u,s),pe),add(p0,pe)],C.or,1.6,al(5));T(add(add(O,yh),e,.55),'e',C.or,al(5),{b:1,sz:15,dx:14})}
 if(k>=6){const ne=Math.hypot(...e),u=c1.map(x=>-x/Math.sqrt(A11)*ne),p0=add(O,yh);Q([p0,add(O,y),add(add(O,y),u),add(p0,u)],C.or,.22*al(6),C.or,.8*al(6));T(add(add(p0,u,.5),e,.5),"RSS = e'e",C.or,al(6),{b:1})}
 return{chips:k>=4?[ch('b₁',fm(b1)),ch('b₂',fm(b2))].concat(k>=6?[ch("e'e",fm(e.reduce((s,x)=>s+x*x,0),3),1)]:[]):[],bars:null}};
function rssBars(rows){const mx=Math.max(...rows.map(r=>r[1].reduce((s,x)=>s+x[0],0)));return rows.map(r=>`<div><span>${r[0]}</span><i>${r[1].map(([v,c])=>`<s style="width:${v/mx*100}%;background:${c}"></s>`).join('')}</i><em>${fm(r[1].reduce((s,x)=>s+x[0],0),1)}</em></div>`).join('')}
SC.chow=(k,a)=>{const al=A_(k,a);box(['X₂','X₃','Y']);dots(P1,C.blue,1);
 if(k>=1){plane(bfn(F1.b),C.blue,.13*al(1),'plano b₁');sticks(P1,bfn(F1.b),C.blue,al(1)*.8)}
 if(k>=2)dots(P2f,C.or,al(2),5.5);
 if(k>=3)P2f.forEach(p=>Pt(Wd(p.x2,p.x3,prd(F1.b,p.x2,p.x3)),C.or,5,al(3),1));
 if(k>=4){sticks(P2f,bfn(F1.b),C.or,al(4),3.2);const p=P2f[0];T(Wd(p.x2,p.x3,(p.y+prd(F1.b,p.x2,p.x3))/2),'d',C.or,al(4),{b:1,dx:12,sz:15})}
 if(k>=5){const s1=Math.sqrt(F1.rss/(n1-3)),w=(x2,x3)=>{const x=[1,x2,x3];let h=0;for(let i=0;i<3;i++)for(let j=0;j<3;j++)h+=x[i]*F1.I[i][j]*x[j];return 1.96*s1*Math.sqrt(1+h)};
  for(const sg of[1,-1])for(let i=0;i<=5;i++){const ln1=[],ln2=[];for(let j=0;j<=10;j++){const u=i*2,v=j;ln1.push(Wd(u,v,prd(F1.b,u,v)+sg*w(u,v)));ln2.push(Wd(v,u,prd(F1.b,v,u)+sg*w(v,u)))}PL(ln1,C.blue,1,.35*al(5));PL(ln2,C.blue,1,.35*al(5))}
  T(Wd(0,0,prd(F1.b,0,0)+w(0,0)),'envoltura ±1,96·se',C.blue,al(5),{dy:-12})}
 if(k>=6)plane(bfn(FC.b),C.gray,.12*al(6),'todas las obs.');
 const s=STAT.chow;return{chips:[ch('n₁',n1),ch('n₂',4),ch('k',3)].concat(k>=1?[ch('RSS₁',fm(F1.rss,1))]:[]).concat(k>=6?[ch('RSS',fm(FC.rss,1)),ch('F',fm(s.x),1),ch('p',fp(s.p))]:[]),
  bars:k>=6?rssBars([['RSS todas',[[FC.rss,C.gray]]],['RSS₁',[[F1.rss,C.blue]]]]):null}};
SC.cambio=(k,a)=>{const al=A_(k,a);box(['X₂','X₃','Y']);
 const cA=k>=2?al(2):0;dots(PT,C.gray,1-cA);dots(P1,C.blue,cA);dots(P2,C.or,cA);
 if(k>=1){const fade=k>=3?1-.75*al(3):1;plane(bfn(FP.b),C.gray,.12*al(1)*fade,k<3?'pooled':'');if(k<3||a<1&&k===3)sticks(PT,bfn(FP.b),C.gray,al(1)*(k>=3?1-al(3):1)*.8)}
 if(k>=3){plane(bfn(F1.b),C.blue,.13*al(3),'β′');sticks(P1,bfn(F1.b),C.blue,al(3)*.85)}
 if(k>=4){plane(bfn(F2.b),C.or,.13*al(4),'β″');sticks(P2,bfn(F2.b),C.or,al(4)*.85)}
 const s=STAT.cambio,c=[ch('n',N),ch('k',3)];if(k>=1)c.push(ch('RSS_R',fm(FP.rss,1)));if(k>=3)c.push(ch('RSS₁',fm(F1.rss,1)));if(k>=4)c.push(ch('RSS₂',fm(F2.rss,1)));if(k>=5)c.push(ch('RSS_R − RSS_NR',fm(FP.rss-RNR,1)));if(k>=6)c.push(ch('F(3, '+(N-6)+')',fm(s.x),1),ch('F crít 5 %',fm(s.c)),ch(s.x>s.c?'rechaza H₀':'no rechaza H₀','',1));
 return{chips:c,bars:k>=5?rssBars([['RSS_R',[[FP.rss,C.gray]]],['RSS₁+RSS₂',[[F1.rss,C.blue],[F2.rss,C.or]]]]):null}};
SC.dummy=(k,a)=>{const al=A_(k,a);box(['X₂','X₃','Y']);dots(P1,C.blue,1);dots(P2,C.or,1);
 const d=F2.b.map((x,i)=>x-F1.b[i]);let s=[0,0,0];if(k>=1)s[0]=k===1?ease(a):1;if(k>=2)s[1]=k===2?ease(a):1;if(k>=3)s[2]=k===3?ease(a):1;
 const c4=k>=4?ease(a):0;const b1=F1.b.map((x,i)=>lerp(x,FP.b[i],c4)),b2=F1.b.map((x,i)=>lerp(x+d[i]*s[i],FP.b[i],c4));
 plane(bfn(b1),C.blue,.13,k>=4?'':'β′ (D = 0)');if(k>=1)plane(bfn(b2),C.or,.13,k>=4?'pooled':'β + δ (D = 1)');
 if(k>=1&&k<4){Ar(Wd(0,0,prd(b1,0,0)),Wd(0,0,prd(b2,0,0)),C.pu,2.6,1);T(Wd(0,0,(prd(b1,0,0)+prd(b2,0,0))/2),'δ₁',C.pu,1,{b:1,dx:-16})}
 return{chips:[ch('δ₁',fm(d[0]*s[0])),ch('δ₂',fm(d[1]*s[1])),ch('δ₃',fm(d[2]*s[2]))].concat(k>=4?[ch('H₀: δ = 0 ⇒ un plano','',1)]:[]),bars:null}};
SC.inter=(k,a)=>{const al=A_(k,a);box(['X₂','X₃','Y']);dots(P1,C.blue,1);dots(P2,C.or,1);
 const b=FI.b,c=k>=2?ease(a):0;const f1=(x2,x3)=>lerp(b[0]+b[2]*x2+b[3]*x3,prd(FP.b,x2,x3),c),f2=(x2,x3)=>lerp(b[1]+b[2]*x2+b[3]*x3,prd(FP.b,x2,x3),c);
 if(k>=1){plane(f1,C.blue,.13*al(1),"β₁′");plane(f2,C.or,.13*al(1),"β₁″");if(k<2||a<1){Ar(Wd(5,5,f1(5,5)),Wd(5,5,f2(5,5)),C.pu,2.6,al(1)*(1-c));T(Wd(5,5,(f1(5,5)+f2(5,5))/2),'β₁″ − β₁′',C.pu,al(1)*(1-c),{b:1,dx:44})}}
 const s=STAT.inter;return{chips:[ch('k* = k+1',4)].concat(k>=1?[ch('β₁′',fm(b[0])),ch('β₁″',fm(b[1])),ch('RSS_NR_Inter',fm(FI.rss,1))]:[]).concat(k>=2?[ch('F(1, '+(N-4)+')',fm(s.x),1)]:[]),bars:null}};
SC.pend=(k,a)=>{const al=A_(k,a);box(['X₂','X₃','Y']);dots(P1,C.blue,1);dots(P2,C.or,1);
 const b=FS.b,c=k>=2?ease(a):0;const f1=(x2,x3)=>lerp(b[0]+b[1]*x2+b[2]*x3,prd(FP.b,x2,x3),c),f2=(x2,x3)=>lerp(b[0]+b[3]*x2+b[4]*x3,prd(FP.b,x2,x3),c);
 if(k>=1){plane(f1,C.blue,.13*al(1),'pendientes ′');plane(f2,C.or,.13*al(1),'pendientes ″');L(Wd(0,0,Math.min(...ys)-1),Wd(0,0,f1(0,0)),C.pu,2.4,al(1));Pt(Wd(0,0,f1(0,0)),C.pu,6,al(1));T(Wd(0,0,f1(0,0)),'β₁ común',C.pu,al(1),{b:1,dy:-14})}
 const s=STAT.pend;return{chips:[ch('k* = 2k−1',5)].concat(k>=1?[ch('β₂′',fm(b[1])),ch('β₂″',fm(b[3])),ch('β₃′',fm(b[2])),ch('β₃″',fm(b[4]))]:[]).concat(k>=2?[ch('F(2, '+(N-5)+')',fm(s.x),1)]:[]),bars:null}};
/* MV: densidades */
const mx=x=>(x-5.5)/5,my=y=>(y-(yMin+yMax)/2)/((yMax-yMin)/2),ZF=-.95,ZS=4.2;
const npdf=(y,m,s)=>Math.exp(-((y-m)**2)/(2*s*s))/(Math.sqrt(2*Math.PI)*s);
SC.mld=(k,a)=>{const al=A_(k,a);const g=C.grid;for(let i=-1;i<=1.001;i+=.5){L([i,-1,ZF],[i,1,ZF],g,1);L([-1,i,ZF],[1,i,ZF],g,1)}L([-1,-1,ZF],[1.15,-1,ZF],C.soft,1.6);L([-1,-1,ZF],[-1,1.15,ZF],C.soft,1.6);L([-1,-1,ZF],[-1,-1,1],C.soft,1.6);T([1.27,-1,ZF],'x',C.soft,1,{b:1});T([-1,1.27,ZF],'y',C.soft,1,{b:1});T([-1,-1,1.12],'f(y)',C.soft,1,{b:1});
 const ym=MD.reduce((s,p)=>s+p.y,0)/MD.length;let A0=ym,B0=0;const t3=k>=3?(k===3?ease(a):1):0,t4=k>=4?(k===4?ease(a):1):0;
 const A=lerp(A0,FM.b[0],t3),B=lerp(B0,FM.b[1],t3),sg=lerp(2.1,Math.sqrt(s2MV),t4);
 MD.forEach(p=>Pt([mx(p.x),my(p.y),ZF],C.blue,4.5,1));
 let l=0;MD.forEach(p=>l+=Math.log(npdf(p.y,A+B*p.x,sg)));
 if(k>=1){const al1=al(1);L([mx(0),my(A),ZF],[mx(11),my(A+B*11),ZF],C.gn,2.6,al1);
  MD.forEach(p=>{const m=A+B*p.x,pts=[];for(let i=0;i<=30;i++){const yy=yMin+(yMax-yMin)*i/30;pts.push([mx(p.x),my(yy),ZF+npdf(yy,m,sg)*ZS])}PL(pts,C.pu,1.4,.7*al1);L([mx(p.x),my(p.y),ZF],[mx(p.x),my(p.y),ZF+npdf(p.y,m,sg)*ZS],C.or,3.2,al1)});
  T([mx(11),my(A+B*11),ZF],k>=3?'recta MV':'recta candidata',C.gn,al1,{b:1,dx:10,al:'left'})}
 const c=[ch('σ',fm(sg))];if(k>=1)c.push(ch('l = Σ ln f',fm(l),k>=2?1:0));if(k>=2)c.push(ch('L = Π f',fm(Math.exp(l))));if(k>=3)c.push(ch('β^₁',fm(A)),ch('β^₂',fm(B)));if(k>=4)c.push(ch('σ^² = RSS/n',fm(sg*sg),1));return{chips:c,bars:null}};
/* MV: superficie */
const AA=FM.A.map(r=>r.map(x=>x/s2MV)),IA=inv(AA),w1=3.1/Math.sqrt(AA[0][0]),w2=3.1/Math.sqrt(AA[1][1]);
function qf(u,v,M,s){const d1=u*w1,d2=v*w2;return s*(M[0][0]*d1*d1+2*M[0][1]*d1*d2+M[1][1]*d2*d2)}
SC.mls=(k,a)=>{const al=A_(k,a);const sh=k>=4?lerp(1,2,k===4?ease(a):1):1;const z=(u,v)=>Math.max(-1,.8-qf(u,v,AA,sh)*.07);
 box(['β₁','β₂','l(β)']);const n=18;for(let i=0;i<n;i++)for(let j=0;j<n;j++){const u0=-1+2*i/n,v0=-1+2*j/n,u1=u0+2/n,v1=v0+2/n,zz=z((u0+u1)/2,(v0+v1)/2);Q([[u0,v0,z(u0,v0)],[u1,v0,z(u1,v0)],[u1,v1,z(u1,v1)],[u0,v1,z(u0,v1)]],zz>.5?C.or:C.blue,.18+.25*(zz+1)/2,C.blue,.25)}
 Pt([0,0,z(0,0)],C.or,6,1);T([0,0,z(0,0)],'θ^',C.or,1,{b:1,dy:-14,sz:15});
 const P0=[-.62,.55],tt=k>=2?(k===2?ease(a):1):0,pu=lerp(P0[0],0,tt),pv_=lerp(P0[1],0,tt);
 if(k>=1&&k<=2){const e=.002,gu=(z(pu+e,pv_)-z(pu-e,pv_))/(2*e),gv=(z(pu,pv_+e)-z(pu,pv_-e))/(2*e),gn=Math.hypot(gu,gv),sc=Math.min(.38,gn*.25);Pt([pu,pv_,z(pu,pv_)],C.gn,6,al(1));if(gn>.05){const q=[pu+gu/gn*sc,pv_+gv/gn*sc];Ar([pu,pv_,z(pu,pv_)+.01],[q[0],q[1],z(q[0],q[1])+.01],C.gn,3,al(1));T([q[0],q[1],z(q[0],q[1])],'score',C.gn,al(1),{b:1,dy:-12})}
  if(k===2&&tt>.98){const zt=z(0,0);Q([[-.25,-.25,zt],[.25,-.25,zt],[.25,.25,zt],[-.25,.25,zt]],C.gn,.25,C.gn,.8);T([.3,.3,zt],'s(θ^) = 0',C.gn,1,{b:1,al:'left'})}}
 if(k>=3){const c1=[],c2=[];for(let i=0;i<=24;i++){const t=-1+2*i/24;c1.push([t,0,z(t,0)+.01]);c2.push([0,t,z(0,t)+.01])}PL(c1,C.or,3,al(3));PL(c2,C.pu,3,al(3));T([1,0,z(1,0)],'corte β₁',C.or,al(3),{b:1,dx:8,al:'left'});T([0,1,z(0,1)],'corte β₂',C.pu,al(3),{b:1,dx:8,al:'left'})}
 if(k>=4){const Lc=[[Math.sqrt(AA[0][0]*sh),0],[0,0]];const a11=AA[0][0]*sh,a12=AA[0][1]*sh,a22=AA[1][1]*sh,l11=Math.sqrt(a11),l21=a12/l11,l22=Math.sqrt(a22-l21*l21),c=1.2,pts=[];for(let i=0;i<=40;i++){const th=i/40*2*Math.PI,x2=c*Math.sin(th)/l22,x1=(c*Math.cos(th)-l21*x2)/l11;pts.push([x1/w1,x2/w2,-1])}PL(pts,C.pu,2.4,al(4));L([0,0,-1],[0,0,z(0,0)],C.pu,1.2,al(4),[4,4]);T(pts[10],'elipse ∝ I⁻¹',C.pu,al(4),{b:1,dx:10,al:'left'})}
 return{chips:[ch('n',MD.length)].concat(k>=4?[ch('información ×',fm(sh,1),1)]:[]).concat(k>=3?[ch('∂²l/∂β₁²',fm(-AA[0][0]*sh)),ch('∂²l/∂β₂²',fm(-AA[1][1]*sh))]:[]),bars:null}};
/* trinidad */
const TA=[[2.4,.9],[.9,1.6]],TH=[.25,.3],TZ=.9,TS=.32,TF=-1.15;
const tz=(u,v)=>{const d1=u-TH[0],d2=v-TH[1];return TZ-TS*(TA[0][0]*d1*d1+2*TA[0][1]*d1*d2+TA[1][1]*d2*d2)};
const lineV=u=>.55*u-.98;
const TR=(()=>{let best=-1e9,bu=0;for(let i=0;i<=4000;i++){const u=-1+2*i/4000,z=tz(u,lineV(u));if(z>best){best=z;bu=u}}return[bu,lineV(bu)]})();
SC.trin=(k,a)=>{const al=A_(k,a);const g=C.grid;for(let i=-1;i<=1.001;i+=.5){L([i,-1,TF],[i,1,TF],g,1);L([-1,i,TF],[1,i,TF],g,1)}L([-1,-1,TF],[1.15,-1,TF],C.soft,1.6);L([-1,-1,TF],[-1,1.15,TF],C.soft,1.6);L([-1,-1,TF],[-1,-1,1.1],C.soft,1.6);T([1.27,-1,TF],'β₂',C.soft,1,{b:1});T([-1,1.27,TF],'β₃',C.soft,1,{b:1});T([-1,-1,1.22],'l(β)',C.soft,1,{b:1});
 const n=18,zc=(u,v)=>Math.max(TF,tz(u,v));for(let i=0;i<n;i++)for(let j=0;j<n;j++){const u0=-1+2*i/n,v0=-1+2*j/n,u1=u0+2/n,v1=v0+2/n,zz=zc((u0+u1)/2,(v0+v1)/2);if(zz<=TF+.001)continue;Q([[u0,v0,zc(u0,v0)],[u1,v0,zc(u1,v0)],[u1,v1,zc(u1,v1)],[u0,v1,zc(u0,v1)]],zz>.4?C.or:C.blue,.14+.2*(zz+1)/2,C.blue,.2)}
 Pt([TH[0],TH[1],TZ],C.or,6.5,1);T([TH[0],TH[1],TZ],'θ^ libre',C.or,1,{b:1,dy:-15});
 if(k>=1){const us=[],cs=[];for(let i=0;i<=30;i++){const u=-1+2*i/30,v=lineV(u);if(v<-1||v>1)continue;us.push([u,v,TF]);cs.push([u,v,zc(u,v)])}PL(us,C.pu,2.6,al(1));PL(cs,C.pu,3,al(1));for(let i=1;i<cs.length;i++)Q([us[i-1],us[i],cs[i],cs[i-1]],C.pu,.1*al(1));T(us[us.length-1],'Rβ = r',C.pu,al(1),{b:1,dx:10,al:'left'})}
 const zr=tz(TR[0],TR[1]);
 if(k>=2){Pt([TR[0],TR[1],zr],C.pu,6.5,al(2));T([TR[0],TR[1],zr],'θ~ restringido',C.pu,al(2),{b:1,dx:12,al:'left'})}
 if(k>=3&&k!==4&&k!==5||k===6){L([TH[0],TH[1],TZ],[TR[0],TR[1],TZ],C.red,1.4,k===3?al(3):1,[5,4]);L([TR[0],TR[1],zr],[TR[0],TR[1],TZ],C.red,3.4,k===3?al(3):1);T([TR[0],TR[1],(zr+TZ)/2],'LR/2',C.red,k===3?al(3):1,{b:1,dx:-26})}
 if(k===4||k===6){const A2=k===4?al(4):1;for(const lv of[.25,.6]){const pts=[];const a11=TA[0][0],a12=TA[0][1],a22=TA[1][1],l11=Math.sqrt(a11),l21=a12/l11,l22=Math.sqrt(a22-l21*l21),c=Math.sqrt((TZ-zr)/TS)*(lv/.6);for(let i=0;i<=40;i++){const th=i/40*2*Math.PI,x2=c*Math.sin(th)/l22,x1=(c*Math.cos(th)-l21*x2)/l11;pts.push([TH[0]+x1,TH[1]+x2,TF])}PL(pts,C.or,1.4,.7*A2)}
  L([TH[0],TH[1],TF],[TH[0],TH[1],TZ],C.or,1.1,A2,[4,4]);Ar([TH[0],TH[1],TF],[TR[0],TR[1],TF],C.ink,3,A2);T([(TH[0]+TR[0])/2,(TH[1]+TR[1])/2,TF],'W',C.ink,A2,{b:1,dy:-12,sz:15})}
 if(k===5||k===6){const A2=k===5?al(5):1,e=.002;let gu=(tz(TR[0]+e,TR[1])-tz(TR[0]-e,TR[1]))/(2*e),gv=(tz(TR[0],TR[1]+e)-tz(TR[0],TR[1]-e))/(2*e);const gn=Math.hypot(gu,gv),s=.42,q=[TR[0]+gu/gn*s,TR[1]+gv/gn*s];Ar([TR[0],TR[1],zr+.01],[q[0],q[1],tz(q[0],q[1])+.01],C.gn,3.4,A2);T([q[0],q[1],tz(q[0],q[1])],'LM: score ≠ 0',C.gn,A2,{b:1,dy:-13})}
 const c=[];if(k>=3)c.push(ch('LR',fm(STAT.LR.x),k===3||k===6?1:0));if(k>=4)c.push(ch('W',fm(STAT.W.x),k===4||k===6?1:0));if(k>=5)c.push(ch('LM',fm(STAT.LM.x),k===5||k===6?1:0));if(k>=3)c.push(ch('χ²₃ crít 5 %',fm(STAT.W.c)));if(k===6)c.push(ch('W ≥ LR ≥ LM','',1));return{chips:c,bars:null}};
/* distribución 2D */

return {NODES,TREE,GL,CS,DOC,SC,inicio:'C8',clave:'eco1-p2'};
});
