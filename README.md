# RailRoad
Student Project - node.js backend api about a railroad system

this project has been done under two weeks, things may not be perfect

This project needs a .env which contains several data, such as for now :

MONGO_ADDRESS : this data must be in the env file to specify the address of the database (mongo).
EXPRESS_PORT : this is a variable used for the whole api running port
PASSPHRASE_TOKEN : this is a variable which contains the passphrase of your system and will be used to create the jwt.

# External softwares used

This project uses a mongo Database, in consequence, please provide a mongodb service or modify the code structure to use another db model that you want (SQL or nosql); by default this app is intended to work with a mongodb without any password or permission, please take this into consideration as well

# How to execute ?

You can execute this project in mainly two ways, either by using directly the project :

    - npm i (to download dependencies)
    - npm start (to run the app)

or another way is to use the docker compose and the dockerfile (recommended) :

    (with docker installed and setup correctly)
    - docker compose build .
    - docker compose up 

by using this method, both the app and the database (if you don't edit the code to use another one) will be started

# Documentation

we will provide a openapi/swagger doc to specify what are the endpoints of the api or the responses you can wait of it.

# Issues ?

this is a student project, it is not meant to be perfect or being flawless, but we probably won't resolve any issues you will open if you do so , so please no need to open issues.

However, if you have any questions about how this program works or about the code itself, don't wonder to message me and ask your question. thanks :)