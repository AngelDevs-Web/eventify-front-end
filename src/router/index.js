import {createRouter, createWebHistory} from "vue-router";
import HomeComponent from "../public/pages/home.component.vue"
import CalendarViewComponent from "../events/pages/calendar-view.component.vue";
import SocialEventscomponent from "../event-management/pages/event-page.component.vue";


const routes = [
    {path: '/home', name: 'Home', component: HomeComponent, meta: {title: 'Home'}},
    {path: '/calendar', name: 'CalendarView', component: CalendarViewComponent, meta: {title: 'Calendar'}},
    {path:"/", name:"Default", redirect:'/home'},
    {path: '/social-events', name: 'SocialEvents', component: SocialEventscomponent, meta: {title: 'SocialEvents'} },

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