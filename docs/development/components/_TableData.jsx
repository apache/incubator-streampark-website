import React from 'react';
import './TableData.less';
import dataSource from './data';

const ClientOption = () => {
    return (
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
                                    <span className="fa fa-check" style={{color: 'green'}}></span>
                                    :
                                    <span className="fa fa-times" style={{color: 'red'}}></span>
                            }
                        </td>
                        <td>{item.value}</td>
                        <td>{item.desc}</td>
                    </tr>
                ))
            }
            </tbody>
        </table>
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
                                <i className="fa fa-copy"></i>
                            </td>
                            <td>{item.desc}</td>
                            <td>
                                {
                                    item.required
                                        ?
                                        <span className="fa fa-toggle-on" style={{color: 'green'}} title="必须"></span>
                                        :
                                        <span className="fa fa-toggle-off" style={{color: 'gray'}} title="可选"></span>
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
                                <i className="fa fa-copy"></i>
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
                                <i className="fa fa-copy"></i>
                            </td>
                            <td>
                                <span className="label-info">{item.jm}</span>
                                <i className="fa fa-copy"></i>
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
                    dataSource.checkpoints.map((item, i) => (
                        <tr key={i}>
                            <td>
                                <span className="label-info">{item.name}</span>
                                <i className="fa fa-copy"></i>
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
                                <i className="fa fa-copy"></i>
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
                                <i className="fa fa-copy"></i>
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
                                <i className="fa fa-copy"></i>
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


export {
    ClientOption,
    ClientProperty,
    ClientMemory,
    ClientTotalMem,
    ClientCheckpoints,
    ClientBackend,
    ClientFixedDelay,
    ClientFailureRate,
    ClientTables
};
