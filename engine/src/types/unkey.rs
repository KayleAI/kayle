use unkey::Client as UnkeyClient;

#[derive(Clone)]
pub struct UnkeyApiId(pub String);

#[allow(dead_code)]
pub struct AppState {
    pub unkey_client: UnkeyClient,
    pub unkey_api_id: UnkeyApiId,
}
