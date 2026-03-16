Una tabla para cada persona ( al final se van a unir todas )

Se pueden ver las historias de usuario para testear en:

https://github.com/StreetAsk-ISPP/ISPP-G10/blob/main/docs/WORK_PLAN.md

Enlace de la app desplegada (trunk):

Preproducción: https://streetask-preprod-frontend.onrender.com/

Revisores:

Santia Bregu

Sprint 1:

| User Story | Status | Changes required | Additional comments | Responsable |
| --- | --- | --- | --- | --- |
| US-01 | PENDING | Añadir campo de confirmación de contraseña. Añadir opción para mostrar u ocultar la contraseña. Añadir verificación de correo electrónico tras el registro. | El registro funciona correctamente, pero la seguridad y la usabilidad podrían mejorarse con la verificación de correo electrónico y la confirmación de contraseña. | Manuel |
| --- | --- | --- | --- | --- |
| US-03 | PENDING | Implementar la función de recuperación de contraseña. Añadir la opción de mostrar u ocultar la contraseña en el formulario de inicio de sesión. | El inicio de sesión funciona correctamente, pero el botón "¿Olvidó su contraseña?" no activa ningún proceso de recuperación. | Manuel |
| --- | --- | --- | --- | --- |
| US-08 | PENDING | Mejorar la selección del radio de respuesta: limitar el rango de radio permitido y ajustar el tamaño predeterminado para evitar un área excesivamente grande.<br><br>Error de tiempo de espera al crear preguntas con un radio de respuesta amplio. | La creación de preguntas funciona correctamente en general, pero al seleccionar un radio de 10 km, la solicitud falla con un error de tiempo de espera (se superaron los 10000 ms). | Manuel |
| --- | --- | --- | --- | --- |
| US-09 | PENDING | Permitir a los usuarios adjuntar imágenes a las respuestas | La publicación de respuestas funciona correctamente, pero añadir compatibilidad con imágenes podría mejorar la utilidad de las respuestas. | Manuel |
| --- | --- | --- | --- | --- |
| US-11 | DONE |     | El mapa muestra las preguntas correctamente. Las preguntas que se pueden responder aparecen en naranja, mientras que las que están fuera del radio de respuesta aparecen en gris, lo que mejora la usabilidad y ayuda a los usuarios a identificar rápidamente las interacciones disponibles. | Manuel |
| --- | --- | --- | --- | --- |
| US-13 | PENDING | Considerar la posibilidad de añadir opciones de ordenación para las respuestas (por ejemplo, más recientes o más votadas) para mejorar la legibilidad en hilos largos. | Los detalles de las preguntas y las respuestas se muestran correctamente en formato de miniforo. Los usuarios pueden ver las respuestas, consultar la información del autor e interactuar mediante votos y nuevas respuestas. | Manuel |
| --- | --- | --- | --- | --- |
| US-XX | DONE |     | Las preguntas muestran un temporizador de cuenta regresiva que indica el tiempo restante (2 horas para usuarios gratuitos), lo que sugiere que la lógica de caducidad está implementada. | Manuel |
| --- | --- | --- | --- | --- |

| User Story | Status | Changes required | Additional comments | Responsable |
| --- | --- | --- | --- | --- |
| US-01 | PENDING | \-Segundo campo de contraseña para su confirmación.<br><br>\-Algún tipo de verificación del correo electrónico. | Todo va como esperaba, sin errores en la consola. Podemos mejorar la seguridad de nuestro registro con los dos cambios comentados. | Darío |
| --- | --- | --- | --- | --- |
| US-03 | PENDING | \-Actualmente no funciona el botón de olvidar contraseña, hay que implementarlo.  <br>\-Añadir un botón para ocultar/ver contraseña que estás introduciendo para una mejor experiencia. | Todo va como esperaba, sin errores en la consola. | Darío |
| --- | --- | --- | --- | --- |
| US-11 | DONE | \-Ninguno | Todo va como esperaba, quizás yo propondría un pequeño cambio en la interfaz:<br><br>\-Cuando entras en la pregunta, en vez de abrir una pantalla nueva con el foro, que este sea un modal alargado que no ocupe toda la pantalla y se siga viendo el mapa por detrás, quedaría mejor visualmente. | Darío |
| --- | --- | --- | --- | --- |
| US-08 | PENDING | \-Cuando se abre el formulario de creación de preguntas, la app automáticamente te localiza en el centro de Sevilla, en vez de la zona donde tú estás. Lo suyo sería que al darle a “pick on map” saliese de primera ubicación donde tu estes.  <br>\-Aunque está muy bien que puedas elegir el radio de la pregunta, pienso que debería estar limitado, para mi no tiene sentido que se haga una pregunta con 0.005 de radio porque nadie podría responder, también veo innecesario que se pueda hacer una pregunta con radio 10000 que involucre a medio mundo, no es el propósito de nuestra app. Entonces yo pondría que el radio estuviese en un intervalo razonable.  <br>\-Para cuando quieras escribir la dirección del sitio al que quieres preguntar también sería conveniente poder elegir el radio ya que de esta forma sólo puedes hacer preguntas de 1km de radio. | El funcionamiento es correcto, va como esperas que vaya. Sería conveniente tener en cuenta las tres sugerencias de cambios. | Darío |
| --- | --- | --- | --- | --- |
| US-13 | PENDING | \-El foro en pantallas de resolución horizontal se ve muy vacío ya que cada componente se extiende a lo largo de la pantalla. Estaría bien que el foro no sea una pantalla completa sino un modal alargado en un lateral de la aplicación, así conseguimos un foro más intuitivo y visual.<br><br>\-La interfaz (tipografía, iconos, etc) pienso que se puede mejorar, es poco atractiva la forma del componente de pregunta, la pregunta como tal parece con letra pequeña que pasa desapercibida.  <br>\-Si entras al foro, sales y quieres volver a entrar pulsando “click to open” no funciona, tienes que pulsar otro punto en el mapa y volver a darle para que entre. | El funcionamiento es correcto, va como esperas que vaya. Sería conveniente tener en cuenta las tres sugerencias de cambios | Darío |
| --- | --- | --- | --- | --- |
| US-09 | PENDING | \-Al escribir una respuesta le tienes que dar con el cursor manualmente a enviar, no se envía dándole al enter. Estaría bien implementar eso para conseguir una mejor experiencia.  <br>\-Podríamos añadir unas respuestas predeterminadas como otras apps de estilo “Si, es correcto”, “No”, “No lo sé” , etc para respuestas rápidas y concisas. | El funcionamiento es correcto, va como esperas que vaya. Sería conveniente tener en cuenta las dos sugerencias de cambios | Darío |
| --- | --- | --- | --- | --- |
| US-XX | DONE | \-Niguno | La cuenta atrás funciona correctamente. | Darío |
| --- | --- | --- | --- | --- |

Sprint 2:

| User Story | Status | Changes required | Additional comments | Responsable |
| --- | --- | --- | --- | --- |
| US-06 (Profile): View basic user profile, statistics, and activity history. | PENDING | Fix bug de duplicación de preguntas.<br><br>Botón de “Edit Profile” no funciona todavía.<br><br>Muchos botones que no funcionan, hay que crear ya las pantallas | He creado una pregunta y me sale duplicada en estadisticas del perfil. Hy que ver la logica: | Santia |
| --- | --- | --- | --- | --- |
| US-10 (Rating): Like/Dislike system on answers with user rating calculation | PENDING | Añadir funcionalidad de ver rating / perfil de usuario que ha respondido en una pregunta<br><br>Arreglar botón de like y dislike | Cuando un usuario haga click en el nombre de una persona que le haya respondido en una pregunta, tiene que aparecer el rating de esta persona y un botón que te lleve a su perfil y que obviamente no te deja hacer nada, solo ver estadísticas<br><br>El sistema te permite darle me gusta a tu propia respuesta | Santia |
| --- | --- | --- | --- | --- |
| US-12 (Notifications): Receive notifications for nearby questions and responses to own questions. | DONE |     | Dentro de la app funciona bn | Santia |
| --- | --- | --- | --- | --- |
| US-04 (Edit Profile): Edit profile information. | PENDING | No hace nada |     | Santia |
| --- | --- | --- | --- | --- |

| User Story | Status | Changes required | Additional comments | Responsable |
| --- | --- | --- | --- | --- |
|     |     |     |     |     |
| --- | --- | --- | --- | --- |
|     |     |     |     |     |
| --- | --- | --- | --- | --- |
|     |     |     |     |     |
| --- | --- | --- | --- | --- |
|     |     |     |     |     |
| --- | --- | --- | --- | --- |