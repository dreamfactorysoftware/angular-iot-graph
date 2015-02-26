angular-iot-graph
=================

This DreamFactory app graphs simulated sensor data stored in a database. This data is created by node-red flows using the dreamfactory node type. The app displays all data points created within the last 60 seconds.  These are read every 5 seconds from the 'iot' table in your database. By default this is the local MySQL database on your DSP which has the service name 'db'.

iot.dfpkg - A special zip archive containing everything needed to create and run the app. This file can also be imported directly into the Apps section of the admin app. Importing a package file always creates a new app.

iot - The directory for all source files required for the application. Normally this will include all HTML, JavaScript, and CSS.

iot.zip - A zip archive of the source code directory. You can import this file from the Apps section of the admin app to update just the source code for your app.

description.json - Application properties to be used for creating a new application when importing the app as a package file. This file is required.

schema.json - Application schema to be created when importing the app as a package file. The fields are id, created_date, device_id, and temp.