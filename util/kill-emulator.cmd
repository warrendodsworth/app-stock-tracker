for /f "tokens=5" %%a in ('netstat -aon ^| find ":9099" ^| find "LISTENING"') do taskkill /f /pid %%a
for /f "tokens=5" %%a in ('netstat -aon ^| find ":5001" ^| find "LISTENING"') do taskkill /f /pid %%a
for /f "tokens=5" %%a in ('netstat -aon ^| find ":8080" ^| find "LISTENING"') do taskkill /f /pid %%a
for /f "tokens=5" %%a in ('netstat -aon ^| find ":9000" ^| find "LISTENING"') do taskkill /f /pid %%a
for /f "tokens=5" %%a in ('netstat -aon ^| find ":5000" ^| find "LISTENING"') do taskkill /f /pid %%a
for /f "tokens=5" %%a in ('netstat -aon ^| find ":8085" ^| find "LISTENING"') do taskkill /f /pid %%a


for /f "tokens=5" %%a in ('netstat -aon ^| find ":4000" ^| find "LISTENING"') do taskkill /f /pid %%a

@REM macos kill port
@REM lsof -t -i tcp:8080 | xargs kill

@REM zshrc check for insecure dirs - compaudit
@REM fix - https://stackoverflow.com/questions/13762280/zsh-compinit-insecure-directories
