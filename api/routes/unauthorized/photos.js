
import logger from '../../helpers/logger'

export default ({ api, ig }) => {
  api.post(`/photos`, async (req, res) => {
    logger.info(`in /photos`)
    try {
      let photos = await (new Promise((res, rej) => {
        ig.user_self_media_recent({ count: 21 },
          (err, medias) => {
            if (err)
              rej(err)
            else
              res(medias.map(x => ({
                id: x.id,
                url: x.images.low_resolution.url,
                link: x.link,
              })))
          })
      }))
      return res.json({ success: true, photos })
    }
    catch(e) {
      logger.error(e)
      res.json({ success: false, message: `An error occurred, please try again later`})
    }
  })
}
