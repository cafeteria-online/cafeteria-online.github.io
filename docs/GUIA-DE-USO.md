# Guía de uso

Esta guía explica cómo usan la página tus clientes y cómo la administras tú.

---

## 1. Lo que ve el cliente

1. Entra a la página y ve la portada, las secciones del menú y los «favoritos de la casa».
2. Pulsa **Agregar** en los productos que quiere. Se abre **Mi pedido** (el carrito).
3. En el carrito puede cambiar cantidades, escribir su nombre y notas (p. ej. «para llevar, sin salsa»).
4. Pulsa **Enviar pedido por WhatsApp**. Se abre WhatsApp con un mensaje ya escrito, por ejemplo:

   ```
   ¡Hola Café Ejemplo! Quiero hacer este pedido:

   • 2 × Quesadilla de chipilín [QCH-002] — $35.00 c/u
     https://…/#/p/QCH-002
   • 1 × Café de olla [CAF-001] — $35.00 c/u
     https://…/#/p/CAF-001

   *Total: $105.00*
   Nombre: Ana
   Notas: para llevar
   ```

5. El cliente solo tiene que pulsar **Enviar** en WhatsApp.

También puede abrir la página de un producto (tocando su foto) y usar **Pedir solo esto por WhatsApp**.

### Cómo identificar el producto cuando te llega un pedido

- Cada producto tiene un **código** (por ejemplo `QCH-002`). Es lo más confiable: aunque cambies el nombre, el código no cambia.
- Cada línea trae el **enlace del producto**: al tocarlo ves la misma foto, el nombre y el precio que vio el cliente.
- El precio del mensaje es el vigente al momento del pedido.

> Consejo: guarda tu número de WhatsApp Business y responde confirmando el total y la hora de entrega.

---

## 2. Entrar al panel de administración

1. Ve a la página y, al final (pie de página), pulsa **Administración**, o abre directamente `…/#/admin`.
2. Escribe el correo y la contraseña de administrador (los que creaste en Supabase).
3. Para salir, pulsa **Cerrar sesión**. Hazlo siempre en computadoras compartidas.

¿Olvidaste la contraseña? En Supabase: *Authentication → Users → (tu usuario) → Send password recovery*,
o cámbiala desde ahí mismo.

El panel tiene tres pestañas: **Productos**, **Secciones** y **Página**.

---

## 3. Productos

### Agregar un producto
1. Pulsa **+ Nuevo producto**.
2. Llena **nombre**, **descripción**, **precio** y elige la **sección**.
3. El **código** se genera solo (p. ej. si la sección es Postres y ya existe POS-005, el nuevo será POS-006).
4. Pulsa **Subir foto** y elige una imagen de tu celular o computadora.
   - No importa el tamaño ni la forma: se **recorta al centro en cuadrado (800×800)** y se comprime automáticamente.
   - Para mejores resultados, toma la foto con el producto al centro y buena luz natural.
5. Marca **Favorito de la casa** si quieres que aparezca arriba, en «Los favoritos de la casa».
6. Pulsa **Guardar**.

### Editar, ocultar o borrar
- **Editar**: cambia lo que necesites y guarda. El código se conserva para no romper pedidos anteriores.
- **Disponible**: desmárcalo cuando se te acabe algo. El producto se queda visible con la etiqueta **Agotado** y no se puede pedir. Vuelve a marcarlo cuando haya otra vez.
- **Favorito**: lo muestra en la sección de favoritos.
- **↑ ↓**: cambian el orden dentro de su sección.
- **Borrar**: lo elimina para siempre (pide confirmación). Si solo es temporal, mejor usa «Disponible».
- **Buscar**: escribe parte del nombre o del código en el buscador.

---

## 4. Secciones

Las secciones agrupan el menú (Café caliente, Bebidas frías, Quesadillas chiapanecas, Postres…).

- **+ Nueva sección**: escribe el nombre; el **prefijo** de códigos (2 a 4 letras) se sugiere solo (p. ej. «Pan dulce» → `PAN`). Puedes cambiarlo antes de guardar.
- **Visible**: desmárcalo para ocultar toda la sección (por ejemplo, un menú de temporada) sin borrar nada.
- **↑ ↓**: cambia el orden en que aparecen en la página.
- **Borrar**: solo se permite si la sección no tiene productos. Mueve o borra sus productos primero.

---

## 5. Página (textos, fotos y horario)

Aquí editas todo lo que no es el menú:

| Grupo | Qué controla |
|---|---|
| Negocio | Nombre, frase corta y **número de WhatsApp** que recibe los pedidos |
| Portada | Título, texto de bienvenida y foto grande (se ajusta a 1600×900) |
| Nuestra tradición | Título, texto y foto (se ajusta a 1200×900) |
| Ubicación y redes | Dirección, enlace de Google Maps, Instagram, Facebook y texto del pie |
| Horario | Hora de apertura y cierre, y días que abres |

- El **número de WhatsApp** va con lada de país y solo dígitos. En México: `521` + 10 dígitos (ej. `5219611234567`).
- El **horario** controla la etiqueta «Abierto/Cerrado» del encabezado (según la hora del visitante).
- Pulsa **Guardar cambios** al final. Los cambios se ven de inmediato en la página.

---

## 6. Buenas prácticas

- Usa fotos reales de tus productos: venden más que las de stock.
- Revisa precios cuando cambien tus costos; el carrito siempre usa el precio actual.
- No compartas tu contraseña; si alguien más te ayuda, crea otro usuario administrador en Supabase y agrégalo a la tabla `admins` (ver README).
- El plan gratuito de Supabase pausa el proyecto si pasa **una semana sin visitas**; basta con entrar a supabase.com y reanudarlo. Con visitas normales no ocurre.

## 7. Modo demostración

Si la página dice «Modo demostración», no está conectada a Supabase. Puedes probar todo el panel,
pero los cambios se guardan **solo en tu navegador** y nadie más los ve. El botón
«Restaurar datos de ejemplo» regresa todo al menú inicial.
