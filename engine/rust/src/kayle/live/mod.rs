use serde::{Deserialize, Serialize};

use worker::*;

#[derive(Debug, Deserialize, Serialize)]
struct GenericResponse {
    status: u16,
    message: String,
}

async fn live_moderation() -> Result<WebSocket> {
    let websocket = WebSocket::accept();

    Ok(websocket)
}

pub async fn live_api(_req: Request, _ctx: RouteContext<()>) -> worker::Result<Response> {
    let websocket = live_moderation().await?;

    // Using the WebSocket to create a 101 switching protocols response
    Response::from_websocket(websocket)
}