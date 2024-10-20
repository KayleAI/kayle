// Actix imports
use actix_web::HttpRequest;

pub async fn text(_req: HttpRequest) -> String {
    "Hello, world!".to_owned()
}
