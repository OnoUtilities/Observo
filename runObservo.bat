@ECHO OFF
SET NodeDefaultPath="C:\Program Files\nodejs\node.exe"
@IF EXIST %NodeDefaultPath% (
  %NodeDefaultPath%  ".\node_modules\electron\cli.js" "."
) ELSE (
  @SETLOCAL
  @SET PATHEXT=%PATHEXT:;.JS;=;%
  node  ".\node_modules\electron\cli.js" "."
)