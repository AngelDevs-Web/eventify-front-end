import { createRouter, createWebHistory } from "vue-router";

// Public pages (existing components)
import HomeComponent from "../public/pages/home.component.vue"
import CalendarViewComponent from "../events/pages/calendar-view.component.vue";
import QuoteOrderManagementComponent from "../quote-management/pages/quote-order-management.component.vue";
import ProfileComponent from "../public/pages/profile.component.vue";
import taskBoardComponent from "../task-management/components/task-board.component.vue";
import EventPageComponent from "../event-management/pages/event-page.component.vue";
import SocialEventscomponent from "../event-management/pages/event-page.component.vue";

// IAM Components - Lazy loaded for performance
const SignInComponent = () => import('../iam/pages/sign-in.component.vue');
const SignUpComponent = () => import('../iam/pages/sign-up.component.vue');

// Other lazy loaded components (existing)
const TaskManagementComponent = () => import('../task-management/pages/task-management.component.vue');

// IAM Services
import { useAuthenticationStore } from "../iam/services/authentication.store.js";

// Authentication Guard Function
const authenticationGuard = (to, from, next) => {
    const authStore = useAuthenticationStore();

    // Check if route requires authentication
    if (to.meta.requiresAuth && !authStore.isLoggedIn) {
        // Redirect to sign-in if not authenticated
        next({
            name: 'SignIn',
            query: { redirect: to.fullPath } // Save intended destination
        });
    }
    // Check if route is only for guests (login/register pages)
    else if (to.meta.requiresGuest && authStore.isLoggedIn) {
        // Redirect to home if already authenticated
        next({ name: 'Home' });
    }
    else {
        // Proceed normally
        next();
    }
};

const routes = [
    // ==============================
    // IAM ROUTES (Authentication)
    // ==============================
    {
        path: '/iam',
        name: 'IAM',
        redirect: '/iam/sign-in',
        meta: {
            title: 'IAM',
            hideFromNavigation: true
        }
    },
    {
        path: '/iam/sign-in',
        name: 'SignIn',
        component: SignInComponent,
        meta: {
            title: 'Iniciar Sesión',
            requiresGuest: true,
            layout: 'auth'
        },
        beforeEnter: authenticationGuard
    },
    {
        path: '/iam/sign-up',
        name: 'SignUp',
        component: SignUpComponent,
        meta: {
            title: 'Crear Cuenta',
            requiresGuest: true,
            layout: 'auth'
        },
        beforeEnter: authenticationGuard
    },

    // ==============================
    // PUBLIC ROUTES (No auth required)
    // ==============================
    {
        path: '/home',
        name: 'Home',
        component: HomeComponent,
        meta: {
            title: 'Home',
            public: true
        }
    },

    // ==============================
    // PROTECTED ROUTES (Auth required)
    // ==============================
    {
        path: '/calendar',
        name: 'CalendarView',
        component: CalendarViewComponent,
        meta: {
            title: 'Calendar',
            requiresAuth: true,
            icon: 'CalendarIcon'
        },
        beforeEnter: authenticationGuard
    },
    {
        path: '/quotes',
        name: 'Quotes',
        component: QuoteOrderManagementComponent,
        meta: {
            title: 'Quotes',
            requiresAuth: true,
            icon: 'DocumentTextIcon'
        },
        beforeEnter: authenticationGuard
    },
    {
        path: '/profiles',
        name: 'Profile',
        component: ProfileComponent,
        meta: {
            title: 'Profile',
            requiresAuth: true,
            icon: 'UserIcon'
        },
        beforeEnter: authenticationGuard
    },
    {
        path: '/events',
        name: 'Events',
        component: EventPageComponent,
        meta: {
            title: 'Events',
            requiresAuth: true,
            icon: 'CalendarDaysIcon'
        },
        beforeEnter: authenticationGuard
    },
    {
        path: '/events/create',
        name: 'event-create',
        component: () => import('../event-management/components/create-and-edit-event.component.vue'),
        meta: {
            title: 'Crear Evento',
            requiresAuth: true,
            parent: 'Events'
        },
        beforeEnter: authenticationGuard
    },
    {
        path: '/events/:id/edit',
        name: "event-edit",
        component: () => import('../event-management/components/create-and-edit-event.component.vue'),
        props: route => ({ id: route.params.id }),
        meta: {
            title: 'Editar Evento',
            requiresAuth: true,
            parent: 'Events'
        },
        beforeEnter: authenticationGuard
    },
    {
        path: '/tasks',
        name: 'Tasks',
        component: taskBoardComponent,
        meta: {
            title: 'Tasks',
            requiresAuth: true,
            icon: 'CheckSquareIcon'
        },
        beforeEnter: authenticationGuard
    },
    {
        path: '/social-events',
        name: 'SocialEvents',
        component: SocialEventscomponent,
        meta: {
            title: 'Social Events',
            requiresAuth: true,
            icon: 'UsersIcon'
        },
        beforeEnter: authenticationGuard
    },
    {
        path: '/task-management',
        name: 'TaskManagement',
        component: TaskManagementComponent,
        meta: {
            title: 'Task Management',
            requiresAuth: true,
            icon: 'ClipboardDocumentListIcon'
        },
        beforeEnter: authenticationGuard
    },
    {
        path: '/profiles/:id',
        name: 'ProfileInformation',
        component: ProfileComponent,
        meta: {
            title: 'Profile Info',
            requiresAuth: true,
            parent: 'Profile'
        },
        props: true,
        beforeEnter: authenticationGuard
    },

    // ==============================
    // REDIRECTS AND CATCH-ALL
    // ==============================
    {
        path: "/",
        name: "Default",
        redirect: (to) => {
            // Check if user is authenticated
            const authStore = useAuthenticationStore();
            return authStore.isLoggedIn ? '/home' : '/iam/sign-in';
        }
    },
    {
        path: '/login',
        redirect: '/iam/sign-in'
    },
    {
        path: '/register',
        redirect: '/iam/sign-up'
    },
    {
        path: '/logout',
        name: 'Logout',
        beforeEnter: (to, from, next) => {
            const authStore = useAuthenticationStore();
            authStore.signOut();
            next('/iam/sign-in');
        }
    },
    // 404 Catch all route
    {
        path: '/:pathMatch(.*)*',
        name: 'NotFound',
        redirect: (to) => {
            console.warn(`Route not found: ${to.path}`);
            return '/home';
        }
    }
];

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: routes,
    scrollBehavior(to, from, savedPosition) {
        // Scroll behavior for better UX
        if (savedPosition) {
            return savedPosition;
        } else {
            return { top: 0, behavior: 'smooth' };
        }
    }
});

// ==============================
// GLOBAL NAVIGATION GUARDS
// ==============================

// Before each route change
router.beforeEach(async (to, from, next) => {
    console.log(`Navigating from ${from.name} to ${to.name}`);

    // Initialize auth store if not already done
    const authStore = useAuthenticationStore();
    if (!authStore.isAuthenticated) {
        authStore.initializeAuth();
    }

    // Set page title
    let baseTitle = "Eventify";
    if (to.meta.title) {
        document.title = `${baseTitle} | ${to.meta.title}`;
    } else {
        document.title = baseTitle;
    }

    // Add loading state (optional)
    if (to.meta.requiresAuth || to.meta.requiresGuest) {
        // Show loading indicator if needed
        document.body.classList.add('loading');
    }

    next();
});

// After each route change
router.afterEach((to, from) => {
    // Remove loading state
    document.body.classList.remove('loading');

    // Track page views (optional)
    if (import.meta.env.DEV) {
        console.log(`Page changed to: ${to.name} (${to.path})`);
    }

    // Clear any previous errors from auth store
    const authStore = useAuthenticationStore();
    if (authStore.hasError && to.name !== 'SignIn' && to.name !== 'SignUp') {
        authStore.clearError();
    }
});

// Error handler
router.onError((error) => {
    console.error('Router error:', error);

    // Handle chunk load errors (for lazy-loaded components)
    if (error.message.includes('Loading chunk')) {
        console.warn('Chunk loading failed, reloading page...');
        window.location.reload();
    }
});

// ==============================
// ROUTE HELPERS (Export for use in components)
// ==============================

// Get all public routes
export const getPublicRoutes = () => {
    return routes.filter(route => route.meta?.public || !route.meta?.requiresAuth);
};

// Get all protected routes
export const getProtectedRoutes = () => {
    return routes.filter(route => route.meta?.requiresAuth && !route.meta?.hideFromNavigation);
};

// Get navigation routes (for sidebar/navbar)
export const getNavigationRoutes = () => {
    return routes.filter(route =>
        route.meta?.requiresAuth &&
        !route.meta?.hideFromNavigation &&
        !route.meta?.parent && // Don't include child routes
        route.name !== 'NotFound'
    );
};

// Check if user can access route
export const canAccessRoute = (routeName) => {
    const authStore = useAuthenticationStore();
    const route = routes.find(r => r.name === routeName);

    if (!route) return false;
    if (route.meta?.public) return true;
    if (route.meta?.requiresAuth) return authStore.isLoggedIn;
    if (route.meta?.requiresGuest) return !authStore.isLoggedIn;

    return true;
};

export default router;