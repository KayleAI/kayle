// Actix imports
use actix_web::body::BoxBody;
use actix_web::dev::{ServiceRequest, ServiceResponse};
use actix_web::middleware::Next;
use actix_web::{web, Error, HttpResponse};

// Log imports
use log::error;

// Unkey imports
use unkey::models::VerifyKeyRequest;

// Serde imports
use serde_json::json;

// Types
use crate::types::unkey::AppState;

/**
 * Verifies an API key.
 */
pub async fn verify_key(
    req: ServiceRequest,
    next: Next<BoxBody>,
) -> Result<ServiceResponse<BoxBody>, Error> {
    let headers = req.headers().clone();

    let app_data = req.app_data::<web::Data<AppState>>().unwrap();

    let connection_info = req.connection_info().clone();
    let _user_ip = connection_info
        .realip_remote_addr()
        .unwrap_or("unknown")
        .to_string();

    let authorization_header = if let Some(header_value) = headers.get("Authorization") {
        match header_value.to_str() {
            Ok(value) if value.starts_with("Bearer ") => {
                value.trim_start_matches("Bearer ").to_string()
            }
            _ => {
                return Ok(ServiceResponse::new(
                    req.request().clone(),
                    HttpResponse::Unauthorized()
                        .json(json!({
                            "error": "Unauthorized",
                            "message": "This key is malformed.",
                            "hint": "Please check your API key and try again",
                            "docs": "https://kayle.ai/docs/authentication"
                        }))
                        .map_into_boxed_body(),
                ));
            }
        }
    } else {
        return Ok(ServiceResponse::new(
            req.request().clone(),
            HttpResponse::Unauthorized()
                .json(json!({
                    "error": "Unauthorized",
                    "message": "Missing Authorization Header",
                    "hint": "Please check your API key and try again",
                    "docs": "https://kayle.ai/docs/authentication"
                }))
                .map_into_boxed_body(),
        ));
    };

    let verify_request = VerifyKeyRequest {
        key: authorization_header.to_string(),
        api_id: app_data.unkey_api_id.0.clone(),
    };

    match app_data.unkey_client.verify_key(verify_request).await {
        Ok(res) if res.valid => {
            let response = next.call(req).await?;
            Ok(response)
        }
        Ok(res) => {
            error!("Key verification failed: {:?}", res);
            Ok(ServiceResponse::new(
                req.request().clone(),
                HttpResponse::Unauthorized()
                    .json(json!({
                        "error": "Unauthorized",
                        "message": "This key is invalid",
                        "hint": "Please check your API key and try again",
                        "docs": "https://kayle.ai/docs/authentication"
                    }))
                    .map_into_boxed_body(),
            ))
        }
        Err(err) => {
            error!("Key verification failed: {:?}", err);
            Ok(ServiceResponse::new(
                req.request().clone(),
                HttpResponse::Unauthorized()
                    .json(json!({
                        "error": "Unauthorized",
                        "message": "This key is invalid",
                        "hint": "Please check your API key and try again",
                        "docs": "https://kayle.ai/docs/authentication"
                    }))
                    .map_into_boxed_body(),
            ))
        }
    }
}
