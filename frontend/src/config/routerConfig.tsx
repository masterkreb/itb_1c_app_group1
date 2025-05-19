import {createBrowserRouter} from "react-router";
import App from "../App.tsx";
import FilmPage from "../pages/film/FilmPage.tsx";
import ActorPage from "../pages/actor/ActorPage.tsx";
import NotFoundPage from "../pages/NotFoundPage.tsx";
import FilmDetailsPage from "../pages/film/FilmDetailsPage.tsx";
import ActorDetailsPage from "../pages/actor/ActorDetailsPage.tsx";
import ActorPageForm from "../pages/actor/ActorPageForm.tsx";
import FilmEditPage from "../pages/film/FilmEditPage.tsx";
import FilmCreatePage from "../pages/film/FilmCreatePage.tsx";

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
                path: "film/edit/:id",
                element: <FilmEditPage />
            },
            {
                path: "film/create/",
                element: <FilmCreatePage />
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