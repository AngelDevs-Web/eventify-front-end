import {createRouter, createWebHistory} from "vue-router";
import HomeComponent from "../public/pages/home.component.vue"


const routes = [
    {path: '/home', name: 'Home', component: HomeComponent, meta: {title: 'Home'}},
    {path:"/", name:"Default", redirect:'/home'}
];


const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: routes
});

router.beforeEach((to, from, next) => {
    console.log(`Navigating to ${from.name} to ${to.name}`);
    let baseTitle = "Eventify";
    document.title = `${baseTitle} | ${to.name}`;
    next();
});

export default router;