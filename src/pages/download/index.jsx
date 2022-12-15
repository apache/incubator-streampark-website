import React from 'react';
import useIsBrowser from '@docusaurus/useIsBrowser';
import config from "./languages.json";
import Layout from '@theme/Layout';
import InfoSvg from "./info.svg"
import './index.less';
import downloadDataSource from './data.json'
import ReleaseTable from "./table"
export default function () {
  const isBrowser = useIsBrowser();
  const language = isBrowser && location.pathname.indexOf('/zh-CN/') === 0 ? 'zh-CN' : 'en';
  const dataSource = config?.[language];
  let lastRelease = []
  const archivedRelease = []
  downloadDataSource.forEach(item => {
    if (item.isLast) lastRelease = [item]
    else archivedRelease.push(item)
  })
  return (
    <Layout>
      <div className="block download_page" style={{ padding: "10px 0 30px" }}>
        <h2 className="fs-4 mb-4 fw-bold">{dataSource.download}</h2>
        <div className="custom-info-block">
          <div className='d-flex align-items-center'>
            <InfoSvg className='info-icon' />
            <p className="custom-block-title">Instructions</p>
          </div>
          <ul>
            <li>{dataSource.last.title}</li>
            <li>
              <span>{dataSource.last.verification} </span>
              <a href='https://downloads.apache.org/incubator/streampark/KEYS' target="_blank">
                {dataSource.last.projectKey}
              </a>.
            </li>
            <li>
              <span>{dataSource.last.check} </span>
              <a href='https://www.apache.org/dyn/closer.cgi#verify' target="_blank">
                {dataSource.last.verify}
              </a>
              <span> {dataSource.last.page}.</span>
            </li>
          </ul>
        </div>
        <h3 className="fs-4 mb-4 fw-bold">{dataSource.latestVersion}</h3>
        <ReleaseTable dataSource={lastRelease}>
        </ReleaseTable>
        <h3 className="fs-4 mb-4 fw-bold">{dataSource.archived}</h3>
        <div className="custom-info-block">
          <div className='d-flex align-items-center'>
            <InfoSvg className='info-icon' />
            <p className="custom-block-title">Note</p>
          </div>
          <ul>
            <li>{dataSource.note}</li>
          </ul>
        </div>
        <ReleaseTable dataSource={archivedRelease}>
        </ReleaseTable>
        <h4>License</h4>
        <p>
          <em>
            <span>The software licensed under </span>
            <a href="http://www.apache.org/licenses/LICENSE-2.0" target="_blank">
              Apache License 2.0
            </a>.
          </em>
        </p>
      </div>
    </Layout>

  );
}
