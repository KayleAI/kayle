use actix_web::{get, App, HttpRequest, HttpResponse, HttpServer, Responder};
use unkey::models::{VerifyKeyRequest, GetKeyRequest};
use unkey::Client;
use std::io::BufReader;
use std::fs::File;
use std::env;

// Serde serialization needed for JSON response when production ready.
// Actix load balances between http/1.1 and http/2; Serde used for JSON serialization and deserialization; SQLx used for PostgreSQL database; Arc used for shared state between threads; RwLock used for mutable access to shared state

#[get("/")]
async fn index(_req: HttpRequest) -> impl Responder {
    HttpResponse::Ok().body("Hello Kayle!")
}

// rust ownership makes sure that variables are local
async fn get_key() {
    dotenv::from_filename(".env").ok();
    let unkey_api_key = env::var("UNKEY_API_KEY").expect("UNKEY_API_KEY not set"); // import unkey from .env
    let test_key = env::var("UNKEY_TEST_KEY").expect("UNKEY_TEST_KEY not set");
    let c = Client::new(&unkey_api_key);
    let req = GetKeyRequest::new(&test_key);

    match c.get_key(req).await {
        Ok(res) => println!("{res:?}"),
        Err(err) => println!("{err:?}"), // returns error message "HttpError {..."key [test_key]... not found"}" <- api_key was verified in verify_key fn so I'm not sure what the issue is
    }
}

async fn verify_key() {
    dotenv::from_filename(".env").ok();
    let unkey_api_key = env::var("UNKEY_API_KEY").expect("UNKEY_API_KEY not set");
    let test_key = env::var("UNKEY_TEST_KEY").expect("UNKEY_TEST_KEY not set");
    let api_id = env::var("UNKEY_API_ID").expect("UNKEY_API_ID not set");
    let c = Client::new(&unkey_api_key);
    let req = VerifyKeyRequest::new(&test_key, &api_id);

    match c.verify_key(req).await {
        Ok(res) => println!("{res:?}"),
        Err(err) => println!("{err:?}"),
    }

}

// expect "fn main() can't be async" error when code is written incorrectly
#[actix_web::main]
async fn main() -> std::io::Result<()> { 
    get_key().await;
    verify_key().await;

    // initialise AWS as default provider
    rustls::crypto::aws_lc_rs::default_provider()
        .install_default()
        .unwrap();
    // PEM is base64 encoded

    //ERROR as SSL provider is placeholder at moment: `Result::unwrap()` on an `Err` value: Os { code: 2, kind: NotFound, message: "No such file or directory" }
    let mut certs_file = BufReader::new(File::open("cert.pem").unwrap());
    let mut key_file = BufReader::new(File::open("key.pem").unwrap());

    let tls_certs = rustls_pemfile::certs(&mut certs_file)
        .collect::<Result<Vec<_>, _>>() //gathers items from an iterator
        .unwrap(); // unwraps Err value: 0s 
    let tls_keys = rustls_pemfile::pkcs8_private_keys(&mut key_file) // rsa_private_keys?
        .next()
        .unwrap()
        .unwrap();

    //TLS config
    let tls_config = rustls::ServerConfig::builder()
        .with_no_client_auth()
        .with_single_cert(tls_certs, rustls::pki_types::PrivateKeyDer::Pkcs8(tls_keys)) //both private and public, can be serialized into ASN
        .unwrap();
  
    HttpServer::new(|| {
        App::new()
            .service(index)
    }) // multi-threading # worry later <- .workers(x). x depends on... what? 
    .bind_rustls_0_23(("127.0.0.1", 8080), tls_config)? // implicit TCP listener
    .run()
    .await
}


