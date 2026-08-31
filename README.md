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

## Progreso de la versión - v1.1.0
- [x] Creación de grupos
- [x] Añadir tareas a cada grupo independiente
- [x] Sistema toggle de temas Light / Dark

## Futuras versiones **v1.2.0**
- [ ] Implementación de CRUD completo con useReducer para grupos como para tareas
- [ ] Sistema de orden por prioridades
- [ ] Persistencia de datos con LocalStorage

---

## Estructura del proyecto

src/
 ├── components/        # Componentes reutilizables
 │    ├── CreateGroup.tsx
 │    ├── DarkLightTheme.tsx
 │    ├── Footer.tsx
 │    ├── Groupbox.tsx
 │    ├── Header.tsx
 │    ├── TaskGroups.tsx
 ├── context/        # Contexto y provider
 │    ├── ThemeContext.tsx
 │    └── ThemeProvider.tsx
 ├── routes/             # Rutas
 │    └── MyRoutes.ts
 ├── types/             # Contratos TS
 │    └── GroupsForTask.ts
 │    └── ThemeType.ts
 ├── views/             # Vista principal
 │    └── Homepage.tsx
 ├── styles/            # Estilos globales
 │    └── index.css
 │    └── global.css
 ├── App.tsx
 └── main.tsx


### Problemas encontrados: Tailwind v4 

#### Gradiente en modo oscuro

Al implementar el cambio de tema con `ThemeProvider` y `darkMode: "class"`, 
la clase `dark` se aplicaba correctamente en `<html>`, pero **no habia ningún cambio visual**.

#### Causa ⚠️
Tailwind v4.2.4 tiene un parser nuevo que **no compila gradientes arbitrarios** 
(`bg-[linear-gradient(...)]` o `bg-[var(--bg-gradient)]`) como `background-image`.  
Por eso, aunque la clase aparecía en el HTML, nunca se generaba el estilo.

#### Solución 👍
Definir el gradiente como **variable CSS** y aplicarlo con una clase personalizada:

```css
:root {
  --bg-gradient: linear-gradient(to bottom right, #ffecd2, #fcb69f);
}
.dark {
  --bg-gradient: linear-gradient(to bottom right, #1e3c72, #2a5298);
}
.bg-skin {
  background-image: var(--bg-gradient);
}
```

#### Google-Font, el extent.fontFamily ya no genera clases

#### Solucion 👍
Una vez añadido el link en el "index.html" 
Crear una clase en index.css con la regla font-family, por ejemplo
```css
.font-lexend {
  font-family: "Lexend", sans-serif;
}
```
Lo mismo se aplica para los estilos dinamicos, una clase por variable

## Instalación

```bash
git clone https://github.com/JulioPerone/task-manager-react-ts-tailwind.git
cd ToDoList-App
npm install
npm run dev
```

## Licencia
![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)  
Copyright © 2026 Julio Perone
