"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const user_route_1 = require("../modules/user/user.route");
const auth_route_1 = require("../modules/auth/auth.route");
const post_route_1 = require("../modules/creating-post/post.route");
const payment_route_1 = require("../modules/payment/payment.route");
const meilisearch_route_1 = require("../modules/meilisearch/meilisearch.route");
const event_route_1 = require("../modules/event/event.route");
const router = (0, express_1.Router)();
const moduleRoutes = [
    {
        path: '/auth',
        route: user_route_1.userRoute,
    },
    {
        path: '/auth',
        route: auth_route_1.authRoute
    },
    {
        path: '/search-items',
        route: meilisearch_route_1.MeilisearchRoutes
    },
    {
        path: '/pet',
        route: post_route_1.postRoute
    },
    {
        path: '/payment',
        route: payment_route_1.payemtRoute
    },
    {
        path: '/event',
        route: event_route_1.eventRoute
    }
];
moduleRoutes.forEach((route) => router.use(route.path, route.route));
exports.default = router;
