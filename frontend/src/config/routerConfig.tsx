import {createBrowserRouter} from "react-router";
import App from "../App.tsx";
import FilmPage from "../pages/FilmPage.tsx";
import NotFoundPage from "../pages/NotFoundPage.tsx";
import FilmDetailPage from "../pages/FilmDetailPage.tsx";
import FilmFormPage from "../pages/FilmFormPage.tsx";
import ActorListPage from "../pages/ActorListPage";
import ActorFormPage from "../pages/ActorFormPage";
import ActorDetailPage from "../pages/ActorDetailPage";
import IndexPage from "../pages/IndexPage";

export const router = createBrowserRouter([
    {
        path: "/",
        element: <App/>,
        children: [
            {
                index: true,
                element: <IndexPage />
            },
            {
                path: "film",
                element: <FilmPage />
            },
            {
                path: "film/new",
                element: <FilmFormPage />
            },
            {
                path: "film/:id/edit",
                element: <FilmFormPage />
            },
            {
                path: "film/:id",
                element: <FilmDetailPage />
            },
            {
                path: "actor",
                element: <ActorListPage />
            },
            {
                path: "actor/new",
                element: <ActorFormPage />
            },
            {
                path: "actor/:id/edit",
                element: <ActorFormPage />
            },
            {
                path: "actor/:id",
                element: <ActorDetailPage />
            },
            {
                path: "*",
                element: <NotFoundPage />
            }
        ]
    },
]);

