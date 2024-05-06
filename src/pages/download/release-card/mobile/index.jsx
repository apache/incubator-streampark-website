import React from 'react'
import useIsBrowser from '@docusaurus/useIsBrowser'
import config from '../../languages.json'

export default function (props) {
    const releaseData = props.data || []
    const isBrowser = useIsBrowser();
    const language = isBrowser && location.pathname.indexOf('/zh-CN/') === 0 ? 'zh-CN' : 'en'
    const dataSource = config?.[language];

    return releaseData.map((release) => { return releaseJsx(release, { dataSource, language }) })
}

function releaseJsx(release, { dataSource, language }) {
    const isEn = language === 'en'
    const date = new Intl.DateTimeFormat(language, isEn && { month: 'short', year: 'numeric', day: 'numeric' }).format(new Date(release.date))
    return (<div className='release-card'>
        <div className='release-card-date'>{date}</div>
        <div className='release-card-container'>
            <div className='d-flex justify-content-between'>
                <span className='release-card-header flex-1'>v{release.version}</span>
                {release.latest && <span className='release-card-label-latest'>Latest</span>}
            </div>
            <a href={release.releaseNotesUrl}>
                {dataSource.table.releaseNotes}
            </a>
            <br />
            <span>
                <a href={release.source.url} target="_blank">{dataSource.table.source}</a>
                <span className='release-card-symbol'> ( </span>
                <a href={release.source.signature} target="_blank">signature</a>
                <span className='release-card-symbol'> | </span>
                <a href={release.source.sha512} target="_blank">sha512</a>
                <span className='release-card-symbol'> ) </span>
            </span>
            <div className='release-card-title'><i className='fa fa-caret-down' style={{ marginRight: '10px' }} />{dataSource.table.binary}</div>
            <ul >
                {release.binary.map((binary) => {
                    return binaryJsx(binary)
                })}
            </ul></div>
    </div >)
}

function binaryJsx(binary) {
    return <li>
        <a href={binary.url} target="_blank">
            {binary.name}
        </a>
        <div >
            <a href={binary.signature} target="_blank">
                signature
            </a>
            <span className='release-card-symbol'> | </span>
            <a href={binary.sha512} target="_blank">
                sha512
            </a>
        </div>
    </li >
}
