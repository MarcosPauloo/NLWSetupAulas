import {useRouteError} from "react-router-dom";

export function ErrorRoute(){
    const error = useRouteError();

    console.log(error)

    return(
        <div id="error-page">
            <h1>Oops!</h1>
            <p>Sorry, an unexpected error has occured.</p>
        </div>
    )

}