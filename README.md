# Men's Tennis Grandslam Finals 2003 - Jan 2018
This is a Data Visualisation project built using Pythons Flask framework.
It was built as one of three projects for my Code Institute bootcamp course. 

The project demonstates just how much the past fifteen years have been dominated by Rodger Federer,
Novak Djokovic and Rafael Nadal.

## Demo
The deployed version of the web app is available on heroku: https://grandslams-project2.herokuapp.com/

## View locally
The repository is available on github: https://github.com/ColmHughes/grandslams-project2. In order to run this app locally, all dependancies 
listed in requirements.txt must be installed. The git repository can be cloned and then simply run the dashboard.py file.

## Built with 
1. Flask 
2. Python
2. HTML
3. CSS
4. Bootstrap
5. MongoDB database
6. JavaScript Libraries:
    * d3.js
    * dc.js
    * crossfilter.js
    * queue.js
    * jquery.js
7. A dataset obtained [here](https://www.kaggle.com/jordangoblet/atp-tour-20002016/version/2)



## Components

#### Flask
Flask is a microframework for python that we use to render our index.html template and connect with MongoDB.

#### Python
Our dashboard.py file renders our index.html template with the help of flask and using pymongo interacts with our database, 
we essentially use python to connect our front-end to our database.

#### MongoDB database
NoSQL database that converts and presents data in JSON format.  

#### Queue.js
Is used to defer returning our graphs until they have all ran successfully.

#### Crossfilter.js
Crossfilter.js is used to create coordinated visualizations, when one graph is filtered, all graphs follow suit.

#### D3.js
D3 is a JavaScript library for visualizing data with HTML, SVG, and CSS.

#### Dc.js
DC.js is a JavaScript library that works alongside D3 and Crossfilter to make interactive dashboards in JavaScript.


## Wireframes
The wireframes for this project can be viewed on github in the 'Wireframes' folder.

## Features to be implemented
This dashboard was built to be viewed on a desktop/laptop or larger screens, I plan on making it more mobile - responsive.
It would be nice to combine jQuery and DC so when an image of a player or trophy is clicked, the graphs are filtered.

## Testing
This application was tested across a range of browsers, I also carried out manually tests to make sure the averages and percentages were
correct and also all filtered data was consistent.




