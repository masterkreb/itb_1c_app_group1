import {createBrowserRouter} from "react-router";
import App from "../App.tsx";
import FilmPage from "../pages/film/FilmPage.tsx";
import FilmDetailsPage from "../pages/film/FilmDetailsPage.tsx";
import FilmPageForm from "../pages/film/FilmPageForm.tsx";
import ActorPage from "../pages/actor/ActorPage.tsx";
import ActorDetailsPage from "../pages/actor/ActorDetailsPage.tsx";
import ActorPageForm from "../pages/actor/ActorPageForm.tsx";
import NotFoundPage from "../pages/NotFoundPage.tsx";


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
                path: "film/:id",
                element: <FilmDetailsPage />
            },
            {
                path: "film/new",
                element: <FilmPageForm />
            },
            {
                path: "film/edit/:id",
                element: <FilmPageForm />
            },
            {
                path: "actor",
                element: <ActorPage />
            },
            {
                path: "actor/:id",
                element: <ActorDetailsPage />
            },
            {
                path: "actor/new",
                element: <ActorPageForm />
            },
            {
                path: "actor/edit/:id",
                element: <ActorPageForm />
            },
            {
                path: "*",
                element: <NotFoundPage />
            }

        ]
    },
]);