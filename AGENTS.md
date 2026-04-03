# Reglas y Habilidades para Agentes de IA en este Repositorio

Bienvenido/a agente de Inteligencia Artificial que colabora en este proyecto. Lee y cumple con este documento como si fuesen tus reglas base de comportamiento cada vez que te soliciten tareas en este repositorio.

## 1. Habilidades y Flujos de Trabajo ("Skills y Workflows")
- Este repositorio cuenta con habilidades documentadas explícitamente en el directorio `.agents/skills/`.
- Siempre que el usuario solicite algo relacionado con estos temas, DEBES utilizar la herramienta `view_file` para leer el archivo `SKILL.md` (o `llms.txt`) relevante ANTES de escribir código.
- **GSAP Animations**: Tenemos las habilidades oficiales de GSAP en `.agents/skills/gsap-*`. Úsalas como la opción predeterminada siempre que se soliciten animaciones complejas, efectos de scroll o experiencias visuales de alta calidad. No uses CSS puro para timelines o animaciones avanzadas en frameworks de React/Vue a menos que se te indique explícitamente. Recuerda importar y configurar correctamente `useGSAP()` o los contextos de `.context()`.
- Revisa regularmente si existen nuevos flujos en `.agents/workflows/` (si aplica) para desplegar, compilar o seguir una metodología definida para los commits.

## 2. Tecnologías Principales y Estilo
- **Web App**: Este es un proyecto de interfaz web. Mantén el uso de buenas prácticas semánticas (`HTML5`), accesibilidad básica y **TypeScript** estricto si el proyecto es TS/TSX.
- **Aesthetics (Estética)**: La visual tiene un enfoque específico (usualmente mencionado como Techno/Cyber o Dark Futuristic). NO ofrezcas soluciones genéricas de MVP; busca siempre que la calidad visual sea premium, priorizando animaciones fluidas, paletas curadas y alto contraste.

## 3. Instrucciones Operativas
- **No rompas el código existente**. Cuando modifiques un archivo, utiliza correctamente las herramientas de reemplazo de contenido asegurándote de no dañar variables o imports que estén funcionado de manera paralela.
- **Planea lo complejo**: Si la tarea solicita rediseños completos, interacciones complejas o una arquitectura nueva, haz un plan utilizando artefactos (modo planificación) para que el desarrollador principal (el usuario) entienda y apruebe las tecnologías involucradas.
- **Consola limpia**: Asegúrate de que las implementaciones no arrojen "warnings" de ciclo de vida (como los típicos missing dependency array en React para efectos) o errores en el navegador.

Sigue estas reglas para preservar el enfoque premium, animado, limpio y libre de errores de este desarrollo.
