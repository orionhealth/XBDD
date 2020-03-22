package xbdd.mappers;

import xbdd.model.simple.CoordinatesDto;
import xbdd.webapp.util.Coordinates;

public class CoordinatesMapper {

	public static CoordinatesDto mapCoordinates(Coordinates coordinates) {
		CoordinatesDto xbddCoodinates = new CoordinatesDto();

		xbddCoodinates.setBuild(coordinates.getBuild());
		xbddCoodinates.setMajor(coordinates.getMajor());
		xbddCoodinates.setMinor(coordinates.getMinor());
		xbddCoodinates.setProduct(coordinates.getProduct());
		xbddCoodinates.setServicePack(coordinates.getServicePack());

		return xbddCoodinates;
	}
}
