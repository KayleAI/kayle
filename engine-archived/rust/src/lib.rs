mod hyperdrive;
mod kayle;
mod keys;

use serde::{Deserialize, Serialize};
use worker::*;

#[derive(Debug, Deserialize, Serialize)]
struct GenericResponse {
    status: u32,
    message: String,
}

#[event(fetch)]
async fn main(req: Request, env: Env, _ctx: Context) -> Result<Response> {
    Router::new()
        // basic endpoints
        .post_async("/v1/key/verify", keys::verify_api)

        // moderation endpoints
        .post_async("/v1/moderate", kayle::moderate::moderation)

        // live moderation endpoints
        //.or_else_any_method_async("/v1/live", kayle::live::live_api)

        // wrong method/endpoint
        //.or_else_any_method_async("/v1", )
        .run(req, env)
        .await
}
