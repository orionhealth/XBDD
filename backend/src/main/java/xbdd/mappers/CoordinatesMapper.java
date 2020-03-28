package xbdd.mappers;

import xbdd.model.common.CoordinatesDto;
import xbdd.util.Coordinates;

public class CoordinatesMapper {

	public static CoordinatesDto mapCoordinates(final Coordinates coordinates) {
		final CoordinatesDto xbddCoodinates = new CoordinatesDto();

		xbddCoodinates.setBuild(coordinates.getBuild());
		xbddCoodinates.setMajor(coordinates.getMajor());
		xbddCoodinates.setMinor(coordinates.getMinor());
		xbddCoodinates.setProduct(coordinates.getProduct());
		xbddCoodinates.setServicePack(coordinates.getServicePack());

		return xbddCoodinates;
	}
}
