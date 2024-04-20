use reqwest;
use serde::{Deserialize, Serialize};
use serde_json;

use worker::*;

use super::KayleBasicResponse;

#[derive(Debug, Deserialize, Serialize)]
pub struct KeyVerificationRequest {
    key: String,
    #[serde(rename = "apiId")]
    api_id: String,
}

pub async fn validate(key: String) -> bool {
    let client = reqwest::Client::new();
    let res = client
        .post(format!(
            "https://api.unkey.dev/v1/keys.verifyKey?key={}",
            key
        ))
        .json(&KeyVerificationRequest {
            key: key, // This is the key that the user needs to verify
            api_id: "api_Q3Er9nRPV3Hf9g52ytcMQkSgi4P".to_string(), // This is Kayle’s API ID
        })
        .send()
        .await;

    match res {
        Ok(res) => {
            let body = res.text().await.unwrap();

            // parse body -> JSON object and return object.valid
            let json: serde_json::Value = serde_json::from_str(&body).unwrap();
            return json["valid"].as_bool().unwrap();
        }
        Err(_) => {
            return false;
        }
    }
}

pub async fn verify_api(_req: Request, _ctx: RouteContext<()>) -> worker::Result<Response> {
    Response::from_json(&KayleBasicResponse {
        status: 200,
        message: "This request is protected - and since you’re seeing this message, you’ve verified your API Key!".to_string(),
        request_id: None,
        hint: Some("You’ve done it!".to_string()),
        docs: Some("Continue learning about Kayle at https://docs.kayle.ai".to_string()),
    })
}
