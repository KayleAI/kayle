mod validate;

use serde::{Deserialize, Serialize};
use worker::*;

#[derive(Debug, Deserialize, Serialize)]
struct GenericResponse {
    status: u16,
    message: String,
}

#[derive(Deserialize)]
struct ApiKey {
    api_key: String,
}

#[derive(Debug, Deserialize, Serialize)]
struct KeyVerificationResponse {
    status: u16,
    message: String,
    valid: bool,
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
        .post_async("/v1/key/verify", verify_key)
        .run(req, env)
        .await
}

pub async fn verify_key(mut req: Request, _ctx: RouteContext<()>) -> worker::Result<Response> {
    // Attempt to deserialize JSON body and handle the case where api_key is missing
    let api_key_result = req.json::<ApiKey>().await;

    match api_key_result {
        Ok(ApiKey { api_key }) => {
            let is_valid = validate::validate_key(api_key).await;

            // If the key exists and is validated, return success response
            Response::from_json(&KeyVerificationResponse {
                status: 200,
                message: "Key verification successful!".to_string(),
                valid: is_valid,
            })
        },
        Err(_) => {
            // If the api_key is missing or there is another deserialization error, return error response
            Response::from_json(&GenericResponse {
                status: 400,  // Bad Request
                message: format!("We’ve failed to verify your key. It’s likely you did not provide one - check out the docs at https://docs.kayle.ai to learn more."),
            })
        }
    }
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
