import { useRef, useState } from "react";
import { useRouteError } from "react-router-dom";


const ErrorPage = () => {
    const error = useRouteError();
    console.error(error);

    return (
        <>
            <div style={{
                display: "flex",
                flexDirection: "column",
                paddingTop: "8rem",
                justifyItems: "center",
                textAlign: "center"
            }}>
                <h1>Error</h1>
                <p>{error.status ? error.status + " " : ""}{error.statusText || error.message}</p>
                <p>{ error.error.message }</p>
            </div>
        </>
    )
}

export default ErrorPage