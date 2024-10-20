// Moderate audio
/*
Use audio-to-text then moderate the text.
Eventually, we should also use a model that can moderate the sounds directly.
*/

// Actix imports
use actix_web::HttpRequest;

pub async fn audio(_req: HttpRequest) -> String {
    "Hello, world!".to_owned()
}
