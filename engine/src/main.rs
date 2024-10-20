// System imports
use std::env;

// Log imports
use log::{error, info};

// Actix imports
use actix_web::middleware::{from_fn, Logger};
use actix_web::{web, App, HttpRequest, HttpResponse, HttpServer};

// Reqwest imports
use reqwest::Client;

// Serde imports
use serde_json::json;

// SQLx imports
use sqlx::postgres::PgPoolOptions;

// Unkey imports
use types::unkey::{AppState, UnkeyApiId};
use unkey::Client as UnkeyClient;

// Other imports
use middleware::verify_key;

// Modules
mod middleware;
mod types;

// Handlers
mod handlers;
mod moderate;

impl From<UnkeyApiId> for String {
    fn from(api_id: UnkeyApiId) -> Self {
        api_id.0
    }
}

pub async fn hello_world(_req: HttpRequest) -> HttpResponse {
    HttpResponse::Ok()
        .content_type("application/json")
        .json(json!({
                "error": false,
            "message": "Hello, world!",
            "hint": "We just wanted to say hello!",
            "docs": "https://kayle.ai/docs",
        }))
}

#[actix_web::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    match dotenvy::dotenv() {
        Ok(_) => info!("Successfully loaded .env file"),
        Err(e) => error!("Failed to load .env file: {}", e),
    }

    let _pool: sqlx::Pool<sqlx::Postgres> = PgPoolOptions::new()
        .max_connections(200)
        .connect(&std::env::var("DATABASE_URL").expect("DATABASE_URL environment variable not set"))
        .await
        .expect("Failed to connect to database");

    let _guard = std::env::var("SENTRY_DSN").map_or_else(
        |_| {
            info!("SENTRY_DSN not set, skipping Sentry initialization");
            None
        },
        |dsn| {
            Some(sentry::init((
                dsn,
                sentry::ClientOptions {
                    release: sentry::release_name!(),
                    ..Default::default()
                },
            )))
        },
    );

    let app_state = AppState {
        unkey_client: UnkeyClient::new(
            &env::var("UNKEY_ROOT_KEY").expect("UNKEY_ROOT_KEY must be set"),
        ),
        unkey_api_id: UnkeyApiId(env::var("UNKEY_API_ID").expect("UNKEY_API_ID must be set")),
    };

    let shared_data = web::Data::new(app_state);
    let client = web::Data::new(Client::new());

    let server = HttpServer::new(move || {
        App::new()
            .wrap(Logger::default())
            .wrap(Logger::new("%a %{User-Agent}i"))
            .wrap(sentry_actix::Sentry::new())
            .app_data(client.clone())
            .app_data(shared_data.clone())
            .service(
                web::scope("/v1")
                    .wrap(from_fn(verify_key))
                    .route("/moderate/text", web::get().to(handlers::moderate::text))
                    .route("/moderate/image", web::get().to(hello_world)),
            )
            .service(web::scope("").route("/hello", web::get().to(hello_world)))
    })
    .bind(format!(
        "0.0.0.0:{}",
        std::env::var("ENGINE_PORT").unwrap_or("3000".to_string())
    ))?;

    server.run().await?;

    Ok(())
}
