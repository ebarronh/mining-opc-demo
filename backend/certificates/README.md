# OPC UA Certificates

This directory contains OPC UA security certificates for the mining demo server.

## Development Setup (Phase 1)

For Phase 1 demonstration purposes, the server runs with `SecurityPolicy.None` to simplify setup and testing.

## Future Security Implementation (Phase 2+)

When implementing production-grade security features:

### Self-Signed Certificates
```bash
# Generate application certificate (example)
openssl req -x509 -newkey rsa:2048 -keyout private_key.pem -out certificate.pem -days 365 -nodes
```

### Certificate Authority Setup
```bash
# For enterprise deployment with CA-signed certificates
# Follow OPC Foundation guidelines for certificate management
```

### Security Policies Supported
- **None**: No security (development only)
- **Basic128Rsa15**: Deprecated but widely supported
- **Basic256Sha256**: Recommended minimum for production
- **Aes128_Sha256_RsaOaep**: Modern security standard
- **Aes256_Sha256_RsaPss**: Highest security level

### File Structure
```
certificates/
├── own/
│   ├── certificate.pem     # Server application certificate
│   └── private_key.pem     # Server private key
├── trusted/
│   └── client_cert.pem     # Trusted client certificates
├── rejected/
│   └── untrusted_cert.pem  # Rejected certificates
└── pki/
    ├── ca/                 # Certificate Authority certs
    ├── crl/                # Certificate Revocation Lists
    └── issuer/             # Issuer certificates
```

## Important Security Notes

⚠️ **Never commit real certificates to version control**

✅ **For production mining operations:**
- Use strong, CA-signed certificates
- Implement proper key management
- Regular certificate rotation
- Monitor certificate expiration
- Audit certificate usage

📚 **Reference Documentation:**
- [OPC UA Security Guide](https://opcfoundation.org/developer-tools/specifications-unified-architecture/part-2-security/)
- [Mining Companion Specification Security](https://opcfoundation.org/markets-collaboration/mining/)