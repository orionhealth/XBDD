/**
 * Copyright (C) 2015 Orion Health (Orchestral Development Ltd)
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *         http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
package xbdd.webapp.resource.feature;

import com.mongodb.*;
import xbdd.webapp.factory.MongoDBAccessor;
import xbdd.webapp.util.Coordinates;

import javax.inject.Inject;
import javax.ws.rs.*;
import javax.ws.rs.core.Response;

@Path("/rest/users")
public class User {

    private final MongoDBAccessor client;

    @Inject
    public User(final MongoDBAccessor client) {
        this.client = client;
    }

    @GET
    @Path("/tagAssignment/{product}/{major}.{minor}.{servicePack}/{build}")
    @Consumes("application/json")
    public DBObject getTagsAssignment(@BeanParam final Coordinates coordinates) {
        final DB db = this.client.getDB("bdd");
        final DBCollection collection = db.getCollection("tagsAssignment");
        final BasicDBObject coq = coordinates.getReportCoordinatesQueryObject();
        final DBObject document = collection.findOne(coq);

        if(document != null) {
            final BasicDBList tags = (BasicDBList) document.get("tags");
            return tags;
        }
        return null;
    }

//    private DBObject getUserTagsByUserName(BasicDBList usersTags, String tag) {
//        for(Object userTag : usersTags) {
//            final String fetchUserName = (String) ((BasicDBObject)userTag).get("userName");
//            if(fetchUserName.equals(tag)) {
//                return (DBObject) userTag;
//            }
//        }
//        return null;
//    }
//
//    private DBObject getUserTagsByTag(BasicDBList usersTags, String tag) {
//        for(Object userTag : usersTags) {
//            final BasicDBList fetchTags = (BasicDBList) ((BasicDBObject)userTag).get("tags");
//            for(Object fetchTag : fetchTags) {
//                if(fetchTag.equals(tag)) {
//                    return (DBObject) userTag;
//                }
//            }
//        }
//        return null;
//    }

    @PUT
    @Path("/tagAssignment/{product}/{major}.{minor}.{servicePack}/{build}")
    @Consumes("application/json")
    public Response updateTagsAssignment(@BeanParam final Coordinates coordinates, final DBObject patch) {
        try {
            final DB db = this.client.getDB("bdd");
            final DBCollection collection = db.getCollection("tagsAssignment");
            final BasicDBObject coq = coordinates.getReportCoordinatesQueryObject();
            final BasicDBObject storedDocument = (BasicDBObject)collection.findOne(coq);


            final String tagName = (String) patch.get("tag");
            final String userName = (String) patch.get("userName");

            if (storedDocument != null) {
                final BasicDBObject documentToUpdate = (BasicDBObject)storedDocument.copy();
                updateTagsAssignment(documentToUpdate, tagName, userName);
                collection.save(documentToUpdate);
            } else {
                DBObject newDocument = generateNewDocument(coordinates, tagName, userName);
                collection.save(newDocument);
            }
            return Response.ok().build();
        } catch (final Throwable th) {
            th.printStackTrace();
            return Response.serverError().build();
        }
    }


    private void updateTagsAssignment(final DBObject documentToUpdate, final String tagName, final String userName) {
        final BasicDBList tags = (BasicDBList) documentToUpdate.get("tags");
        for(Object fetchTag : tags) {
            String fetchTagName = (String) ((DBObject)fetchTag).get("tag");
            if(fetchTagName.equals(tagName)) {
                ((DBObject)fetchTag).put("userName", userName);
                return;
            }
        }
        tags.add(generateNewTag(tagName, userName));


//        if(userTagsByTag != null) {
//            final BasicDBList tags = (BasicDBList)userTagsByTag.get("tags");
//            tags.remove(tag);
//        }
//        final DBObject userTagsByUserName = getUserTagsByUserName(usersTags, userName);
//        if(userTagsByUserName != null) {
//            final BasicDBList tags = (BasicDBList) userTagsByUserName.get("tags");
//            tags.add(tag);
//        } else {
//            usersTags.add(generateNewUserTags(userName, tag));
//        }
    }

    private DBObject generateNewDocument(final Coordinates coordinates, final String tagName, final String userName) {
        final BasicDBObject co = coordinates.getReportCoordinates();
        final BasicDBObject newDocument = new BasicDBObject();
        final BasicDBList tags = new BasicDBList();
        final DBObject tag = generateNewTag(tagName, userName);

        tags.add(tag);

        newDocument.put("coordinates", co);
        newDocument.put("tags", tags);

        return newDocument;
    }

    private DBObject generateNewTag(String tagName, String userName){
        final DBObject newTag = new BasicDBObject();

        newTag.put("tag", tagName);
        newTag.put("userName", userName);

        return newTag;
    }

}
