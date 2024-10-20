// Moderate videos
/*
- Run audio moderation.
- Determine which frames to moderate.
- Run selected frames through image moderation.
*/

// Actix imports
use actix_web::HttpRequest;

pub async fn video(_req: HttpRequest) -> String {
    "Hello, world!".to_owned()
}
