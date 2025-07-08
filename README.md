# **Eventify Frontend Web Application**

**Summary**

Eventify Frontend is a modern web application for event management and ticket booking, built with Vue 3 and Vite. The application provides a comprehensive platform for users to discover, register, and manage events with an intuitive user interface and seamless user experience.

## **Features**

The application includes the following features:

* **Modern Vue 3 Framework** with Composition API
* **Fast Development** with Vite build tool
* **Responsive Design** optimized for all devices
* **Event Management** - Browse, search, and filter events
* **User Authentication** - Secure login and registration system (IAM)
* **Ticket Booking** - Streamlined event registration and ticket purchasing
* **Real-time Updates** - Dynamic content updates
* **Interactive UI Components** - Modern and accessible user interface
* **State Management** - Centralized application state handling
* **Routing** - Single Page Application (SPA) navigation
* **API Integration** - RESTful backend communication

## **Documentation**

The project follows modern development practices and includes comprehensive documentation:

* **Component Structure**: Reusable Vue components following best practices
* **Feature Branch Development**: Current development on `feature/iam` branch for Identity and Access Management
* **Modern Architecture**: Component-based architecture with clear separation of concerns
* **Development Guidelines**: Code standards and contribution guidelines

## **Framework and Dependencies**

The application is built with Vue 3 and modern web technologies:

* **Vue 3** (https://vuejs.org/) - Progressive JavaScript framework
* **Vite** (https://vitejs.dev/) - Next generation frontend tooling
* **Vue Router** (https://router.vuejs.org/) - Official router for Vue.js
* **Axios** (https://axios-http.com/) - Promise-based HTTP client
* **Pinia** (https://pinia.vuejs.org/) - State management library
* **TypeScript** (Optional) - Type-safe JavaScript development

## **Getting Started**

### **Prerequisites**

Before you begin, ensure you have the following installed:
- Node.js (version 16.0 or higher)
- npm or yarn package manager

### **Installation**

1. **Clone the repository**
   ```bash
   git clone https://github.com/AngelDevs-Web/eventify-front-end.git
   cd eventify-front-end
   ```

2. **Switch to the feature branch**
   ```bash
   git checkout feature/iam
   ```

3. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

4. **Environment Setup**
   ```bash
   cp .env.example .env.local
   ```
   Update the environment variables in `.env.local` with your configuration.

### **Development Server**

Start the development server with hot module replacement:

```bash
npm run dev
# or
yarn dev
```

The application will be available at `http://localhost:5173`

### **Building for Production**

Create an optimized production build:

```bash
npm run build
# or
yarn build
```

### **Preview Production Build**

Preview the production build locally:

```bash
npm run preview
# or
yarn preview
```

## **Available Scripts**

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run test` - Run unit tests

## **Contributing**

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## **Development Guidelines**

- Follow Vue 3 Composition API best practices
- Use TypeScript for type safety (if applicable)
- Maintain consistent code formatting with ESLint and Prettier
- Write unit tests for components and utilities
- Follow semantic commit message conventions

## **Support**

For support and questions:
- Create an issue in the GitHub repository
- Contact the development team at AngelDevs-Web

## **Authors**

This project is maintained by the AngelDevs-Web team and contributors:

|            **Alumno**            | **Codigo** |
|:--------------------------------:|:----------:|
| Fabrizio Alexander Cutiri Agüero | U201914181 |
| Omar Christian Berrocal Ramirez  | U20201B529 |
|  Deybbi Anderson Crisanto Calle  | U202120569 |
|   July Zelmira Paico Calderon    | U20211D760 |
|     Jean Pierr Aldave Aldave     | U202120005 |

---

**Built with ❤️ by AngelDevs-Web Team**