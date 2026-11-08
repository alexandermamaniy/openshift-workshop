# TiendaYa: Requisitos de negocio

> **Dinámica para los alumnos.** Lee este documento como si fueras el equipo de arquitectura al que el cliente le ha encargado el sistema. No hay una única respuesta correcta: lo importante es que puedas **justificar cada decisión con un requisito**.

## La situación

**TiendaYa** es una tienda de ropa con 500 productos. Hoy vende solo en tiendas físicas: los pedidos se apuntan a mano y a veces se vende lo que ya no hay en stock.

La empresa quiere vender por internet. Cada año hace un evento de **Black Friday** en el que espera **20 veces más visitas** que un día normal.

## Qué necesita la empresa

Una tienda online donde los clientes miren el catálogo y hagan un pedido.

## Quién lo usa

| Quién | Qué hace |
|---|---|
| **Visitante** | Mira el catálogo |
| **Cliente** | Hace un pedido y lo paga |

## Cómo funciona

1. El visitante abre la tienda y ve el catálogo con precios y stock.
2. Elige productos y escribe sus datos de envío.
3. El sistema cobra el pedido a través de un **proveedor de pagos externo**.
4. Si el pago es aceptado, el sistema registra el pedido y descuenta el stock.

## Qué debe garantizar el sistema

| # | Calidad |
|---|---|
| RN1 | **Ningún pedido se pierde**, aunque una parte del sistema falle o se reinicie. |
| RN2 | Hay unas **100 visitas al catálogo por cada compra**. Mirar el catálogo no puede ralentizar las compras. |
| RN3 | En Black Friday el sistema debe **aguantar 20 veces el tráfico normal** sin intervención manual. |
| RN4 | La **clave del proveedor de pagos** y las credenciales no pueden aparecer en el código ni en los logs. |
| RN5 | Si el proveedor de pagos falla, **el catálogo debe seguir funcionando**. |
| RN6 | Los clientes solo deben llegar a la tienda. **La base de datos nunca debe ser accesible desde fuera.** |

## Qué tienes que entregar

Un diagrama de arquitectura en OpenShift que incluya:

1. Los **componentes** de la aplicación.
2. Qué recurso de OpenShift usas para cada uno, y **por qué**.
3. Cómo se comunican entre sí.
4. Dónde se guardan los datos y la configuración.
5. Qué es público y qué es interno.
6. Qué ocurre en Black Friday.

### Vocabulario

`Route` · `Service` · `Headless Service` · `Deployment` · `StatefulSet` · `Pod` · `ConfigMap` · `Secret` · `PVC` · `HPA`

### Preguntas para justificar tu diseño

- ¿Qué componentes guardan estado y cuáles no?
- ¿Qué parte debe escalar primero en Black Friday?
- ¿Cómo evitas que alguien llegue a la base de datos desde internet?
- ¿Dónde pones la clave del proveedor de pagos?
