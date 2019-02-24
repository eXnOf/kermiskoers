# kermiskoers

Written against node v8.11.3. 

To run:
- install node v8.11.3 (https://nodejs.org/download/release/v8.11.3/)
- download code from https://github.com/eXnOf/kermiskoers (or use git source control to clone the repo locally; install git from https://git-scm.com/book/en/v2/Getting-Started-Installing-Git, go into a chosen directory and type "git clone https://github.com/eXnOf/kermiskoers.git")
- go into the kk-backend folder and run "DEBUG=kk-backend:* npm start" (or just npm start if that's not working).
- open your browser @ "http://localhost:3000"

To test the current version of the application:
- on top of the map, select the "Polyline" tool
- draw a polygon by clicking different points on the map. Either click the starting point to close the line and create a loop, or double-click somewhere on the map to define an endpoint
- next, pick the "Marker" tool
- click somewhere near the polygon you created (you will notice the point is snapped to the polygon); you now defined the start/finish
- subsequent clicks will evaluate a gps coordinate:
    - Push F12 (developer tools) and find the console output
    - click a few times near various parts of the polygon; you should see the results of the calculations in the API coming back