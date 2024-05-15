// Get the modules from the other files in the `kayle` directory.
pub mod moderate;
pub mod text;
pub mod ai;

use serde::{Deserialize, Serialize};
use std::str::FromStr;
use worker::*;
use std::fmt;

/**
 * The type of content that is being detected.
 */
#[derive(Debug, Deserialize, Serialize, PartialEq)]
pub enum ViolationsType {
    #[serde(rename = "toxic")]
    Toxicity,
    #[serde(rename = "profanity")]
    Profanity,
    #[serde(rename = "hate-speech")]
    HateSpeech,
    #[serde(rename = "violence")]
    Violence,
    #[serde(rename = "spam")]
    Spam,
    #[serde(rename = "pii")]
    PII,
    #[serde(rename = "csam")]
    CSAM,
    #[serde(rename = "nsfw")]
    NSFW,
    #[serde(rename = "threat")]
    Threat,
    #[serde(rename = "misinformation")]
    Misinformation,
    #[serde(rename = "suicide")]
    Suicide,
    #[serde(rename = "self-harm")]
    SelfHarm,
    #[serde(rename = "propaganda")]
    Propaganda,
    #[serde(rename = "extremism")]
    Extremism,
    #[serde(rename = "unknown")]
    Unknown,
}

impl FromStr for ViolationsType {
    type Err = worker::Error;

    fn from_str(s: &str) -> Result<Self> {
        match s.to_lowercase().as_str() {
            "toxic" => Ok(ViolationsType::Toxicity),
            "profanity" => Ok(ViolationsType::Profanity),
            "hate-speech" => Ok(ViolationsType::HateSpeech),
            "violence" => Ok(ViolationsType::Violence),
            "spam" => Ok(ViolationsType::Spam),
            "pii" => Ok(ViolationsType::PII),
            "csam" => Ok(ViolationsType::CSAM),
            "nsfw" => Ok(ViolationsType::NSFW),
            "threat" => Ok(ViolationsType::Threat),
            "misinformation" => Ok(ViolationsType::Misinformation),
            "suicide" => Ok(ViolationsType::Suicide),
            "self-harm" => Ok(ViolationsType::SelfHarm),
            "propaganda" => Ok(ViolationsType::Propaganda),
            "extremism" => Ok(ViolationsType::Extremism),
            _ => Ok(ViolationsType::Unknown),
        }
    }
}

impl fmt::Display for ViolationsType {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        write!(f, "{}", match self {
            ViolationsType::Toxicity => "toxic",
            ViolationsType::Profanity => "profanity",
            ViolationsType::HateSpeech => "hate-speech",
            ViolationsType::Violence => "violence",
            ViolationsType::Spam => "spam",
            ViolationsType::PII => "pii",
            ViolationsType::CSAM => "csam",
            ViolationsType::NSFW => "nsfw",
            ViolationsType::Threat => "threat",
            ViolationsType::Misinformation => "misinformation",
            ViolationsType::Suicide => "suicide",
            ViolationsType::SelfHarm => "self-harm",
            ViolationsType::Propaganda => "propaganda",
            ViolationsType::Extremism => "extremism",
            ViolationsType::Unknown => "unknown",
        })
    }
}

/**
 * Supported Content Types
 */
#[derive(Debug, Deserialize, Serialize, PartialEq)]
#[serde(rename_all = "lowercase")]
pub enum ContentType {
    Text,
    Image,
    Audio,
    Video,
    Document,
    Live,
    Link,
    Unknown,
}

impl FromStr for ContentType {
    type Err = worker::Error;

    fn from_str(s: &str) -> Result<Self> {
        match s.to_lowercase().as_str() {
            "text" => Ok(ContentType::Text),
            "image" => Ok(ContentType::Image),
            "audio" => Ok(ContentType::Audio),
            "video" => Ok(ContentType::Video),
            "document" => Ok(ContentType::Document),
            "live" => Ok(ContentType::Live),
            "link" => Ok(ContentType::Link),
            _ => Ok(ContentType::Unknown),
        }
    }
}

#[derive(Debug, Deserialize, Serialize)]
pub struct KayleModerationResponse {
    /**
     * The unique identifier for the request.
     *
     * This is useful for tracking requests and debugging.
     *
     * It's currently a placeholder.
     */
    pub request_id: Option<String>,

    /**
     * Has an error occurred?
     *
     * Either null or an object containing the error details.
     */
    pub error: Option<KayleModerationError>,

    /**
     * The severity of the content.
     */
    pub severity: Option<f64>,

    /**
     * What policies were violated?
     */
    pub violations: Option<Vec<ViolationsType>>,

    /**
     * The type of content that was moderated.
     */
    #[serde(rename = "type")]
    pub type_: Option<ContentType>,

    /**
     * The action taken by Kayle
     *
     * For example, if CSAM is detected, Kayle will begin investigating.
     *
     * Currently, Kayle only takes action on CSAM and Extremism.
     *
     * It's currently a placeholder.
     */
    pub action: Option<KayleModerationAction>,

    /**
     * The audit trail of the moderation.
     *
     * In the case of CSAM, Kayle will begin creating an audit trail
     * and attempt to retrive user information from the sending platform.
     *
     * This is why providing a User ID in the `from` field is important.
     *
     * We’ll use the User ID in a request to the sending platform to
     * retrieve user information.
     *
     * It's currently a placeholder.
     */
    pub audit: Option<KayleModerationAudit>,

    /**
     * The hash of the content.
     *
     * For images, this is a PDQ has.
     *
     * It's currently a placeholder.
     */
    pub hash: Option<String>,

    /**
     * The transcription of the content.
     *
     * Only available for audio and video content.
     *
     * It's currently a placeholder.
     */
    pub transcription: Option<String>,
}

#[serde_with::skip_serializing_none]
#[derive(Debug, Deserialize, Serialize)]
pub struct KayleModerationError {
    pub description: Option<String>,
    pub message: Option<String>,
    pub hint: Option<String>,
    pub code: Option<i32>,
}

#[serde_with::skip_serializing_none]
#[derive(Debug, Deserialize, Serialize)]
pub struct KayleModerationAction {}

#[serde_with::skip_serializing_none]
#[derive(Debug, Deserialize, Serialize)]
pub struct KayleModerationAudit {}

/**
 * Groq Enabled?
 * 
 * Should we use Groq for moderation instead of OpenAI?
 */
pub const GROQ_ENABLED: bool = true;

/**
 * The base URL for the AI Gateway.
 * 
 * You'll need to modify this to match your account tag and correct gateway.
 * 
 * @docs https://developers.cloudflare.com/ai-gateway/
 * 
 * Alternatively, you can use the OpenAI API directly.
 */
pub const BASE_AI_URL: &str = "https://gateway.ai.cloudflare.com/v1/b482dc77edae0b65495f7e2fba6ceb16/kayle/openai"; // Through Cloudflare AI Gateway to OpenAI
//pub const BASE_AI_URL: &str = "https://api.openai.com/v1"; // Directly to OpenAI

/**
 * If we've enabled Groq, we'll use this endpoint.
 */
pub fn base_moderation_url() -> &'static str {
    if GROQ_ENABLED {
        "https://api.groq.com/openai/v1"
    } else {
        BASE_AI_URL
    }
}

/**
 * The Model ID for the moderation model.
 * 
 * We're using mixtral-8x7b for its speed.
 * 
 * Groq: mixtral-8x7b-32768
 * OpenAI: gpt-3.5-turbo-0125
 */
pub fn moderation_model_id() -> &'static str {
    if GROQ_ENABLED {
        "mixtral-8x7b-32768"
    } else {
        "gpt-3.5-turbo-0125"
    }
}