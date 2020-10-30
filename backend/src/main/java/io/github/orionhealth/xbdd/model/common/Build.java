package io.github.orionhealth.xbdd.model.common;

import java.util.Date;

public class Build {
	String name;
	Date publishDate;
	boolean isPinned;

	public String getName() {
		return this.name;
	}

	public void setName(final String name) {
		this.name = name;
	}

	public Date getPublishDate() {
		return this.publishDate;
	}

	public void setPublishDate(final Date publishDate) {
		this.publishDate = publishDate;
	}

	public boolean getIsPinned() {
		return this.isPinned;
	}

	public void setIsPinned(final boolean isPinned) {
		this.isPinned = isPinned;
	}
}
