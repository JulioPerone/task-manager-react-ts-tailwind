# ToDo List Evolution

App para gestion de tareas que muestra su evolución a través de distintas versiones, integrando tecnologías modernas y generación/adaptación de código con IA

---

## Capturas

### Modo Claro

![Modo claro](./src/assets/Screenshot%20Task-Manager1.1%20Theme%20light.png)

### Modo Oscuro

![Modo oscuro](./src/assets/Screenshot%20Task-Manager1.1%20Theme%20dark.png)



## Tecnologías utilizadas
- Excalidraw → planificación visual de la idea
- React + TypeScript → base del frontend
- Tailwind CSS → estilos rápidos y consistentes
- IA → generación y adaptación de código

![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-38B2AC?style=for-the-badge&logo=tailwindcss&logoColor=white)

---

## Instalación y uso

```bash
git clone https://github.com/JulioPerone/task-manager-react-ts-tailwind.git
cd ToDoList-App
npm install
npm run dev
```

### Cómo usar
1. Crea grupos y añade tareas a cada grupo
2. **Exportar plantilla (CSV)** → se descarga y la editas en Excel, LibreOffice Calc o Google Sheets
3. **Importar planilla (CSV)** → restaura o migra todos tus grupos de una vez

---

### Click y empieza a organizar tu dia!
https://task-manager-react-ts-tailwind.vercel.app

## Progreso de la versión - v1.1.0
- [x] Creación de grupos
- [x] Añadir tareas a cada grupo independiente
- [x] Sistema toggle de temas Light / Dark

## Versión actual - v1.2.0
**Gestión modular de grupos, ahora puedes exportar e importar todos tus grupos**

- [x] CRUD completo con useReducer para grupos y tareas
- [x] Persistencia de datos con LocalStorage
- [x] Exportar todos los grupos y tareas a plantilla CSV (compatible con Excel, LibreOffice Calc y Google Sheets)
- [x] Importar planilla CSV para restaurar o migrar todos tus grupos de una vez

## Roadmap - v1.3.0
- [ ] **Filtro por prioridad:** filtrado independiente por grupo para visualizar únicamente las tareas con el nivel de prioridad seleccionado (`low`, `medium`, `high`, `very important`).
- [ ] **Papelera y archivados:** nueva vista / submenú con el historial de grupos y tareas eliminadas, con opción de restaurar elementos individuales o vaciado definitivo.
- [ ] **Reordenar con drag & drop:** reorganizar tareas dentro del mismo grupo y moverlas entre grupos mediante arrastre.
- [ ] **Notificaciones locales / PWA:** recordatorios en el dispositivo y soporte instalable offline como paso previo a la nube.
- [ ] **Recordatorios y calendario con Google:** inicio de sesión con Google para asignación de fecha y hora límite por tarea, con notificaciones por email e integración con Google Calendar.

---

### 🧱 Estructura del proyecto

```bash
src/
├── assets/ # Imágenes y capturas
│   ├── Screenshot Task-Manager1.1 Theme dark.png
│   ├── Screenshot Task-Manager1.1 Theme light.png
├── components/ # Componentes reutilizables
│   ├── DarkLightTheme.tsx
│   ├── DataControls.tsx
│   ├── Footer.tsx
│   ├── Groupbox.tsx
│   ├── GroupManager.tsx
│   ├── Header.tsx
│   ├── TaskItem.tsx
│   ├── TaskManager.tsx
│   ├── TaskMenu.tsx
├── context/ # Contexto y providers
│   ├── TasksContext.tsx
│   ├── TasksProvider.tsx
│   ├── ThemeContext.tsx
│   ├── ThemeProvider.tsx
├── hooks/ # Hooks personalizados con useReducer
│   ├── useGroupsReducer.ts
│   ├── useTasksReducer.ts
├── routes/ # Rutas
│   ├── MyRoutes.tsx
├── types/ # Contratos TS
│   ├── contracts.ts
│   ├── ThemeType.ts
├── utils/ # Utilidades (persistencia y CSV)
│   ├── csv.ts
│   ├── storage.ts
├── views/ # Vista principal
│   ├── Homepage.tsx
├── App.tsx
├── main.tsx
├── index.css
├── globals.css
```

---

## Licencia
![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)  
Copyright © 2026 Julio Perone
