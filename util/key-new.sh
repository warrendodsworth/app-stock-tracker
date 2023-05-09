
#  create a new keystore

keytool -genkey -v -keystore linkate.keystore -alias upload -keyalg RSA -keysize 2048 -validity 10000 


rem -deststoretype pkcs12
REM see list of sha key hashes
REM keytool -list -v -keystore jewelr.keystore
