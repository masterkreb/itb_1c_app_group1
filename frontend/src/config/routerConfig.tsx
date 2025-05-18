import {createBrowserRouter} from "react-router";
import App from "../App.tsx";
import FilmPage from "../pages/FilmPage.tsx";
import ActorPage from "../pages/ActorPage.tsx";
import NotFoundPage from "../pages/NotFoundPage.tsx";
import FilmDetailsPage from "../pages/FilmDetailsPage.tsx";
import ActorDetailsPage from "../pages/ActorDetailsPage.tsx";
import ActorPageForm from "../pages/ActorPageForm.tsx";
import FilmEditPage from "../pages/FilmEditPage.tsx";
import FilmCreatePage from "../pages/FilmCreatePage.tsx";

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