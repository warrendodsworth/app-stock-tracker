#!/bin/zsh
# chmod +x dsyms-upload.sh to make file executable

# https://firebase.google.com/docs/crashlytics/get-deobfuscated-reports?platform=ios&authuser=0
# XCode build script
# find ${HOME}/dev/app-linkmate/ -name "*.dSYM" | xargs -I \{\} $PODS_ROOT/FirebaseCrashlytics/upload-symbols -gsp ${HOME}/dev/app-linkmate/ios/App/App/GoogleService-Info.plist -p ios \{\}

# Run build script from .sh file 
# https://docs.appdynamics.com/21.1/en/end-user-monitoring/mobile-real-user-monitoring/instrument-ios-applications/upload-the-dsym-file

# find dsyms

# find ${HOME}/Documents/dev/app-linkmate/ -name "*.dSYM" 
find ./ -name "*.dSYM" 


# find - system lookup
# - https://firebase.google.com/docs/crashlytics/get-deobfuscated-reports?platform=ios&authuser=0&hl=en
mdfind -name .dSYM | while read -r line; do dwarfdump -u "$line"; done


# upload dsyms to firebase crashlytics 

# ${HOME}/Documents/dev/app-linkmate/ios/App/Pods/FirebaseCrashlytics/upload-symbols -gsp ${HOME}/Documents/dev/app-linkmate/ios/App/App/GoogleService-Info.plist -p ios ${HOME}/Documents/dev/app-linkmate/util/appDsyms
./ios/App/Pods/FirebaseCrashlytics/upload-symbols -gsp ./ios/App/App/GoogleService-Info.plist -p ios ./util/appDsyms


