mod hyperdrive;
mod kayle;
mod keys;

use serde::{Deserialize, Serialize};
use worker::Error::RustError;
use worker::*;

#[derive(Debug, Deserialize, Serialize)]
struct GenericResponse {
    status: u16,
    message: String,
}

#[event(fetch)]
async fn main(req: Request, env: Env, _ctx: Context) -> Result<Response> {
    Router::new()
        /*
        // Examples:
        .get_async("/foo", handle_get)
        .get_async("/foo2", handle_get)
        .post_async("/bar", handle_post)
        .delete_async("/baz", handle_delete)
        */
        .post_async("/v1/key/verify", keys::verify_api)
        .get_async("/v1/moderate", kayle::moderate_api)
        .get_async("/v1/demo/database", example_database)
        .run(req, env)
        .await
}

#[derive(Debug, Deserialize, Serialize)]
struct ExampleDatabaseResponse {
    status: u16,
    message: String,
}

pub async fn example_database(
    _: Request,
    ctx: RouteContext<()>,
) -> worker::Result<Response> {
    let client = hyperdrive::hyperdrive(ctx.env.clone()).await?;

    let rows = client
        .simple_query("SELECT * FROM test")
        .await
        .map_err(|e| RustError(format!("tokio-postgres: {e:#?}")))?;

    rows.iter().for_each(|row| {
        console_log!("row: {:?}", row);
    });

    Response::from_json(&ExampleDatabaseResponse {
        status: 200,
        message: format!("Response: {:?}", &rows),
    })
}

/*pub async fn handle_get(_: Request, _ctx: RouteContext<()>) -> worker::Result<Response> {
    Response::from_json(&GenericResponse {
        status: 200,
        message: "You reached a GET route!".to_string(),
    })
}

pub async fn handle_post(_: Request, _ctx: RouteContext<()>) -> worker::Result<Response> {
    Response::from_json(&GenericResponse {
        status: 200,
        message: "You reached a POST route!".to_string(),
    })
}

pub async fn handle_delete(_: Request, _ctx: RouteContext<()>) -> worker::Result<Response> {
    Response::from_json(&GenericResponse {
        status: 200,
        message: "You reached a DELETE route!".to_string(),
    })
}*/
