db = db.getSiblingDB('admin');
db.grantRolesToUser("admin", [
    "readWrite",
    "dbAdmin",
    { "role" : "readWrite",  "db" : "bdd" },
    { "role" : "dbAdmin",  "db" : "bdd" },
    { "role" : "readWrite",  "db" : "grid" },
    { "role" : "dbAdmin",  "db" : "grid" }
]);
db.getSiblingDB('bdd');
db.getSiblingDB('grid');
