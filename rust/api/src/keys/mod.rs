use reqwest;
use serde::{Deserialize, Serialize};
use serde_json;

use worker::*;

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

#[derive(Debug, Deserialize, Serialize)]
struct GenericResponse {
    status: u16,
    message: String,
}

#[derive(Deserialize)]
struct ApiKey {
    api_key: String,
}

#[derive(Debug, Deserialize, Serialize)]
struct KeyVerificationResponse {
    status: u16,
    message: String,
    valid: bool,
}

pub async fn verify_api(mut req: Request, _ctx: RouteContext<()>) -> worker::Result<Response> {
    // Attempt to deserialize JSON body and handle the case where api_key is missing
    let api_key_result = req.json::<ApiKey>().await;

    match api_key_result {
        Ok(ApiKey { api_key }) => {
            let is_valid = validate(api_key).await;

            // If the key exists and is validated, return success response
            Response::from_json(&KeyVerificationResponse {
                status: 200,
                message: "Key verification successful!".to_string(),
                valid: is_valid,
            })
        }
        Err(_) => {
            // If the api_key is missing or there is another deserialization error, return error response
            Response::from_json(&GenericResponse {
                status: 400,  // Bad Request
                message: format!("We’ve failed to verify your key. It’s likely you did not provide one - check out the docs at https://docs.kayle.ai to learn more."),
            })
        }
    }
}
