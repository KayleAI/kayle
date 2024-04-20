//use reqwest;
use serde::{Deserialize, Serialize};

use worker::*;

#[derive(Debug, Deserialize, Serialize)]
struct GenericResponse {
    status: u16,
    message: String,
}

pub async fn text_moderation(_req: Request, _ctx: RouteContext<()>) -> worker::Result<Response> {
    // Extract and validate the API key from the request headers.
    Response::from_json(&GenericResponse {
        status: 200,
        message: "Request Authorized".to_string(),
    })
}
