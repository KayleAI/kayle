use reqwest;
use serde_json;
use serde::{Deserialize, Serialize};

#[derive(Debug, Deserialize, Serialize)]
struct GenericResponse {
    status: u16,
    message: String,
}

#[derive(Debug, Deserialize, Serialize)]
pub struct KeyVerificationRequest {
    key: String,
    #[serde(rename = "apiId")]
    api_id: String,
}

// return a boolean 
pub async fn validate_key(key: String) -> bool { 
    let client = reqwest::Client::new();
    let res = client
        .post(format!("https://api.unkey.dev/v1/keys.verifyKey?key={}", key))
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
