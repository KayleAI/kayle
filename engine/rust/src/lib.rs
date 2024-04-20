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

#[derive(Debug, Deserialize, Serialize)]
pub struct KayleBasicResponse {
    status: u16,
    message: String,
    request_id: Option<String>,
    hint: Option<String>,
    docs: Option<String>,
}

#[event(fetch)]
async fn main(req: Request, env: Env, _ctx: Context) -> Result<Response> {
    let _client = hyperdrive::hyperdrive(env.clone()).await?;

    console_log!("{:#?}", _ctx);

    let kayle_docs = "View the documentation at https://docs.kayle.ai".to_string();

    let api_key = match req.headers().get("authorization") {
        Ok(Some(key)) if key.starts_with("Bearer ") => key[7..].to_string(),
        Ok(Some(_)) | Ok(None) => {
            return Response::from_json(&KayleBasicResponse {
                status: 401,
                message: "You have not provided an API key.".to_string(),
                request_id: None,
                hint: Some("Please provide an API key in the Authorization header.".to_string()),
                docs: Some(kayle_docs)
            })
        }
        Err(_) => {
            return Response::from_json(&KayleBasicResponse {
                status: 500,
                message: "Internal Server Error".to_string(),
                request_id: None,
                hint: Some("Try contacting support.".to_string()),
                docs: Some(kayle_docs)
            })
        }
    };

    // Validate the API key.
    if !keys::validate(api_key).await {
        return Response::from_json(&KayleBasicResponse {
            status: 401,
            message: "Unauthorized".to_string(),
            request_id: None,
            hint: None,
            docs: Some(kayle_docs)
        });
    }

    Router::new()
        /*
        // Examples:
        .get_async("/foo", handle_get)
        .get_async("/foo2", handle_get)
        .post_async("/bar", handle_post)
        .delete_async("/baz", handle_delete)
        */
        // basic endpoints
        .post_async("/v1/key/verify", keys::verify_api)
        .get_async("/v1/moderate", kayle::moderate_api)

        // moderation endpoints
        .post_async("/v1/text", kayle::text::text_moderation)
        .post_async("/v1/image", kayle::image::image_moderation)
        .post_async("/v1/audio", kayle::audio::audio_moderation)
        .post_async("/v1/video", kayle::video::video_moderation)

        // live moderation endpoints
        //.or_else_any_method_async("/v1/live", kayle::live::live_api)

        // demo endpoints
        .get_async("/v1/demo/database", example_database)

        // wrong method/endpoint
        //.or_else_any_method_async("/v1", )
        .run(req, env)
        .await
}

#[derive(Debug, Deserialize, Serialize)]
struct ExampleDatabaseResponse {
    status: u16,
    message: String,
}

pub async fn example_database(_: Request, ctx: RouteContext<()>) -> worker::Result<Response> {
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
