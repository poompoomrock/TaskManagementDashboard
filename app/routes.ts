import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
    route(
        "/", // path
        "components/AppLayout.tsx", // file
        [ // This is the array for children routes
            index("routes/Dashboard.tsx"),
            route("tasks", "routes/Tasks.tsx")
        ]
    )
] satisfies RouteConfig;