# SEC-02 · Operación de la administración de la tienda

Este procedimiento se ejecuta únicamente con autorización de dirección. La configuración pertenece al servidor. Las cuentas de GitHub y Vercel se administran de forma independiente a las cuentas del panel.

## Configuración por entorno

| Nombre | Función |
| --- | --- |
| `STORE_ADMIN_IDS` | UUID permanentes de cuentas de la tienda, separados por comas. Se admiten varios, espacios y mayúsculas en los UUID. Una lista vacía no concede permisos. No usar correos ni identificadores de GitHub. |
| `NEXTAUTH_SECRET` | Secreto de sesión de alta entropía. Se conserva exactamente el valor privado anterior si es adecuado. Ausente, con menos de 32 caracteres útiles o igual al respaldo público retirado, la autenticación administrativa queda indisponible. |
| `NEXTAUTH_URL` | URL canónica de autenticación del entorno. Su origen exacto (protocolo, host, puerto) autoriza las escrituras desde el navegador. Si falta, en Vercel se usa el origen HTTPS de `VERCEL_URL`. Probar cada entorno desde su origen autorizado. |
| `SEED_USER_EMAIL`, `SEED_USER_NAME`, `SEED_USER_PASSWORD` | Solo para un alta explícita y aprobada. El inicializador requiere los tres valores y una contraseña de al menos 16 caracteres y hasta 72 bytes. Una cuenta existente conserva sus datos. El alta no otorga acceso administrativo. No ejecutar como parte del despliegue. |

No usar variables con prefijo público, incluir valores en el repositorio ni pegar secretos en incidencias. Los consumidores administrativos que usen cookies deben emitir la petición desde el origen autorizado. Inventariar previamente integraciones de importación y clientes ajenos al navegador. Una petición de escritura sin Origin será rechazada.

## Alta, revocación y sesiones

1. Dirección registra la solicitud, ámbito y aprobación de la cuenta. El operador autorizado verifica la correspondencia entre la persona y el UUID de su usuario en la tienda por un canal interno. La autorización se concede por UUID individual. Una cuenta compartida impide una revocación individual.
2. Para dar acceso, añadir el UUID al ajuste de servidor del entorno. Para retirarlo, eliminar únicamente ese UUID. Conservar el resto de administradores. Registrar responsable, entorno, aprobación, momento y despliegue que adoptó el cambio. No registrar la contraseña, cookies o secreto.
3. En Vercel, desplegar la configuración aprobada y retirar o proteger los despliegues anteriores que sigan sirviendo la lista antigua. El servidor evalúa la lista en cada acceso administrativo. Un JWT vigente ya no concede administración en una instancia con el UUID retirado. Una solicitud ya autorizada puede terminar. Un cambio de variable en el panel no actualiza retroactivamente los despliegues existentes.
4. NextAuth v4 usa sesiones JWT, con duración predeterminada de 30 días y renovación con actividad de sesión. Se mantienen estrategia, cookies e identidad del usuario. Un token puede seguir autenticando a la persona después de perder el permiso. Un cambio de secreto invalida los tokens anteriores cuando el despliegue adopta el nuevo valor. Para una cuenta eliminada o comprometida, retirar también su UUID de la lista. No asumir revocación global instantánea.
5. Si el sistema utilizó el respaldo anterior o existe una cuenta procedente del antiguo inicializador, coordinar una transición independiente. El responsable verifica la procedencia de cuentas sin probar credenciales predeterminadas. Cualquier rotación, reautenticación o cambio de contraseña requiere aprobación y comunicación previa.

## Antes de liberar

- Identificar a todos los administradores legítimos y a su sustituto operativo. Confirmar con los colaboradores qué tareas requieren panel y cuáles requieren solo GitHub/Vercel. Mantener un canal autorizado de recuperación con el propietario de la configuración.
- Registrar SHA, despliegue estable, dominios, configuración por entorno y cambios concurrentes. Revisar los ficheros que se solapan con otros PR de catálogo antes de integrarlos. Preparar respaldo autorizado y constatar que es recuperable. Esta versión no precisa migraciones.
- Confirmar secreto y origen sin consultar ni exponer sus valores en el informe. Probar primero en staging aislado con configuración equivalente, MySQL sintético y permisos mínimos. Ensayar sesión anterior, nuevo inicio de sesión, acceso de dos operadores y revocación de uno. Verificar cookies y política de origen en el dominio que utilizará el equipo.
- Revisar aplicabilidad y mitigación de los avisos críticos de dependencias. Revisar límites de frecuencia existentes para el formulario público en el borde y acordar umbrales con comercio. El código limita bytes, líneas y cantidades por solicitud; ese límite no regula la frecuencia entre solicitudes.
- Revisar el acceso legítimo de cada administrador, incluida la persona responsable del mantenimiento. Requerir al menos un administrador operativo y probar la recuperación. Dirección decide la liberación del SHA y despliegue que fueron validados.

## Verificación y recuperación

Después de una futura liberación aprobada, comprobar catálogo y ficha públicos, navegación, visibilidad de inactivos en el panel, filtros, cotización de ensayo acordada y administración de productos, imágenes, importaciones y estados. Seguir tasas de 401, 403, 409 y 500/503 por operación sin registrar cuerpos de cotización. Suspender ante pérdida del último administrador, errores de origen para tráfico legítimo, exposición de inactivos o fallos de cotización.

Ante un bloqueo, comprobar primero cuenta/UUID, lista efectiva, origen, versión de despliegue y presencia de secreto. Restaurar configuración aprobada, desplegarla por el proceso normal y verificar el acceso en una sesión nueva. Mantener los controles de autorización durante la recuperación.

Si se requiere reversión, dirección identifica el despliegue estable y el commit anterior y autoriza una restauración exclusiva de SEC-02. En presencia de otros cambios, revertir el commit SEC-02 en rama independiente y revisar el diff antes de publicar. Volver al despliegue anterior completo solo si sus demás cambios y sus controles de acceso siguen siendo aceptables. Recuperar el software anterior puede reabrir las APIs sin autorización. Establecer una restricción administrativa temporal y comprobada antes de volver a servirlo o mantener suspendida esa superficie. No restaurar secretos conocidos, credenciales predeterminadas ni datos por rutina. Verificar compatibilidad de cookies, catálogo, ficha, cotización y acceso administrativo. Revisar registros y cerrar la incidencia con el SHA efectivo.
