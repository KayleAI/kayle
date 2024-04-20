//use reqwest;
use serde::{Deserialize, Serialize};

use worker::*;

// Get the modules from the other files in the `kayle` directory.
pub mod video;
pub mod text;
pub mod audio;
pub mod image;

// Live moderation of all content.
//pub mod live;

#[derive(Debug, Deserialize, Serialize)]
struct GenericResponse {
    status: u16,
    message: String,
}

pub async fn moderate_api(_req: Request, _ctx: RouteContext<()>) -> worker::Result<Response> {

    // Extract and validate the API key from the request headers.
    Response::from_json(&GenericResponse {
        status: 200,
        message: "Request Authorized".to_string(),
    })
}
