# X-clone-RN 🐦

## 🚀 Descripción del Proyecto

**X-clone-RN** es un clon de la popular red social **X** (anteriormente conocida como Twitter) implementado como una aplicación móvil utilizando la tecnología **React Native**.

Este proyecto Full-Stack está diseñado para simular las funcionalidades principales de la plataforma, como la publicación de mensajes cortos (posts o "X's"), la gestión de perfiles de usuario, y la navegación a través de un *feed* principal. El repositorio se divide en dos partes principales: el frontend móvil (`mobile`) y el backend de la API (`backend`).

---

## ✨ Características Principales

* **Autenticación de Usuarios:** Registro e inicio de sesión seguro.
* **Publicación de Contenido:** Crear, visualizar y eliminar posts ("X's").
* **Feed Personalizado:** Vista principal con los posts de usuarios seguidos (se puede añadir al desarrollar el feature).
* **Perfiles de Usuario:** Visualización de información del usuario y su historial de posts.
* **Navegación Intuitiva:** Interfaz de usuario inspirada en la aplicación oficial.

---

## 🛠️ Stack Tecnológico

El proyecto está construido sobre un stack moderno y eficiente:

### Frontend (Mobile)
| Herramienta | Descripción |
| :--- | :--- |
| **React Native** | Framework para el desarrollo de aplicaciones móviles multiplataforma (iOS y Android). |
| **JavaScript** | Lenguaje principal de desarrollo. |
| **Expo** | (Inferencia) Utilizado para el entorno de desarrollo, testeo y *bundling* de la aplicación móvil. |
| **React Navigation** | Gestión del enrutamiento y la navegación entre pantallas. |

### Backend (API)
| Herramienta | Descripción |
| :--- | :--- |
| **Node.js** | Entorno de ejecución para el servidor. |
| **Express.js** | (Inferencia) Framework web rápido y minimalista para la API. |
| **Base de Datos** | MongoDB |

---

## ⚙️ Configuración e Instalación

Sigue estos pasos para levantar el proyecto en tu entorno de desarrollo local.

### 1. Clonar el Repositorio


```bash
git clone [https://github.com/joacko22/X-clone-RN.git](https://github.com/joacko22/X-clone-RN.git)
cd X-clone-RN
2. Configurar el Backend
Navega a la carpeta del backend:
```
Bash

cd backend
Instala las dependencias:

Bash

npm install # o yarn install
Configuración de Variables de Entorno (.env): Crea un archivo llamado .env en la raíz de la carpeta backend y añade las variables necesarias (ej: PORT, DATABASE_URL, JWT_SECRET).

Inicia el servidor:

Bash

npm start # o el comando de inicio que uses, ej: npm run dev
3. Configurar la Aplicación Móvil
Navega a la carpeta de la aplicación móvil:

Bash

cd ../mobile
Instala las dependencias:

Bash

npm install # o yarn install
Ajusta la URL del Backend: Debes asegurarte de que la aplicación móvil apunte a la URL correcta de tu backend local (ej: http://192.168.x.x:3000).

Inicia la aplicación (usando Expo o CLI de React Native):

Bash

npx expo start # o npx react-native run-android/run-ios
Escanea el código QR con la aplicación Expo Go en tu teléfono o utiliza un emulador.
