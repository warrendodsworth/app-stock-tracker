# gen new keystore certificate request - for key lost/corrupted

keytool -genkeypair -alias upload -keyalg RSA -keysize 2048 -validity 9125 -keystore keystore.jks

keytool -export -rfc -alias upload -file upload_certificate.pem -keystore keystore.jks


# convert jks to keystore - https://knowledge.digicert.com/solution/SO17201.html - 1st create a new keystore

keytool -importkeystore -srckeystore keystore.jks -destkeystore linkmate.keystore -srcstoretype JKS -deststoretype PKCS12 