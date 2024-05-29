use serde::{Deserialize, Serialize};
use worker::*;

use crate::keys;
use crate::kayle;
use crate::kayle::text::KayleBasicResponse;

use super::ContentType;

#[derive(Debug, Deserialize, Serialize)]
struct GenericResponse {
    status: u32,
    message: String,
}

#[serde_with::skip_serializing_none]
#[derive(Debug, Deserialize, Serialize)]
pub struct ModerationRequest {
    #[serde(rename = "type")]
    pub moderation_type: ContentType,
    #[serde(rename = "data")]
    pub request_data: String,
}

pub async fn moderation(mut req: Request, ctx: RouteContext<()>) -> worker::Result<Response> {
    let kayle_docs = "View the documentation at https://docs.kayle.ai".to_string();

    let api_key = match req.headers().get("authorization") {
        Ok(Some(key)) if key.starts_with("Bearer ") => key[7..].to_string(),
        Ok(Some(_)) | Ok(None) => {
            return Response::from_json(&KayleBasicResponse {
                status: 401,
                message: "You have not provided an API key.".to_string(),
                request_id: None,
                hint: Some("Please provide an API key in the Authorization header.".to_string()),
                docs: Some(kayle_docs),
            })
        }
        Err(_) => {
            return Response::from_json(&KayleBasicResponse {
                status: 500,
                message: "Internal Server Error".to_string(),
                request_id: None,
                hint: Some("Try contacting support.".to_string()),
                docs: Some(kayle_docs),
            })
        }
    };

    let kayle_key: keys::KeyVerificationResponse = keys::validate(api_key).await;

    if kayle_key.valid == false {
        return Response::from_json(&KayleBasicResponse {
            status: 401,
            message: "Unauthorized".to_string(),
            request_id: None,
            hint: None,
            docs: Some(kayle_docs),
        });
    }

    let moderation_request_result: Result<ModerationRequest> = req.json().await;

    match moderation_request_result {
        Ok(moderation_request) => match moderation_request.moderation_type {
            ContentType::Text => {
                return kayle::text::text_moderation(ctx.env.clone(), moderation_request, kayle_key).await;
            }
            _ => {
                return Response::from_json(&GenericResponse {
                    status: 501,
                    message: "This endpoint is coming soon!".to_string(),
                });
            }
        },
        Err(_e) => {
            //console_log!("{:?}", _e);
            return Response::from_json(&GenericResponse {
                status: 400,
                message: "Bad Request".to_string(),
            });
        }
    }
}
