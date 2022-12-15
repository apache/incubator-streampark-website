import React from 'react'
import useIsBrowser from '@docusaurus/useIsBrowser'
import config from './languages.json'

export default function (props) {
  const tableData = props.dataSource || []
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
            return <tr key={release.version}>
              <td className='text-center'> {release.version} </td>
              <td className='text-center'> {release.date} </td>
              <td className='text-center'>
                <a href={release.source} target="_blank">source</a>
                <span> ( </span>
                <a href={release.sourceSha} target="_blank">sha512</a>
                <span> | </span>
                <a href={release.sourceSignature} target="_blank">signature</a>
                <span> ) </span>
              </td>
              <td className='text-center'>
                <a href={release.binary} target="_blank">binary</a>
                <span> ( </span>
                <a href={release.binarySha} target="_blank">sha512</a>
                <span> | </span>
                <a href={release.binarySignature} target="_blank">signature</a>
                <span> ) </span>
              </td>
              <td className='text-center'>
                <a href={release.changeLog} target="_blank">{dataSource.releaseNotes}</a>
              </td>
            </tr>
          })
        }
      </tbody>
    </table>
  );
}
