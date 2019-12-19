db.grantRolesToUser("admin", [ "readWrite", "dbAdmin" ] );
db = db.getSiblingDB('bdd');
db = db.getSiblingDB('grid');
