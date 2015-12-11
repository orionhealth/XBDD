/*
 * Copyright (c) Orchestral Developments Ltd and the Orion Health group of companies (2001 - 2015).
 *
 * This document is copyright. Except for the purpose of fair reviewing, no part
 * of this publication may be reproduced or transmitted in any form or by any
 * means, electronic or mechanical, including photocopying, recording, or any
 * information storage and retrieval system, without permission in writing from
 * the publisher. Infringers of copyright render themselves liable for
 * prosecution.
 */
package xbdd.webapp.util;

import java.util.ArrayList;
import java.util.List;

import com.mongodb.BasicDBList;
import com.mongodb.DBCursor;
import com.mongodb.DBObject;

public final class DatabaseUtilities {
	private DatabaseUtilities() {

	}

	public static BasicDBList extractList(final DBCursor cursor) {
		// field
		final List<DBObject> returns = new ArrayList<DBObject>();
		try {
			while (cursor.hasNext()) {
				returns.add(cursor.next());
			}
		} finally {
			cursor.close();
		}
		final BasicDBList list = new BasicDBList();
		list.addAll(returns);
		return list;
	}
}
