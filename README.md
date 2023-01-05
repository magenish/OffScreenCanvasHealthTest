# OffScreen Canvas Health Test

Simple test code that perfrom canvas health test offscreen in a webroker to offset the laod from the main thread. 

This code creates a node server that return a simple html with a canvas eleemnt.
Then we transfer the canvas off screen using transferControlToOffscreen and send it to the web wroker.
The web worker would draw on the canvas (the same 4 colors canvas as we do the test on today, but much bigger so we can actualy seee it :)) perfrom health test to thata tcancvas every 1 sec and log the resukt in the console.



In order to make this work you will need to have node installed.
1. Run "npm install connect -S" from the folder
2. Run "npm install serve-static -S" from the folder
3. Run “node server.js” from the folder
4. Browse into http://localhost:1337/test.html from chrome.
5. Open the dev tools console to see the health test resilts: ![image](https://user-images.githubusercontent.com/53221799/210751627-933bbc6e-e213-4a73-bf62-33a4a9f1da37.png)

6. Now lets validate that the health test catches issues. To do that we going to imitatte GPU crash by terminintnaig the GPU proceess.
For that lets open the dev tools task manager: ![image](https://user-images.githubusercontent.com/53221799/210751974-ab89f05c-e16d-43cb-8ff5-80dcff218395.png)

7. Terminate the GPU proccess by chossing it and click the end button: ![image](https://user-images.githubusercontent.com/53221799/210751549-38f86e06-7983-4c66-b57e-d979bfb77a52.png)
8. Observe the health test results in the console:![image](https://user-images.githubusercontent.com/53221799/210752146-91da7923-243b-4b01-b061-d21d43ea3d36.png)
