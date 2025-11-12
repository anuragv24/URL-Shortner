import { generateNanoid } from "../utils/helper.js";
import { saveShortUrl } from "../dao/shortUrl.js";
import { ApiError } from "../utils/apiErrorHandler.js";
import Url from "../models/shortUrl.models.js";

export const createShortUrlWithoutUser = async (url) => {

  const shortUrl = generateNanoid(7);
  if (!shortUrl) {
    throw new ApiError(500, "Failed to generate short URL");
  }
  await saveShortUrl(shortUrl, url);
  return shortUrl;
};

export const createShortUrlWithUser = async (url, userId, slug = null) => {

  if (slug) {
   const existedShortUrl = await Url.findOne({ short_url: slug });

    if (existedShortUrl) {
      throw new ApiError(409, "Short Url already exist!!");
    }
    await saveShortUrl(slug, url, userId);
    return slug;
  }

  const shortUrl = generateNanoid(7);
  if (!shortUrl) {
    throw new ApiError(500, "Failed to generate short URL");
  }

  await saveShortUrl(shortUrl, url, userId);

  return shortUrl;
};
 