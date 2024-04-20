async function moderateText(text: string, db: any) {
  return {
    "type": "text",
    "request_id": "req_...",
    "severity": 0.0, // out of 10.0
    "violations": [
      //"violence",
      //"hate speech",
      //"spam",
      //"pii",
      //"csam", // All CSAM reports are sent to NCMEC
      //"nsfw",
      //"threat",
      //"misinformation",
      //"self-harm",
      //"suicide"
    ],
    "action": null, // restrict, 
    "audit": null, // Some policy violations (like CSAM) require audit trails [adt_...]
    "hash": "hash_..."
  }
}