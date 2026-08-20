# Prompt maestro — App JPES GYM (PWA)

> Este documento está pensado para pegarse en una herramienta de desarrollo asistido por IA (Claude Code, Cursor, etc.) como contexto de proyecto, y también sirve como referencia técnica para el equipo. Complementa la "Propuesta de app para acceso a rutinas de entrenamiento" (documento Word) — ese archivo tiene el razonamiento de negocio; este tiene el detalle técnico para construir.

---

## 1. Resumen del proyecto

Construir una **PWA (Progressive Web App)** para JPES GYM que reemplaza el reparto de rutinas por Excel/Drive, y que además gestiona perfiles de alumnos, seguimiento físico, asistencia, pagos y comunicación. Hay dos roles: **alumno** y **administrador/instructor** (mismo rol con permisos ampliados).

Prioridad de construcción: **Fase 1 → Fase 2 → Fase 3**, en ese orden. No empezar Fase 2 o 3 sin que Fase 1 esté en uso real con alumnos.

---

## 2. Stack sugerido (ajustable a lo que tu socio ya domine)

Esto es un punto de partida razonable, no una imposición — si tu socio tiene stack de preferencia, se prioriza lo que él conozca bien sobre lo que aquí se sugiere.

- **Frontend:** Next.js (App Router) o similar framework con soporte nativo de PWA (service worker, manifest, instalación "agregar a inicio").
- **Backend/DB:** Supabase o Firebase — ambos dan de una vez autenticación, base de datos, storage (para fotos de perfil/QR) y funciones serverless, lo cual acelera mucho un MVP con un equipo pequeño.
- **Notificaciones push:** Web Push API (estándar de PWA), no requiere app nativa.
- **Generación/lectura de QR:** librería `qrcode` (generar) + `@zxing/library` o `html5-qrcode` (leer desde cámara del celular).
- **Autenticación:** email/clave o número de teléfono; el rol (alumno/admin) se guarda como campo en el usuario.
- **Hosting:** Vercel (si es Next.js) — despliegue simple y gratis para el volumen inicial de un solo gimnasio.

> Nota: ninguna de estas piezas es obligatoria. Lo importante es que cualquier stack elegido soporte **PWA instalable + notificaciones push + cámara del navegador (para QR)**, que son los tres requisitos técnicos no negociables del proyecto.

---

## 3. Modelo de datos (entidades principales)

```
Usuario
  - id, nombre, telefono, correo, rol (alumno | admin)
  - grupo_rh, edad, altura
  - nivel (novato | intermedio | avanzado | modificado), genero
  - fecha_registro, activo

MedidaCorporal   (histórico mensual, 1 usuario -> N medidas)
  - id, usuario_id, fecha, peso_kg, medidas (json: cintura, cadera, brazo, etc.)

Rutina
  - id, nombre, genero, nivel
  - version, fecha_actualizacion

DiaRutina
  - id, rutina_id, nombre_dia (ej. "Lunes - Torso completo"), orden

Ejercicio
  - id, dia_rutina_id, orden, nombre, video_url, series, rango_reps, rir, tempo (opcional)

CheckIn
  - id, usuario_id, fecha_hora, metodo (qr)

Pago
  - id, usuario_id, periodo (ej. "2026-08"), monto, estado (pagado | pendiente | vencido)
  - fecha_pago, referencia_wompi

Notificacion
  - id, usuario_id (null = todos), tipo (cambio_rutina | pago_proximo | promocion), mensaje, fecha, leida

HorarioGimnasio
  - id, dia_semana, hora_inicio, hora_fin, tipo (libre | con_instructor)
```

Esto es un punto de partida — tu socio puede normalizar distinto según el ORM/DB que use.

---

## 4. Fase 1 — Núcleo funcional (construir primero)

**Objetivo:** reemplazar el Excel y resolver el acceso a rutinas + lo mínimo de identidad del alumno.

### Historias de usuario

- Como alumno, veo mi rutina del día según mi nivel y género, con series, reps, RIR y el video de cada ejercicio.
- Como alumno, tengo un perfil con mis datos básicos (nombre, teléfono, correo, grupo RH, edad, altura).
- Como alumno, escaneo un QR al entrar al gimnasio y queda registrada mi entrada.
- Como alumno, veo el horario del gimnasio (libre / con instructor).
- Como instructor, edito y reordeno los ejercicios de una rutina (drag & drop) sin tocar código.
- Como instructor, al publicar un cambio en una rutina, los alumnos de esa rutina reciben notificación automática.

### Notas de implementación

- El **check-in QR** puede ser un único QR fijo pegado en la entrada del gym (el alumno lo escanea con su celular, la app identifica quién es por su sesión) — es más simple que generar un QR único por alumno y evita imprimir/gestionar carnets.
- El **panel de administración** debe sentirse tan rápido como editar una hoja de cálculo: lista reordenable, edición inline, sin formularios de múltiples pasos.
- Las **notificaciones automáticas de cambio de rutina** solo deben llegar a los alumnos que efectivamente usan esa rutina (filtrar por género + nivel).
- Diseñar el modelo de `Rutina` desde el inicio para que **versionar sea barato** (el instructor cambia contenido seguido) — evitar hardcodear rutinas en el frontend.

---

## 5. Fase 2 — Seguimiento y constancia (después de validar Fase 1)

### Historias de usuario

- Como alumno, registro mi peso y medidas corporales una vez al mes, y veo mi historial.
- Como instructor, veo de un vistazo qué alumnos han cumplido su rutina esta semana (a partir de los check-in ya capturados en Fase 1).
- Como administrador, envío notificaciones de promociones o membresías cuando lo decida.

### Notas de implementación

- El registro de medidas corporales toca datos sensibles — ver sección 7 (cumplimiento legal) antes de construir esto.
- "Cumplimiento semanal" se puede calcular simplemente contando check-in por semana vs. días de rutina asignados — no requiere lógica compleja para la primera versión.

---

## 6. Fase 3 — Pagos y comunicación externa (al final, con más tiempo de por medio)

### Historias de usuario

- Como alumno, pago mi mensualidad desde la app vía Wompi.
- Como alumno, recibo un aviso (push y/o WhatsApp) 2 días antes de que venza mi mensualidad.
- Como administrador, veo un reporte de quién pagó y quién no cada mes.

### Notas de implementación — leer antes de estimar tiempos

- **Wompi:** requiere cuenta de comercio aprobada (tiene tiempos de aprobación fuera del control del equipo de desarrollo — arrancar ese trámite en paralelo a la Fase 1/2). Usar los webhooks de Wompi para actualizar el estado del pago automáticamente en vez de depender de confirmación manual.
- **WhatsApp:** un número de WhatsApp normal no permite mensajería automática/masiva. Se necesita WhatsApp Business API vía un proveedor (Twilio, 360dialog, u otro BSP oficial de Meta). Tiene costo por mensaje — cotizar esto antes de comprometerlo con el cliente como "incluido".
- Si el costo/tiempo de WhatsApp resulta alto, la alternativa de respaldo es notificación **push dentro de la app** — technically ya la tienen construida desde la Fase 1, así que puede lanzarse como plan B sin bloquear el resto de la fase.

---

## 7. Cumplimiento legal (no técnico, pero bloquea la Fase 2)

La app va a recolectar nombre, teléfono, correo, edad, grupo RH, peso y medidas corporales — esto cae bajo la **Ley de Habeas Data (Ley 1581 de 2012)** en Colombia. Antes de lanzar la recolección de estos datos:

- Confirmar con un abogado la política de tratamiento de datos.
- Implementar una pantalla de consentimiento explícito en el registro del alumno (checkbox, no puede ser opt-out).
- Guardar el consentimiento con fecha, no solo mostrarlo una vez.

Esto no es responsabilidad del desarrollador definirlo solo — que quede como pendiente explícito con el cliente antes de la Fase 2.

---

## 8. Fuera de alcance (por ahora)

Para que el prompt no se preste a "scope creep" mientras se construye: lo siguiente **no** está pedido y no debería implementarse salvo que el cliente lo confirme explícitamente:

- App nativa (iOS/Android en tiendas) — se evalúa después de validar la PWA.
- Múltiples sedes / múltiples gimnasios.
- Marketplace de rutinas o contenido de otros instructores.
- Chat en vivo entre alumno e instructor.

---

## 9. Cómo usar este documento con un asistente de IA

Al pegar este documento como contexto en una herramienta de desarrollo asistido por IA, es útil agregar al final una instrucción como:

> "Estamos en la Fase [1/2/3]. Ayúdame a construir [función específica de esa fase]. Sigue el modelo de datos de la sección 3 y no implementes nada de la sección 8."

Esto mantiene cada sesión de desarrollo enfocada en una sola fase a la vez.
