# PHP-serialize-scanner
web-extension that notifies when a param of GET, POST or a COOKIE val contains a serialized PHP string and hence a potential injection vector for PHP Object Injections <br />
This extension is a PoC

## WHAT
Browse normally and get a notification on the button on toolbar (with the number of potential findings). Click the button to trigger the popup and get info on the observed weird params

## HOW
The behavior is simple: it compares each potential POI vector (GET params, POST params, COOKIES, ...?) with two regex: one instructs on how PHP represents generic objects, the other describes serialized arrays

## COMPATIBILITY
&gt;= Firefox 53

## INSTALL
Open Firefox and go to about:addons ; select Extensions on the left panel ; press the settings button next to the search bar and then select "Install add-on from file..."; give it PHP-serialize-scanner-0.1.xpi ; authorize the installation ; done
