import React from 'react'
import './TableData.less'
import dataSource from './data'
import Toast from './Toast'
import {CopyToClipboard} from 'react-copy-to-clipboard'

const alertCopy = () => {
    Toast.success('复制成功 🎉')
}

const ClientOption = () => {
    return (
        <div>
            <table className="table-data" style={{width: '100%', display: 'inline-table'}}>
                <thead>
                <tr>
                    <td style={{width: '80px'}}>短参数</td>
                    <td>完整参数(前缀"--")</td>
                    <td style={{width: '60px'}}>有效</td>
                    <td>取值范围值或类型</td>
                    <td>作用描述</td>
                </tr>
                </thead>
                <tbody>
                {
                    dataSource.option.map((item, i) => (
                        <tr key={i}>
                            <td>{item.opt}</td>
                            <td>{item.longOpt}</td>
                            <td>
                                {
                                    item.deprecated
                                        ?
                                        <span className="icon-check"></span>
                                        :
                                        <span className="icon-times"></span>
                                }
                            </td>
                            <td>{item.value}</td>
                            <td>{item.desc}</td>
                        </tr>
                    ))
                }
                </tbody>
            </table>
        </div>

    );
};

const ClientProperty = () => {
    return (
        <div>
            <table className="table-data" style={{width: '100%', display: 'inline-table'}}>
                <thead>
                <tr>
                    <td>参数名称</td>
                    <td>作用描述</td>
                    <td>是否必须</td>
                </tr>
                </thead>
                <tbody>
                {
                    dataSource.property.map((item, i) => (
                        <tr key={i}>
                            <td>
                                <span className="label-info">{item.name}</span>
                                <CopyToClipboard text={item.name} onCopy={() => alertCopy()}>
                                    <i className="icon-copy"></i>
                                </CopyToClipboard>
                            </td>
                            <td>{item.desc}</td>
                            <td>
                                {
                                    item.required
                                        ?
                                        <span className="icon-toggle-on" title="必须"></span>
                                        :
                                        <span className="icon-toggle-off" title="可选"></span>
                                }
                            </td>
                        </tr>
                    ))
                }
                </tbody>
            </table>
        </div>
    );
};


const ClientMemory = () => {
    return (

        <div>
            <table className="table-data" style={{width: '100%', display: 'inline-table'}}>
                <thead>
                <tr>
                    <td style={{width: '380px'}}>参数名称</td>
                    <td>作用描述</td>
                </tr>
                </thead>
                <tbody>
                {
                    dataSource.memory.map((item, i) => (
                        <tr key={i}>
                            <td>
                                <span className="label-info">{item.name}</span>
                                <CopyToClipboard text={item.name} onCopy={() => alertCopy()}>
                                    <i className="icon-copy"></i>
                                </CopyToClipboard>
                            </td>
                            <td>{item.desc}</td>
                        </tr>
                    ))
                }
                </tbody>
            </table>
        </div>
    );
};


const ClientTotalMem = () => {
    return (

        <div>
            <table className="table-data" style={{width: '100%', display: 'inline-table'}}>
                <thead>
                <tr>
                    <td>配置项</td>
                    <td>TaskManager 配置参数</td>
                    <td>JobManager 配置参数</td>
                </tr>
                </thead>
                <tbody>
                {
                    dataSource.totalMem.map((item, i) => (
                        <tr key={i}>
                            <td>{item.group}</td>
                            <td>
                                <span className="label-info">{item.tm}</span>
                                <CopyToClipboard text={item.tm} onCopy={() => alertCopy()}>
                                    <i className="icon-copy"></i>
                                </CopyToClipboard>
                            </td>
                            <td>
                                <span className="label-info">{item.jm}</span>
                                <CopyToClipboard text={item.jm} onCopy={() => alertCopy()}>
                                    <i className="icon-copy"></i>
                                </CopyToClipboard>
                            </td>
                        </tr>
                    ))
                }
                </tbody>
            </table>
        </div>
    );
};


const ClientCheckpoints = () => {
    return (

        <div>
            <table className="table-data" style={{width: '100%', display: 'inline-table'}}>
                <thead>
                <tr>
                    <td>配置项</td>
                    <td>作用描述</td>
                    <td>参数值或类型</td>
                </tr>
                </thead>
                <tbody>
                {
                    dataSource.checkpoints.map((item, i) => (
                        <tr key={i}>
                            <td>{item.name}</td>
                            <td>{item.desc}</td>
                            <td>{item.value}</td>
                        </tr>
                    ))
                }
                </tbody>
            </table>
        </div>
    );
};

const ClientBackend = () => {
    return (

        <div>
            <table className="table-data" style={{width: '100%', display: 'inline-table'}}>
                <thead>
                <tr>
                    <td>配置项</td>
                    <td>作用描述</td>
                    <td>参数值或类型</td>
                    <td>在哪种类型下有效</td>
                </tr>
                </thead>
                <tbody>
                {
                    dataSource.backend.map((item, i) => (
                        <tr key={i}>
                            <td>
                                <span className="label-info">{item.name}</span>
                                <CopyToClipboard text={item.name} onCopy={() => alertCopy()}>
                                    <i className="icon-copy"></i>
                                </CopyToClipboard>
                            </td>
                            <td>{item.desc}</td>
                            <td>{item.value}</td>
                            <td>{item.mode}</td>
                        </tr>
                    ))
                }
                </tbody>
            </table>
        </div>
    );
};


const ClientFixedDelay = () => {
    return (

        <div>
            <table className="table-data" style={{width: '100%', display: 'inline-table'}}>
                <thead>
                <tr>
                    <td>配置项</td>
                    <td>作用描述</td>
                    <td>参数值或单位</td>
                </tr>
                </thead>
                <tbody>
                {
                    dataSource.fixedDelay.map((item, i) => (
                        <tr key={i}>
                            <td>
                                <span className="label-info">{item.name}</span>
                                <CopyToClipboard text={item.name} onCopy={() => alertCopy()}>
                                    <i className="icon-copy"></i>
                                </CopyToClipboard>
                            </td>
                            <td>{item.desc}</td>
                            <td>{item.value}</td>
                        </tr>
                    ))
                }
                </tbody>
            </table>
        </div>
    );
};


const ClientFailureRate = () => {
    return (

        <div>
            <table className="table-data" style={{width: '100%', display: 'inline-table'}}>
                <thead>
                <tr>
                    <td>配置项</td>
                    <td>作用描述</td>
                    <td>参数值或单位</td>
                </tr>
                </thead>
                <tbody>
                {
                    dataSource.failureRate.map((item, i) => (
                        <tr key={i}>
                            <td>
                                <span className="label-info">{item.name}</span>
                                <CopyToClipboard text={item.name} onCopy={() => alertCopy()}>
                                    <i className="icon-copy"></i>
                                </CopyToClipboard>
                            </td>
                            <td>{item.desc}</td>
                            <td>{item.value}</td>
                        </tr>
                    ))
                }
                </tbody>
            </table>
        </div>
    );
};


const ClientTables = () => {
    return (

        <div>
            <table className="table-data" style={{width: '100%', display: 'inline-table'}}>
                <thead>
                <tr>
                    <td>配置项</td>
                    <td>作用描述</td>
                    <td>参数值</td>
                </tr>
                </thead>
                <tbody>
                {
                    dataSource.tables.map((item, i) => (
                        <tr key={i}>
                            <td>
                                <span className="label-info">{item.name}</span>
                                <CopyToClipboard text={item.name} onCopy={() => alertCopy()}>
                                    <i className="icon-copy"></i>
                                </CopyToClipboard>
                            </td>
                            <td>{item.desc}</td>
                            <td>{item.value}</td>
                        </tr>
                    ))
                }
                </tbody>
            </table>
        </div>
    );
};


const ClientEnvs = () => {
    return (

        <div>
            <table className="table-data" style={{width: '100%', display: 'inline-table'}}>
                <thead>
                <tr>
                    <td>要求</td>
                    <td>版本</td>
                    <td>是否必须</td>
                    <td>其他事项</td>
                </tr>
                </thead>
                <tbody>
                {
                    dataSource.envs.map((item, i) => (
                        <tr key={i}>
                            <td>
                                <span className="label-info">{item.name}</span>
                            </td>
                            <td>{item.version}</td>
                            <td>
                                {
                                    item.required
                                        ?
                                        <span className="icon-toggle-on" title="必须"></span>
                                        :
                                        <span className="icon-toggle-off" title="可选"></span>
                                }
                            </td>
                            <td>{item.other}</td>
                        </tr>
                    ))
                }
                </tbody>
            </table>
        </div>

    );
};


export {
    ClientOption,
    ClientProperty,
    ClientMemory,
    ClientTotalMem,
    ClientCheckpoints,
    ClientBackend,
    ClientFixedDelay,
    ClientFailureRate,
    ClientTables,
    ClientEnvs
};
