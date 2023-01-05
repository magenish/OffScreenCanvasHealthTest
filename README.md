# Profiler-samplingRate

Simple test code that helps repro issue with sampling rate.

This code creates a node server that return the jsprofiling document policy header so we can run the profiler - see server.js And return a simple html that use the profiler API to profile until its find more than 2 couples of samples with smaller gap than 5ms  - see test.html

In order to make this work you will need to have node installed.

Then run “node server.js” from the folder and browse into http://localhost:1337/test.html from chrome.

In order to repro you will need to have 2 profiling sessions:
1. from the js code via test.html
2. dev tools profiler

please open the dev tools and profile the page load using the following button:
<img width="1919" alt="image" src="https://user-images.githubusercontent.com/53221799/149188682-7f5fdae2-ec90-4213-9f3d-70a5ebbaa97c.png">


then open the console and see the output in the red circle:
<img width="1831" alt="image" src="https://user-images.githubusercontent.com/53221799/149189150-00220f5f-ab61-474a-b0c9-721ba9b71559.png">
