import React from 'react'
import useIsBrowser from '@docusaurus/useIsBrowser'
import config from '../../languages.json'

export default function (props) {
    const tableData = props.data || []
    const isBrowser = useIsBrowser();
    const language = isBrowser && location.pathname.indexOf('/zh-CN/') === 0 ? 'zh-CN' : 'en'
    const dataSource = config?.[language];

    return (
        <table className="table-ui mb-4">
            <thead>
                <tr>
                    <th className='text-center'> {dataSource.table.version} </th>
                    <th className='text-center'>{dataSource.table.date} </th>
                    <th className='text-center'> {dataSource.table.source}</th>
                    <th className='text-center'> {dataSource.table.binary} </th>
                    <th className='text-center'> {dataSource.table.releaseNotes} </th>
                </tr>
            </thead>
            <tbody>
                {
                    tableData.map((release) => {
                        return <tr key={release.version} style={{ fontSize: '13px' }}>
                            <td className='text-center'> {release.version} </td>
                            <td className='text-center'> {release.date} </td>
                            <td className='text-center'>
                                <a href={release.source.url} target="_blank">source</a>
                                <span> ( </span>
                                <a href={release.source.signature} target="_blank">signature</a>
                                <span> | </span>
                                <a href={release.source.sha512} target="_blank">sha512</a>
                                <span> ) </span>
                            </td>
                            <td className='text-center'>
                                {release.binary.map((binary) => {
                                    return (<span>
                                        <a href={binary.url} target="_blank">
                                            {binary.name}
                                        </a>
                                        <span> ( </span>
                                        <a href={binary.signature} target="_blank">
                                            signature
                                        </a>
                                        <span> | </span>
                                        <a href={binary.sha512} target="_blank">
                                            sha512
                                        </a>
                                        <span> ) </span>
                                        <br />
                                    </span>)
                                })}
                            </td>
                            <td className='text-center'>
                                <a href={'https://streampark.apache.org/download/release-note/'.concat(release.version)} target="_blank">
                                    {dataSource.releaseNotes}
                                </a>
                            </td>
                        </tr>
                    })
                }
            </tbody>
        </table>
    );
}
