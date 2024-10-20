// Moderate images
/*
- Run the image through a model that can detect nudity.
- Run the image through an OCR model then pass the text to a text moderation model.
*/

// Actix imports
use actix_web::HttpRequest;

pub async fn image(_req: HttpRequest) -> String {
    "Hello, world!".to_owned()
}
