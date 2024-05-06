import React from 'react'
import { useWindowSize } from "@docusaurus/theme-common";
import ReleaseCardPC from './release-card/pc/index'
import ReleaseCardMobile from './release-card/mobile/index'

export default function (props) {
  const windowSize = useWindowSize();
  const isMobile = windowSize === "mobile";
  const tableData = props.dataSource || []
  const latest = props.latest || false

  const dynURL = 'https://www.apache.org/dyn/closer.lua/incubator/streampark/';
  const archiveURL = 'https://archive.apache.org/dist/incubator/streampark/';
  const downloadURL = 'https://downloads.apache.org/incubator/streampark/'
  const releaseNoteUrl = 'https://streampark.apache.org/download/release-note/'

  function getSourceLink(version) {
    const prefix = latest ? dynURL : archiveURL
    return prefix
      .concat(version)
      .concat('/apache-streampark-')
      .concat(version)
      .concat('-incubating-src.tar.gz')
      .concat('?action=download')
  }

    function getBinaryLink(scala, version) {
        const prefix = latest ? dynURL : archiveURL;
        return prefix
            .concat(version)
            .concat('/apache-streampark_')
            .concat(scala)
            .concat('-')
            .concat(version)
            .concat('-incubating-bin.tar.gz')
            .concat('?action=download')
    }

  function getSourceSigs(version, suffix) {
    const prefix = latest ? downloadURL : archiveURL;
    return prefix.concat(version)
      .concat('/apache-streampark-')
      .concat(version)
      .concat('-incubating-src.tar.gz')
      .concat(suffix)
  }

  function getBinarySigs(scala, version, suffix) {
    const prefix = latest ? downloadURL : archiveURL;
    return prefix
      .concat(version)
      .concat('/apache-streampark_')
      .concat(scala)
      .concat('-')
      .concat(version)
      .concat('-incubating-bin.tar.gz')
      .concat(suffix)
  }

  const releaseData = tableData.map((release) => {
    return genRelease(release, latest)
  })
  function genRelease({ version, date }, latest) {
    return {
      latest: latest,
      version: version,
      date: date,
      releaseNotesUrl: `${releaseNoteUrl}${version}`,
      source: {
        url: getSourceLink(version),
        signature: getSourceSigs(version, '.asc'),
        sha512: getSourceSigs(version, '.sha512')
      },
      binary: [{
        name: 'apache-streampark_2.12-' + version + '-incubating-bin.tar.gz',
        url: getBinaryLink('2.12', version),
        signature: getBinarySigs('2.12', version, '.asc'),
        sha512: getBinarySigs('2.12', version, '.sha512')
      }, {
        name: 'apache-streampark_2.11-' + version + '-incubating-bin.tar.gz',
        url: getBinaryLink('2.11', version),
        signature: getBinarySigs('2.11', version, '.asc'),
        sha512: getBinarySigs('2.11', version, '.sha512')
      }]
    }
  }

  return isMobile ? (<ReleaseCardMobile data={releaseData} />) : (<ReleaseCardPC data={releaseData} />)
}
