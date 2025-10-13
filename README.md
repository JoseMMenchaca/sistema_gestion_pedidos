# README — Sistema de Gestión de Pedidos (FastExpress)

> \*\*Resumen:\*\* Documento que describe el \*\*flujo de trabajo\*\*, convenciones y procesos de gestión de la configuración para el proyecto \*Sistema de Gestión de Pedidos — FastExpress\*. Basado en el Plan de GCS (`DOC-PLAN-GCS-V1.0.0`). fileciteturn0file0

---

## Índice

* [Descripción del proyecto](#descripción-del-proyecto)
* [Estructura del repositorio](#estructura-del-repositorio)
* [Modelo de ramas (GitFlow)](#modelo-de-ramas-gitflow)
* [Rama de pruebas (test)](#rama-de-pruebas-test)
* [Flujo de trabajo paso a paso](#flujo-de-trabajo-paso-a-paso)
* [Hotfixes](#hotfixes)
* [Convención de commits](#convención-de-commits)
* [Ítems de Configuración (IC) — codificación](#ítems-de-configuración-ic--codificación)
* [Proceso de control de cambios (RFC)](#proceso-de-control-de-cambios-rfc)
* [Roles y responsabilidades](#roles-y-responsabilidades)
* [Trazabilidad, pruebas y auditoría](#trazabilidad-pruebas-y-auditoría)
* [Cómo contribuir — Pull Request checklist](#cómo-contribuir--pull-request-checklist)
* [Buenas prácticas y advertencias](#buenas-prácticas-y-advertencias)
* [Referencias](#referencias)

---

# Descripción del proyecto

Aplicación web para la gestión de pedidos de comida rápida (FastExpress) con módulos principales: **Pedidos**, **Administración** y **Reportes**. El proyecto incluye backend (Node.js/Express), frontend (React + TypeScript), y artefactos auxiliares (scripts de BD, configuración, pruebas). El Plan de GCS define cómo versionar, auditar y controlar todos los artefactos del proyecto. fileciteturn0file0

---

# Estructura del repositorio

Estructura recomendada:

```
Sistema-Gestion-Pedidos/
│
├── 01-Documentacion/
├── 02-CodigoFuente/
│   ├── backend/
│   └── frontend/
├── 03-BaseDeDatos/
│   ├── scripts/
│   └── backups/
├── 04-Configuracion/
└── 05-Pruebas/
    └── jest/                  # pruebas unitarias e integración escritas con JEST
```

Cada carpeta debe contener Ítems de Configuración (IC) con la codificación establecida en el Plan de GCS. fileciteturn0file0

---

# Modelo de ramas (GitFlow)

Ramas principales:

* `main` — versiones liberadas y estables.
* `develop` — integración para la próxima versión.

Ramas de soporte:

* `feature/<nombre>` — nuevas funcionalidades (parte desde `develop`).
* `release/vX.Y.Z` — estabilización previa al release.
* `hotfix/<nombre>` — correcciones urgentes desde `main`.
* `test` — rama centralizada donde se disponen y mantienen las pruebas automatizadas (JEST).

**Regla:** no hacer commits directos a `main`, `develop` o `test` sin PR y revisión. fileciteturn0file0

---

# Rama de pruebas (test)

La rama `test` se utiliza exclusivamente para albergar, revisar y ejecutar las pruebas automatizadas escritas con **JEST**. Su propósito es centralizar el desarrollo de pruebas y la integración continua de la suite de tests antes de propagar cambios a `develop` o `main`.

### Ubicación de las pruebas

* El código de pruebas se encuentra junto al código fuente en `02-CodigoFuente/backend/tests/`.
* Se encuentra disponible al ingresar a la rama de test.

### Flujo recomendado para pruebas

1. Crear una rama temporal de trabajo a partir de `test`:

```bash
   git checkout test
   git pull origin test
   git checkout -b test/feature-<nombre>-tests
   ```

2. Añadir o actualizar tests (ubicarlos junto al código correspondiente).
3. Ejecutar tests localmente (ver "Ejecutar JEST" más abajo).
4. Hacer commits atómicos con la convención de commits.
5. Push y abrir Pull Request **hacia la rama `test`** para revisión:

   * El PR disparará el pipeline de CI que ejecuta JEST y genera reportes de coverage.
   * Revisores: equipo de QA + responsables del módulo.

6. Al aprobarse y pasar CI, merge `test` → `develop` (merge sin fast-forward recomendado) para incorporar tests y, si procede, merge `test` → `main` sólo en casos excepcionales (hotfixes que requieren pruebas en producción).

### Política de protecciones

* Se recomienda proteger la rama `test` (branch protection) para requerir:

  * Revisiones aprobadas (mínimo 1-2 revisores).
  * Pipeline CI exitoso (JEST passing + coverage mínimo si aplica).
  * No permitir `force-push` ni commits directos.

---

# Flujo de trabajo paso a paso

## 1\) Crear una nueva funcionalidad (feature)

```bash
git checkout develop
git pull origin develop
git checkout -b feature/nombre-descriptivo
# desarrollar, agregar tests y documentación
git add .
git commit -m "feat(productos): descripción breve @autor"
git push -u origin feature/nombre-descriptivo
# abrir PR -> objetivo: develop (o test si el cambio es mayormente de pruebas)
```

* Si el cambio incluye nuevas pruebas o modificaciones en la suite, abrir PR hacia `test` primero (seguir el flujo de la sección "Rama de pruebas").

## 2\) Preparar una release

```bash
git checkout -b release/v1.0.0 develop
# corregir bugs, actualizar package.json/version, pruebas completas
git checkout main
git merge --no-ff release/v1.0.0
git tag -a v1.0.0 -m "Release v1.0.0"
git push origin main --tags

git checkout develop
git merge --no-ff release/v1.0.0
git push origin develop
```

---

# Hotfixes

Cuando hay un defecto crítico en producción:

```bash
git checkout -b hotfix/fix-urgent main
# corregir, testear
git checkout main
git merge --no-ff hotfix/fix-urgent
git tag -a v1.0.1 -m "Hotfix v1.0.1"
git push origin main --tags

git checkout develop
git merge --no-ff hotfix/fix-urgent
git push origin develop
```

Si el hotfix requiere nuevas pruebas, cree primero un branch desde `test` para implementarlas y seguir el flujo de integración de pruebas. Documentar siempre el hotfix en la matriz de trazabilidad. fileciteturn0file0

---

# Ejecutar JEST (local)

Instrucciones básicas para ejecutar la suite JEST localmente desde la raíz del proyecto:

1. Instalar dependencias:

```bash
npm ci
```

2. Ejecutar tests:

```bash
npm test
# o directamente
npx jest --coverage
```

3. Ver reportes de coverage en `coverage/` generados por JEST.

Asegúrate de que las pruebas pasen localmente antes de abrir PRs hacia `test` o `develop`.

---

# Convención de commits

Se adopta **Conventional Commits** (adaptado):

```
<tipo>(<ámbito>): <descripción> \[@autor]
\[cuerpo opcional]
\[footer opcional]
```

Tipos usados: `feat`, `fix`, `refactor`, `docs`, `test`, `chore`.

Ejemplos:

```
feat(productos): agregar endpoint para listar productos activos @jmenchaca
fix(carrito): corregir duplicado en cálculo del total @rcasilla
test(auth): agregar pruebas unitarias para login @qa-team
```

Regla: commits atómicos y descriptivos.

---

# Ítems de Configuración (IC) — codificación

Formato recomendado: `<CATEGORÍA>-<NOMBRE>-V<versión>`

Categorías: `DOC`, `SRC`, `DB`, `CFG`, `TST`, `DPL`.

Ejemplos:

* `DOC-PLAN-GCS-V1.0.0` — Plan de GCS.
* `SRC-BACKEND-V1.0.0` — Código backend.
* `DB-SCRIPT-INIT-V1.0.0` — Script BD inicial.
* `TST-JEST-SUITE-V1.0.0` — Suite de pruebas JEST. fileciteturn0file0

---

# Proceso de control de cambios (RFC)

1. **Creación RFC:** completar formulario con ID, título, descripción y justificación.
2. **Evaluación técnica:** revisar impacto en código, pruebas y despliegue.
3. **Decisión CCB:** aprobar / solicitar cambios / denegar.
4. **Implementación:** responsable asignado ejecuta cambios y adjunta evidencia (commits, PRs, resultados de pruebas).
5. **Cierre:** registrar evidencia en el RFC y actualizar la matriz de trazabilidad. fileciteturn0file0

---

# Roles y responsabilidades

* **Administrador de configuración:** aplica el Plan de GCS, gestiona líneas base y versiones.
* **Desarrolladores:** código, tests y documentación.
* **QA / Equipo de pruebas:** desarrolla, revisa y mantiene pruebas JEST en la rama `test`.
* **Auditor:** verifica trazabilidad y cumplimiento.
* **Comité CCB:** aprueba RFCs.

(Ejemplos de nombramientos y responsabilidades en el Plan de GCS). fileciteturn0file0

---

# Trazabilidad, pruebas y auditoría

* Mantener matriz que relacione Requisitos → Commits → Tests → Releases.
* Ejecutar tests (unitarios + integración) antes de merges a `develop`/`main`.
* RFCs deben incluir evidencia (logs, capturas, resultados de CI).
* Auditorías periódicas con registro de hallazgos y acciones correctivas.
* La rama `test` facilita auditoría y control de la calidad al centralizar la suite JEST. fileciteturn0file0

---

# Cómo contribuir — Pull Request checklist

Antes del PR asegúrate de:

* \[ ] Rama basada en `develop` (features) o `main` (hotfixes) — o en `test` para cambios de pruebas.
* \[ ] Tests automatizados que cubran los cambios (si aplica).
* \[ ] PR con título claro, descripción y referencia a issue/RFC si aplica.
* \[ ] Commits atómicos y siguiendo la convención.
* \[ ] Ejecutaste `npm test` / scripts de CI localmente.
* \[ ] Documentación actualizada en `01-Documentacion/` y/o `05-Pruebas/` si corresponde.

---

# Buenas prácticas y advertencias

* Evitar commits directos a `develop`/`main`/`test`.
* Comunicar y justificar cualquier `git push --force`.
* Mantener `.env` fuera del repo; versionar `.env.example` en `04-Configuracion/`.
* Usar `git merge --no-ff` para preservar el contexto de features. fileciteturn0file0

---

# Referencias

* Plan de Gestión de la Configuración — `DOC-PLAN-GCS-V1.0.0`. fileciteturn0file0

---

