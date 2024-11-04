import { Router } from "express"
import { userRoute } from "../modules/user/user.route";
import { authRoute } from "../modules/auth/auth.route";
import { postRoute } from "../modules/creating-post/post.route";
import { payemtRoute } from "../modules/payment/payment.route";
import { MeilisearchRoutes } from "../modules/meilisearch/meilisearch.route";

const router = Router()


const moduleRoutes = [
    {
        path: '/auth',
        route: userRoute,
    },
    {
        path: '/auth',
        route: authRoute
    },
    {
        path : '/search-items', 
        route : MeilisearchRoutes
    },
    {
        path: '/pet',
        route: postRoute
    },
    {
        path: '/payment',
        route: payemtRoute
    }
]

moduleRoutes.forEach((route) => router.use(route.path, route.route));
export default router;