use serde::{Deserialize, Serialize};

#[derive(Debug, Deserialize, Serialize)]
pub struct OpenAIChatCompletionUsage {
    prompt_tokens: u32,
    completion_tokens: u32,
    total_tokens: u32,
}

#[derive(Debug, Deserialize, Serialize)]
pub struct OpenAIChatCompletionChoice {
    index: u32,
    pub message: OpenAIChatCompletionChoiceMessage,
    logprobs: Option<OpenAIChatCompletionChoiceLogprobs>,
    finish_reason: String,
}

#[derive(Debug, Deserialize, Serialize)]
pub struct OpenAIChatCompletionChoiceLogprobs {
    content: Option<Vec<OpenAIChatCompletionChoiceLogprobsContent>>,
}

#[derive(Debug, Deserialize, Serialize)]
pub struct OpenAIChatCompletionChoiceLogprobsContent {
    token: String,
    logprob: f32,
    bytes: Option<Vec<String>>,
    top_logprobs: Option<Vec<OpenAIChatCompletionChoiceLogprobsContentTopLogprobs>>,
}

#[derive(Debug, Deserialize, Serialize)]
pub struct OpenAIChatCompletionChoiceLogprobsContentTopLogprobs {
    token: String,
    logprob: f32,
    bytes: Option<Vec<String>>,
}

#[derive(Debug, Deserialize, Serialize)]
pub struct OpenAIChatCompletionChoiceMessage {
    role: String,
    pub content: String,
}

#[serde_with::skip_serializing_none]
#[derive(Debug, Deserialize, Serialize)]
pub struct OpenAIChatCompletionResponse {
    id: String,
    pub choices: Vec<OpenAIChatCompletionChoice>,
    created: u64,
    model: String,
    system_fingerprint: Option<String>,
    object: String,
    usage: OpenAIChatCompletionUsage,
}