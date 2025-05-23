import {createBrowserRouter} from "react-router";
import App from "../App.tsx";
import FilmPage from "../pages/FilmPage.tsx";
import ActorPage from "../pages/ActorPage.tsx";
import NotFoundPage from "../pages/NotFoundPage.tsx";
import FilmDetailsPage from "../pages/FilmDetailsPage.tsx";
import FilmEditPage from "../pages/FilmEditPage.tsx";
import ActorDetailsPage from "../pages/ActorDetailsPage.tsx";
import ActorEditPage from "../pages/ActorEditPage.tsx";

export const router = createBrowserRouter([
    {
        path: "/",
        element: <App/>,
        children: [
            {
                index: true,
                element: <h1>Index</h1>
            },
            {
                path: "film",
                element: <FilmPage />
            },
            {
                path: "film-create",
                element: <FilmEditPage />
            },
            {
                path: "film/:id",
                element: <FilmDetailsPage />
            },
            {
                path: "film-edit/:filmId",
                element: <FilmEditPage />
            },
            {
                path: "actor",
                element: <ActorPage />
            },
            {
                path: "actor-create",
                element: <ActorEditPage />
            },
            {
                path: "actor/:id",
                element: <ActorDetailsPage />
            },
            {
                path: "actor-edit/:id",
                element: <ActorEditPage />
            },
            {
                path: "*",
                element: <NotFoundPage />
            }
        ]
    },
]);