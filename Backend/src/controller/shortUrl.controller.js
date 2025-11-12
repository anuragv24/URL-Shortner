import { asyncHandler } from "../utils/asyncHandler.js";
import { createShortUrlWithoutUser, createShortUrlWithUser } from "../services/shortUrl.service.js";
import { getShortUrl } from "../dao/shortUrl.js";
import { ApiError } from "../utils/apiErrorHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";

export const createShortUrl = asyncHandler(async (req, res) => {
  const { url } = req.body;
  const user = req?.user;
  console.log("createShortUrl  --->user : ", user);
  let shortUrl;

  if (user) {
    const { slug } = req.body;
    shortUrl = await createShortUrlWithUser(url, user?._id, slug);
  } else {
    shortUrl = await createShortUrlWithoutUser(url);
  }

  if (!shortUrl) {
    throw new ApiError(500, "Failed to create short URL");
  }
  res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { shortUrl: `${process.env.APP_URL}/` + shortUrl },
        "ShortUrl created Successfully"
      )
    );
});

export const redirectToShortUrl = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const url = await getShortUrl(id);
  if (!url) {
    // throw new ApiError(404, "Short URL not found");
    res.redirect(`${process.env.CLIENT_URL}/expire`)

  }
  if(url.expiresAt < new Date()){
    res.redirect(`${process.env.CLIENT_URL}/expire`)
  }
  res.redirect(url.full_url);
});