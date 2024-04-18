//use reqwest;
use super::keys;
use serde::{Deserialize, Serialize};

use worker::*;

#[derive(Debug, Deserialize, Serialize)]
struct GenericResponse {
    status: u16,
    message: String,
}

pub async fn moderate_api(req: Request, _ctx: RouteContext<()>) -> worker::Result<Response> {
  // Extract and validate the API key from the request headers.
  let api_key = match req.headers().get("authorization") {
      Ok(Some(key)) if key.starts_with("Bearer ") => key[7..].to_string(),
      Ok(Some(_)) | Ok(None) => {
          return Response::from_json(&GenericResponse {
              status: 401,
              message: "Unauthorized".to_string(),
          })
      },
      Err(_) => {
          return Response::from_json(&GenericResponse {
              status: 500,
              message: "Internal Server Error".to_string(),
          })
      },
  };

  // Validate the API key.
  if !keys::validate(api_key).await {
      return Response::from_json(&GenericResponse {
          status: 401,
          message: "Unauthorized".to_string(),
      });
  }

  Response::from_json(&GenericResponse {
      status: 200,
      message: "Request Authorized".to_string(),
  })
}
