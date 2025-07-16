## Feature Tracker

App For Tracking Features Implemented In System

Installation Steps
------------------

sudo bench --{site site_name} install-app featuretracker

Notes
-----
- the project uses some fontawesome icons
- there is validation class also for the client side for actions
- there is a validation class for each database action (create , update , delete)
- for new validation you can inherit from main class and use yours (common validations are in  the parent class)
- you can add multiple features through add bulk features
- refresh button is used for last render of the data to ui from database
- delete api you can send a list of names which needed to be deleted
- create and update apis (accepts list of dictionary containing data to be inserted or deleted)
- addition (add_feature_requests api) , deletion (delete_feature_requests api) , update (update_feature_requests api)
- the sort button sort according to priority of each feature desc and asc as well 

my email for any feedback ahmedatef9693@gmail.com

#### License
mit