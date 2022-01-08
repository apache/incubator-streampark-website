export default {
    envs: [
        {name: '操作系统', version: 'Linux', required: true, other: '不支持Window系统'},
        {name: 'JAVA', version: '1.8+', required: true, other: null},
        {name: 'Maven', version: '3+', required: true, other: '部署机器必须安装Maven,且配置好环境变量(项目编译会用到)'},
        {name: 'Node.js', version: '', required: true, other: 'NodeJs相关环境'},
        {name: 'Flink', version: '1.12.0+', required: true, other: '版本必须是1.12.x或以上版本'},
        {name: 'Hadoop', version: '2+', required: false, other: '可选,如果on yarn则需要hadoop环境,并且配置好相关环境变量'},
        {name: 'MySQL', version: '5.6+', required: false, other: '部署机器或者其他机器安装MySQL'},
        {name: 'Python', version: '2+', required: false, other: '可选,火焰图功能会用到Python'},
        {name: 'Perl', version: '5.16.3+', required: false, other: '可选,火焰图功能会用到Perl'}
    ]
}