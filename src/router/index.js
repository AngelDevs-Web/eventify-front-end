import {createRouter, createWebHistory} from "vue-router";
import HomeComponent from "../public/pages/home.component.vue"
import CalendarViewComponent from "../event-management/pages/calendar-view.component.vue";
import QuoteOrderManagementComponent from "../quote-management/pages/quote-order-management.component.vue";
import ProfileComponent from "../public/pages/profile.component.vue";
import taskBoardComponent from "../task-management/components/task-board.component.vue";
import EventPageComponent from "../event-management/pages/event-page.component.vue";
import SocialEventscomponent from "../event-management/pages/event-page.component.vue";
import {authenticationGuard} from "../iam/services/authentication.guard.js";
import SignInComponent from "../iam/pages/sign-in.component.vue";
import SignUpComponent from "../iam/pages/sign-up.component.vue";



const TaskManagementComponent = () => import('../task-management/pages/task-management.component.vue');

const routes = [
    { path: '/sign-in',                 name: 'sign-in',    component: SignInComponent,             meta: { title: 'Sign-In' } },
    { path: '/sign-up',                 name: 'sign-up',    component: SignUpComponent,             meta: { title: 'Sign-Up' } },
    {path: '/home', name: 'Home', component: HomeComponent, meta: {title: 'Home'}},
    {path: '/calendar', name: 'CalendarView', component: CalendarViewComponent, meta: {title: 'Calendar'}},
    {path: '/quotes', name: 'Quotes', component: QuoteOrderManagementComponent, meta: {title: 'Quotes'}},
    {path: '/profiles', name: 'Profile', component: ProfileComponent, meta: {title: 'Profile'}},
    {path:'/events', name:'Events',component: EventPageComponent, meta: {title: 'Events'}},
    {path: '/events/create', name:'event-create', component: () => import('../event-management/components/create-and-edit-event.component.vue')},
    {path:'/events/:id/edit', name:"event-edit", component: () => import('../event-management/components/create-and-edit-event.component.vue'),
        props: route=>({id:route.params.id})},
    {path: '/tasks', name: 'Tasks', component: taskBoardComponent, meta: {title: 'Tasks'}},
    {path: '/social-events', name: 'SocialEvents', component: SocialEventscomponent, meta: {title: 'SocialEvents'} },
    { path: '/tasks',name: 'tasks',      component: TaskManagementComponent,     meta: { title: 'Tasks'}},
    {path: '/profiles/:id', name: 'ProfileInformation', component: ProfileComponent, meta: {title: 'Profile Info'}, props: true},
    {path:"/", name:"Default", redirect:'/home'},
];


const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: routes
});

router.beforeEach((to, from, next) => {
    console.log(`Navigating to ${from.name} to ${to.name}`);
    let baseTitle = "Eventify";
    document.title = `${baseTitle} | ${to.name}`;
    authenticationGuard(to, from, next);
});

export default router;