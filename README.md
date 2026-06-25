# Situ Caregiver Tracking

Mockup funcional de la **Solución 2: detección en tiempo real y respuesta operacional**, propuesta para el caso de producto de Situ sobre anticipación de atrasos o ausencias de cuidadoras a domicilio.

El objetivo del prototipo es mostrar cómo Situ podría conocer el estado real de un turno antes de que el problema escale a la familia, usando hitos operacionales simples: confirmación de inicio de traslado, estimación de llegada, detección de riesgo, comunicación a la familia, gestión de reemplazo, check-in y ficha de inicio/cierre del turno.

## Contexto del caso

Situ entrega servicios de cuidado a domicilio para adultos mayores. El problema planteado ocurre cuando, a primera hora de la mañana, una familia llama porque la cuidadora no llegó. En ese momento existen dos urgencias simultáneas: una familia angustiada por la falta de atención y un equipo de operaciones que debe reaccionar sin haber anticipado el incidente.

El caso identifica cuatro escenarios de origen:

- Ruptura en la cadena de comunicación entre cuidadora, supervisora externa y Situ.
- Aviso entregado, pero sin seguimiento operacional.
- Ausencia sin aviso.
- Atraso significativo, con incertidumbre equivalente a una ausencia mientras no se confirma la llegada.

La interpretación usada para este proyecto es que el desafío principal no es eliminar por completo los atrasos, sino **reducir la incertidumbre operacional** para que Situ pueda actuar antes de que la familia sea quien detecte el problema.

## Solución implementada

La solución elegida es la detección en tiempo real y respuesta operacional. El prototipo simula una experiencia con tres actores y un estado compartido del turno:

- **Cuidadora:** revisa turnos activos, próximos y completados; inicia traslado; comparte una actualización de ubicación simulada; ve el ETA; registra llegada; revisa fichas previas; responde a una eventual rotación; y completa la ficha del turno.
- **Operaciones Situ:** monitorea turnos activos, próximos y calendario; identifica riesgo de atraso; contacta a la familia; envía recordatorios de ubicación; revisa checklist de verificación; gestiona reemplazos completos o parciales; y coordina rotaciones entre cuidadoras cuando no hay respaldo suficiente.
- **Familia:** consulta próximos turnos, ve el ETA del turno activo, reporta que la cuidadora no llegó dentro de la ventana esperada, decide esperar o solicitar reemplazo, responde a rotaciones y revisa o completa fichas de cuidado.

El flujo principal es:

1. La cuidadora ve el turno asignado del día.
2. Confirma el inicio del traslado.
3. En seguimiento, la cuidadora puede compartir ubicación y elegir si la actualización reporta llegada a tiempo o atraso.
4. Si se detecta atraso, el sistema actualiza ETA, estado del turno y riesgo operacional.
5. Operaciones visualiza el turno como caso prioritario, contacta a la familia o envía recordatorio de ubicación.
6. La familia recibe una vista clara del estado, puede esperar, solicitar reemplazo o completar la ficha si la cuidadora va tarde.
7. Operaciones puede asignar reemplazo completo, reemplazo momentáneo o proponer una rotación entre cuidadoras.
8. Si hay rotación, las partes involucradas pueden aceptar o rechazar el cambio desde sus vistas.
9. La cuidadora registra check-in y completa la ficha del turno.

## Alcance del mockup

Este repositorio contiene un prototipo frontend clickeable. No incluye backend real, autenticación, GPS real ni base de datos persistente. Los datos están mockeados y el estado del flujo se guarda localmente en `localStorage` para facilitar la demostración.

El foco está en comunicar la lógica de producto, la experiencia de usuario y la estructura técnica que permitiría evolucionar la solución hacia un producto real.

## Stack técnico

- React 18
- TypeScript
- Vite
- React Router
- Tailwind CSS
- Lucide React
- Vitest
- React Testing Library

## Cómo ejecutar el proyecto

Instalar dependencias:

```bash
npm install
```

Levantar ambiente local:

```bash
npm run dev
```

Ejecutar validaciones:

```bash
npm run typecheck
npm run lint
npm run test
```

Generar build:

```bash
npm run build
```

## Cómo usar el mockup

El mockup está pensado para ser revisado como una demo guiada. Al abrir la aplicación se muestran tres perspectivas: cuidadora, operaciones y familia. Cada una permite ver el mismo problema desde un rol distinto.

Para probar el flujo principal:

1. Entrar como **Caregiver**.
2. Abrir el turno activo desde **Active & upcoming** y presionar **Start trip**.
3. En **Trip in progress**, presionar **Share my location**. Se abre una ventana de control de demo con dos opciones: **Arriving on time**, que mantiene el turno en ruta y el ETA dentro de lo esperado, o **Running late**, que aumenta el ETA, marca el turno como atrasado y notifica a operaciones/familia.
4. Alternativamente, presionar **I'm running late** para forzar el atraso sin abrir el diálogo de ubicación.
5. Entrar como **Operations**. En el tab **Active**, abrir el turno atrasado para revisar ETA, riesgo, checklist de verificación, contacto con familia, recordatorio de ubicación y sugerencias de reemplazo.
6. Entrar como **Family** y abrir el turno activo. La familia puede decidir **Wait**, pedir **Request replacement**, completar la ficha mientras espera o responder a una propuesta de rotación.
7. Desde operaciones, entrar a **Manage replacement**. Ahí se puede asignar un reemplazo de turno completo, asignar un reemplazo momentáneo o proponer una **caregiver rotation** cuando ningún respaldo cubre todo el turno.
8. Volver a **Caregiver** para responder una eventual rotación, registrar llegada en **Check in** y completar la ficha del turno.

En la esquina inferior izquierda hay dos controles de demo:

- **Reset demo state:** vuelve el prototipo a su estado inicial.
- **Simulate delay:** fuerza un atraso sobre el turno activo sin tener que recorrer todo el flujo.

Estos controles existen solo para facilitar la revisión del caso. En una implementación real, el atraso vendría de eventos como falta de confirmación de traslado, ubicación periódica, ETA actualizado o ausencia de check-in dentro de la ventana esperada.

## Recorrido sugerido para evaluar el mockup

Para revisar el caso completo, se recomienda partir en `/`, elegir un actor y recorrer el flujo desde cada perspectiva:

- **Cuidadora:** entrar a `/caregiver`, revisar tabs de turnos activos/próximos y completados, abrir el turno del día, iniciar traslado en `/tracking`, usar el diálogo de **Share my location**, registrar llegada en `/checkin`, responder rotaciones si aparecen y completar la ficha en `/handoff`.
- **Operaciones:** entrar a `/operations`, alternar entre **Active**, **Upcoming** y **Calendar**, abrir un turno, revisar riesgo/checklist, contactar familia, enviar recordatorio, gestionar reemplazo en `/operations/shift/:shiftId/replacement` o proponer rotación en `/operations/shift/:shiftId/swap`.
- **Familia:** entrar a `/family`, abrir el turno activo, revisar ETA y estado, reportar no llegada si está dentro de la ventana previa al turno, decidir si espera o solicita reemplazo, responder una rotación y consultar el historial en `/family/records`.

Esta separación permite evaluar el mismo incidente desde los tres puntos de vista relevantes: quien presta el servicio, quien coordina la operación y quien recibe el cuidado.

## Organización técnica

El proyecto está organizado por responsabilidad, no solo por pantalla:

- **Composición de app:** `src/app` define el router y el montaje general.
- **Pantallas:** `src/pages` contiene las vistas completas por actor y flujo.
- **Componentes reutilizables:** `src/components` agrupa UI base, tarjetas, formularios, feedback y componentes específicos de operaciones.
- **Configuración de dominio:** `src/config` centraliza rutas, constantes operacionales, estados y tokens visuales.
- **Contenido:** `src/content` concentra textos de interfaz para evitar copys duplicados en componentes.
- **Datos mockeados:** `src/data` modela cuidadoras, familias, turnos y fichas históricas.
- **Estado compartido:** `src/hooks` mantiene el estado runtime del turno activo y lo persiste en `localStorage`.
- **Reglas de negocio:** `src/lib` contiene funciones puras para ETA, riesgo, reemplazos, horarios y transiciones.
- **Tipos y pruebas:** `src/types` define el modelo de dominio y los tests viven cerca de la lógica o pantalla que validan.

La lógica de negocio se mantiene fuera de los componentes para que sea fácil de probar y reemplazar por servicios reales más adelante:

- `src/lib/eta.ts`: cálculo de atraso y simulación de ETA.
- `src/lib/risk.ts`: clasificación de riesgo operacional.
- `src/lib/replacements.ts`: ranking de cuidadoras de reemplazo.
- `src/lib/arrivalWindow.ts`: ventana previa al inicio del turno.
- `src/lib/opsState.ts`: estado de triage para operaciones.
- `src/lib/familyDecision.ts`: lectura operacional de la decisión de la familia.
- `src/lib/familyShiftState.ts`: estado visible para la familia.
- `src/lib/schedule.ts`: utilidades horarias.
- `src/lib/shiftState.ts`: transiciones del estado del turno.
- `src/lib/swap.ts`: reglas de aceptación y aplicación de rotaciones.

## Decisiones de producto reflejadas

- La geolocalización se modela como una señal operacional acotada al traslado, no como monitoreo permanente.
- El ETA y el riesgo se calculan respecto del ETA programado, permitiendo detectar desviaciones antes del inicio formal.
- La familia recibe información accionable: esperar, solicitar reemplazo, reportar no llegada, responder una rotación o completar la ficha si la cuidadora va tarde.
- Operaciones ve un tablero de priorización para distinguir turnos normales, pendientes y atrasados, además de tabs de turnos activos, próximos y calendario.
- El reemplazo prioriza cercanía, ETA, disponibilidad y confiabilidad de la cuidadora.
- La cobertura puede ser completa o momentánea; si queda una franja sin cubrir, operaciones puede reasignar a la cuidadora original para el tramo restante.
- La rotación entre cuidadoras exige aceptación de las partes involucradas antes de aplicarse, resguardando continuidad y consentimiento.
- La ficha de traspaso busca continuidad del cuidado, inspirada en prácticas de entrega de turno en salud, y puede ser completada por la cuidadora o por la familia cuando el atraso afecta el inicio.

## Arquitectura sugerida para producción

El prototipo actual es frontend-only. Para una versión productiva, la arquitectura sugerida sería:

```txt
Aplicación cuidadora web/mobile
        |
        | inicio de traslado, ubicación periódica, check-in, ficha
        v
API Gateway / Backend BFF
        |
        +--> Servicio de turnos
        +--> Servicio de tracking y ETA
        +--> Servicio de alertas operacionales
        +--> Servicio de reemplazos y rotaciones
        +--> Servicio de notificaciones
        +--> Servicio de fichas clínicas/operacionales
        |
        v
Base de datos transaccional
        |
        +--> Historial operacional
        +--> Eventos de ubicación acotados al turno
        +--> Auditoría de decisiones y comunicaciones

Dashboard operaciones web
        |
        v
Cola de eventos / workers
        |
        +--> cálculo de riesgo
        +--> envío de WhatsApp/SMS/email/push
        +--> actualización de ETA
        +--> generación de alertas

Vista familia web/mobile
```

Componentes recomendados:

- **Frontend cuidadora:** iniciar traslado, compartir ubicación durante el trayecto, registrar llegada y completar ficha.
- **Frontend familia:** consultar ETA, recibir avisos de atraso y decidir continuidad del servicio.
- **Dashboard operaciones:** monitoreo en tiempo real, priorización de incidentes y gestión de reemplazos.
- **Backend BFF:** capa orientada a casos de uso de frontend, con autorización por rol.
- **Servicio de tracking:** recibe ubicaciones periódicas, calcula ETA y corta el tracking al registrar llegada.
- **Servicio de alertas:** transforma eventos de riesgo en acciones para operaciones y familia.
- **Servicio de reemplazos y rotaciones:** rankea cuidadoras disponibles según ETA, distancia, disponibilidad, certificaciones y continuidad; también coordina propuestas de intercambio entre turnos.
- **Base de datos relacional:** fuente transaccional para turnos, actores, fichas y auditoría.
- **Cola de eventos:** desacopla notificaciones, cálculo de riesgo y procesos de auditoría.

## Esquema sugerido de base de datos

El prototipo no usa base de datos, pero este sería un esquema inicial para soportar la solución en producción.

```sql
CREATE TABLE users (
  id UUID PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT UNIQUE,
  phone TEXT,
  role TEXT NOT NULL CHECK (role IN ('caregiver', 'family', 'operations', 'supervisor')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE caregivers (
  id UUID PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES users(id),
  external_company_id UUID,
  reliability_score NUMERIC(4,3),
  home_latitude NUMERIC(10,7),
  home_longitude NUMERIC(10,7),
  active BOOLEAN NOT NULL DEFAULT true
);

CREATE TABLE families (
  id UUID PRIMARY KEY,
  primary_user_id UUID NOT NULL REFERENCES users(id),
  display_name TEXT NOT NULL,
  address TEXT NOT NULL,
  latitude NUMERIC(10,7),
  longitude NUMERIC(10,7),
  notes TEXT
);

CREATE TABLE older_adults (
  id UUID PRIMARY KEY,
  family_id UUID NOT NULL REFERENCES families(id),
  name TEXT NOT NULL,
  care_notes TEXT,
  continuity_required BOOLEAN NOT NULL DEFAULT false
);

CREATE TABLE shifts (
  id UUID PRIMARY KEY,
  caregiver_id UUID NOT NULL REFERENCES caregivers(id),
  family_id UUID NOT NULL REFERENCES families(id),
  older_adult_id UUID NOT NULL REFERENCES older_adults(id),
  starts_at TIMESTAMPTZ NOT NULL,
  ends_at TIMESTAMPTZ NOT NULL,
  status TEXT NOT NULL CHECK (
    status IN (
      'scheduled',
      'trip_started',
      'delay_detected',
      'replacement_requested',
      'replacement_assigned',
      'cancelled',
      'arrived',
      'shift_started',
      'completed'
    )
  ),
  scheduled_eta_minutes INTEGER,
  current_eta_minutes INTEGER,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE shift_location_events (
  id UUID PRIMARY KEY,
  shift_id UUID NOT NULL REFERENCES shifts(id),
  caregiver_id UUID NOT NULL REFERENCES caregivers(id),
  latitude NUMERIC(10,7) NOT NULL,
  longitude NUMERIC(10,7) NOT NULL,
  eta_minutes INTEGER,
  distance_km NUMERIC(6,2),
  captured_at TIMESTAMPTZ NOT NULL,
  source TEXT NOT NULL CHECK (source IN ('trip_start', 'periodic_update', 'check_in'))
);

CREATE TABLE shift_risk_events (
  id UUID PRIMARY KEY,
  shift_id UUID NOT NULL REFERENCES shifts(id),
  risk_level TEXT NOT NULL CHECK (risk_level IN ('low', 'medium', 'high')),
  delay_minutes INTEGER NOT NULL,
  reason TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE replacement_requests (
  id UUID PRIMARY KEY,
  shift_id UUID NOT NULL REFERENCES shifts(id),
  requested_by UUID REFERENCES users(id),
  status TEXT NOT NULL CHECK (status IN ('open', 'accepted', 'rejected', 'cancelled')),
  replacement_type TEXT NOT NULL CHECK (replacement_type IN ('full', 'momentary')),
  assigned_caregiver_id UUID REFERENCES caregivers(id),
  covered_until TIMESTAMPTZ,
  original_reassigned BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE replacement_candidates (
  id UUID PRIMARY KEY,
  request_id UUID NOT NULL REFERENCES replacement_requests(id),
  caregiver_id UUID NOT NULL REFERENCES caregivers(id),
  eta_minutes INTEGER NOT NULL,
  distance_km NUMERIC(6,2),
  reliability_score NUMERIC(4,3),
  ranking_score NUMERIC(8,3),
  accepted_at TIMESTAMPTZ
);

CREATE TABLE caregiver_rotation_proposals (
  id UUID PRIMARY KEY,
  at_risk_shift_id UUID NOT NULL REFERENCES shifts(id),
  donor_shift_id UUID NOT NULL REFERENCES shifts(id),
  delayed_caregiver_id UUID NOT NULL REFERENCES caregivers(id),
  donor_caregiver_id UUID NOT NULL REFERENCES caregivers(id),
  affected_family_id UUID NOT NULL REFERENCES families(id),
  donor_family_id UUID NOT NULL REFERENCES families(id),
  status TEXT NOT NULL CHECK (status IN ('proposed', 'accepted', 'rejected', 'applied')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  resolved_at TIMESTAMPTZ
);

CREATE TABLE caregiver_rotation_decisions (
  id UUID PRIMARY KEY,
  proposal_id UUID NOT NULL REFERENCES caregiver_rotation_proposals(id),
  role TEXT NOT NULL CHECK (role IN ('delayed_caregiver', 'donor_caregiver', 'affected_family', 'donor_family')),
  decided_by UUID REFERENCES users(id),
  decision TEXT NOT NULL CHECK (decision IN ('pending', 'accepted', 'rejected')),
  decided_at TIMESTAMPTZ
);

CREATE TABLE handoff_records (
  id UUID PRIMARY KEY,
  shift_id UUID NOT NULL REFERENCES shifts(id),
  recorded_by UUID NOT NULL REFERENCES users(id),
  sleep_quality TEXT,
  mood TEXT,
  medication_changes TEXT,
  recent_events TEXT,
  notes TEXT,
  recorded_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE notifications (
  id UUID PRIMARY KEY,
  shift_id UUID REFERENCES shifts(id),
  recipient_user_id UUID NOT NULL REFERENCES users(id),
  channel TEXT NOT NULL CHECK (channel IN ('push', 'whatsapp', 'sms', 'email')),
  type TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('pending', 'sent', 'failed', 'read')),
  payload JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  sent_at TIMESTAMPTZ
);

CREATE TABLE audit_events (
  id UUID PRIMARY KEY,
  actor_user_id UUID REFERENCES users(id),
  entity_type TEXT NOT NULL,
  entity_id UUID NOT NULL,
  action TEXT NOT NULL,
  metadata JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
```

Relaciones principales:

- Una familia puede tener uno o más adultos mayores.
- Un turno vincula cuidadora, familia y adulto mayor.
- Un turno puede tener múltiples eventos de ubicación hasta el check-in.
- Un turno puede generar múltiples eventos de riesgo.
- Un turno puede abrir una solicitud de reemplazo con varias candidatas rankeadas.
- Un turno con riesgo puede abrir una propuesta de rotación entre dos cuidadoras, aplicable solo si las cuatro partes aceptan.
- Las fichas de traspaso quedan asociadas al turno para historial de continuidad del cuidado.
- Las notificaciones y eventos de auditoría permiten trazabilidad frente a decisiones sensibles.

## Consideraciones de privacidad y operación

- La ubicación debe solicitarse solo durante el traslado y detenerse al registrar llegada.
- La familia debe ver información útil sin exponer datos innecesarios de la cuidadora.
- El historial de ETA, check-in y reemplazos debe ser auditable.
- La ficha de cuidado contiene información sensible y requiere controles de acceso por rol.
- La reasignación debe considerar continuidad del vínculo cuando el adulto mayor lo requiera.

## Estado actual

El proyecto cubre el flujo principal de la Solución 2 con datos mockeados, pantallas por actor, reglas de negocio testeables y estructura preparada para evolucionar hacia una implementación real.
