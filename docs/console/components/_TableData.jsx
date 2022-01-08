import React from 'react';
import './TableData.less';
import dataSource from './data';

const ClientEnvs = () => {
    return (
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
                                    <span className="fa fa-toggle-on" style={{color: 'green'}} title="必须"></span>
                                    :
                                    <span className="fa fa-toggle-off" style={{color: 'red'}} title="可选"></span>
                            }
                        </td>
                        <td>{item.other}</td>
                    </tr>
                ))
            }
            </tbody>
        </table>
    );
};

export {ClientEnvs};
