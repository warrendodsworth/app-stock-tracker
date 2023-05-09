# Warren's Macbook pro debug key 
# - 8B:19:12:AE:07:A4:C4:94:56:7B:51:75:2E:BB:2B:08:D5:3C:26:9C
# get ./android/debug.keystore SHA-1 - https://www.youtube.com/watch?v=Rs1imvTbeN0

keytool -list -v -alias androiddebugkey -keystore ~/.android/debug.keystore


# Prod upload key

keytool -list -v -alias upload -keystore ./android.keystore
