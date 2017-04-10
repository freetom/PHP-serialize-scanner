# POI-observer
web-extension that notifies when a param of GET, POST or a COOKIE val contains a potential PHP Object Injection

## WHAT
Browse normally and get a notification on the button on toolbar (with the number of potential findings). Click the button to trigger the popup and get info on the observed weird params

## HOW
The behavior is simple: it compares each potential POI vector (GET params, POST params, COOKIES, ...?) with two regex: one instructs on how PHP represents objects, the other describes serialized arrays

## COMPATIBILITY
>= Firefox 53

