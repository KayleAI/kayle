use std::str::FromStr;

use js_sys::Object;
use tokio_postgres::tls as PgTls;
use tokio_postgres::{Client as PgClient, Config as PgConfig};
use wasm_bindgen::prelude::*;
use worker::Error::RustError;
use worker::*;

#[wasm_bindgen]
extern "C" {
    #[wasm_bindgen(extends = Object)]
    pub type EdgeHyperdrive;

    #[wasm_bindgen(method, getter, js_name=connectionString)]
    pub fn connection_string(this: &EdgeHyperdrive) -> String;
}

pub struct Hyperdrive {
    inner: EdgeHyperdrive,
}

impl Hyperdrive {
    pub fn connection_string(&self) -> String {
        self.inner.connection_string()
    }
}

impl EnvBinding for Hyperdrive {
    const TYPE_NAME: &'static str = "Hyperdrive";
}

impl JsCast for Hyperdrive {
    fn instanceof(val: &JsValue) -> bool {
        val.is_instance_of::<EdgeHyperdrive>()
    }

    fn unchecked_from_js(val: JsValue) -> Self {
        Self { inner: val.into() }
    }

    fn unchecked_from_js_ref(val: &JsValue) -> &Self {
        unsafe { &*(val as *const JsValue as *const Self) }
    }
}

impl AsRef<JsValue> for Hyperdrive {
    fn as_ref(&self) -> &JsValue {
        &self.inner
    }
}

impl From<Hyperdrive> for JsValue {
    fn from(hyperdrive: Hyperdrive) -> Self {
        JsValue::from(hyperdrive.inner)
    }
}

// Main Database Stuff
pub async fn hyperdrive(env: Env) -> Result<PgClient> {
    let hyperdrive = env.get_binding::<Hyperdrive>("HYPERDRIVE")?;
    let conn_string = hyperdrive.connection_string();

    let url = Url::parse(&conn_string)?;

    let hostname = url
        .host_str()
        .ok_or_else(|| RustError("unable to parse host from url".to_string()))?;

    let socket = Socket::builder().connect(hostname, 5432)?;

    let config = PgConfig::from_str(&conn_string)
        .map_err(|e| RustError(format!("tokio-postgres: {e:?}")))?;

    let (client, connection) = config
        .connect_raw(socket, PgTls::NoTls)
        .await
        .map_err(|e| RustError(format!("tokio-postgres: {e:?}")))?;

    wasm_bindgen_futures::spawn_local(async move {
        if let Err(error) = connection.await {
            console_log!("connection error: {:?}", error);
        }
    });

    Ok(client)
}
