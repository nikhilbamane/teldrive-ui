import { FC, memo, SetStateAction, useRef, useState } from "react"
import { Box } from "@mui/material"
import { Rendition } from "epubjs"
import { ReactReader } from "react-reader"

import { getMediaUrl } from "@/ui/utils/common"

const EpubPreview: FC<{ id: string; name: string }> = ({ id, name }) => {
  const url = getMediaUrl(id, name)

  const epubContainer = useRef(null)

  const [location, setLocation] = useState()

  const onLocationChange = (cfiStr: string) => setLocation(cfiStr)

  const fixEpub = (rendition: Rendition) => {
    const spineGet = rendition.book.spine.get.bind(rendition.book.spine)
    rendition.book.spine.get = function (target) {
      const targetStr = target as string
      let t = spineGet(target)
      while (t == null && targetStr.startsWith("../")) {
        target = targetStr.substring(3)
        t = spineGet(target)
      }
      return t
    }
  }

  return (
    <Box
      ref={epubContainer}
      sx={{
        maxWidth: "70%",
        width: "100%",
        margin: "auto",
        padding: "1rem",
        position: "relative",
        height: "90vh",
      }}
    >
      <ReactReader
        url={url}
        getRendition={(rendition) => fixEpub(rendition)}
        location={location}
        locationChanged={onLocationChange}
        epubInitOptions={{ openAs: "epub" }}
        epubOptions={{ flow: "scrolled", allowPopups: true }}
      />
    </Box>
  )
}

export default memo(EpubPreview)