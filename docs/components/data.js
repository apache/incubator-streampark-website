export default {
    option: [
        {
            opt: '-t',
            longOpt: 'target',
            desc: 'Deployment mode(only support yarn-per-job,application)',
            deprecated: false,
            value: ' yarn-per-job | application '
        },
        {opt: '-d', longOpt: 'detached', desc: 'run as detached mode', deprecated: false, value: "true | false"},
        {
            opt: '-n',
            longOpt: 'allowNonRestoredState',
            desc: 'allow to skip savepoint state that cannot be restored',
            deprecated: false,
            value: "true | false"
        },
        {
            opt: '-sae',
            longOpt: 'shutdownOnAttachedExit',
            desc: 'If the job is submitted in attached, when job cancel close cluster',
            deprecated: false,
            value: "true | false"
        },
        {
            opt: '-m',
            longOpt: 'jobmanager',
            desc: 'Address of the JobManager to which to connect',
            deprecated: false,
            value: "yarn-cluster | address"
        },
        {opt: '-p', longOpt: 'parallelism', desc: 'Program parallelism', deprecated: true, value: 'int'},
        {opt: '-c', longOpt: 'class', desc: 'Class with the program entry point ("main()" method)', deprecated: true, value: 'String'},
    ],
    property: [
        {name: '$internal.application.main', desc: 'Class with the program entry point ("main()" method)', required: true},
        {name: 'pipeline.name', desc: 'Job name', required: true},
        {name: 'yarn.application.queue', desc: 'YARN queue', required: false},
        {name: 'taskmanager.numberOfTaskSlots', desc: 'Taskmanager slot number', required: false},
        {name: 'parallelism.default', desc: 'Program parallelism', required: false}
    ],
    memory: [
        {group: 'JM heap Memory', name: 'jobmanager.memory.heap.size', desc: 'JobManager 的 JVM 堆内存'},
        {group: 'JM Off-heap Memory', name: 'jobmanager.memory.off-heap.size', desc: 'JobManager 的堆外内存(直接内存或本地内存)'},
        {group: 'JVM Metaspace', name: 'jobmanager.memory.jvm-metaspace.size', desc: 'Flink JVM进程的Metaspace'},
        {group: 'JVM Metaspace', name: 'jobmanager.memory.jvm-metaspace.size', desc: 'Flink JVM进程的Metaspace'},
        {group: 'JVM Metaspace', name: 'jobmanager.memory.jvm-overhead.min', desc: 'Flink JVM进程的Metaspace'},
        {group: 'JVM Size', name: 'jobmanager.memory.jvm-metaspace.size', desc: '用于其他 JVM 开销的本地内存'},
        {group: 'JVM Size', name: 'jobmanager.memory.jvm-overhead.max', desc: '用于其他 JVM 开销的本地内存'},
        {group: 'JVM Size', name: 'jobmanager.memory.jvm-overhead.fraction', desc: '用于其他 JVM开销的本地内存'},
        {group: 'Framework Heap Memory', name: 'taskmanager.memory.framework.heap.size', desc: '用于Flink 框架的JVM堆内存(进阶配置)'},
        {group: 'Task Heap Memory', name: 'taskmanager.memory.task.heap.size', desc: '由Flink管理的用于排序,哈希表,缓存状态后端的本地内存'},
        {group: 'Managed memory', name: 'taskmanager.memory.managed.size', desc: '用于其他 JVM 开销的本地内存'},
        {group: 'Managed memory', name: 'taskmanager.memory.managed.fraction', desc: '用于其他 JVM 开销的本地内存'},
        {
            group: '框架堆外内存',
            name: 'taskmanager.memory.framework.off-heap.size',
            desc: '用于Flink框架的堆外内存(直接内存或本地内存)进阶配置'
        },
        {
            group: '任务堆外内存',
            name: 'taskmanager.memory.task.off-heap.size',
            desc: '用于Flink应用的算子及用户代码的堆外内存(直接内存或本地内存)'
        },
        {group: 'JVM Metaspace', name: 'taskmanager.memory.jvm-metaspace.size', desc: 'Flink JVM 进程的 Metaspace'}
    ],
    totalMem: [
        {group: 'Flink 总内存 ', tm: 'taskmanager.memory.flink.size', jm: 'jobmanager.memory.flink.size'},
        {group: '进程总内存', tm: 'taskmanager.memory.process.size', jm: 'jobmanager.memory.process.size'}
    ],
    checkpoints: [
        {name: 'enable', desc: '是否开启checkpoint', value: 'true | false'},
        {name: 'interval', desc: 'checkpoint的间隔周期', value: '毫秒'},
        {name: 'mode', desc: '语义', value: ' EXACTLY_ONCE | AT_LEAST_ONCE '},
        {name: 'timeout', desc: '超时时间', value: '毫秒'},
        {name: 'unaligned', desc: '是否非对齐', value: 'true | false'},
    ],
    backend: [
        {name: 'value', desc: 'backend具体存储的类型', value: 'jobmanager | filesystem | rocksdb', mode: ''},
        {name: 'memory', desc: '针对jobmanager有效,最大内存', value: 'kb如(5242880)', mode: 'jobmanager'},
        {name: 'async', desc: '是否开启异步', value: ' true | false', mode: 'jobmanager | filesystem'},
        {name: 'incremental', desc: '是否开启增量', value: ' true | false', mode: 'rocksdb'},
    ],
    fixedDelay: [
        {name: 'attempts', desc: '在Job最终宣告失败之前,Flink尝试重启的次数', value: '3'},
        {name: 'delay', desc: '一个任务失败之后不会立即重启,这里指定间隔多长时间重启', value: '无 | s | m | min | h | d'},
    ],
    failureRate: [
        {name: 'max-failures-per-interval', desc: '在一个Job认定为失败之前,最大的重启次数', value: '3'},
        {name: 'failure-rate-interval', desc: '计算失败率的时间间隔', value: '无 | s | m | min | h | d'},
        {name: 'delay', desc: '两次连续重启尝试之间的时间间隔', value: '无 | s | m | min | h | d'}
    ],
    tables: [
        {name: 'planner', desc: 'Table Planner', value: 'blink | old | any'},
        {name: 'mode', desc: 'Table Mode', value: 'streaming | batch'},
        {name: 'catalog', desc: '指定catalog,如指定初始化时会使用到', value: ''},
        {name: 'database', desc: '指定database,如指定初始化时会使用到', value: ''},
    ],
    envs: [
        {name: '操作系统', version: 'Linux', required: true, other: '不支持Window系统'},
        {name: 'JAVA', version: '1.8+', required: true, other: null},
        {name: 'Maven', version: '3+', required: false, other: '部署机器可选安装Maven(项目编译会用到)'},
        {name: 'Node.js', version: '', required: true, other: 'NodeJs相关环境'},
        {name: 'Flink', version: '1.12.0+', required: true, other: '版本必须是1.12.x或以上版本,scala版本必须是2.11'},
        {name: 'Hadoop', version: '2+', required: false, other: '可选,如果on yarn则需要hadoop环境,并且配置好相关环境变量'},
        {name: 'MySQL', version: '5.6+', required: false, other: '部署机器或者其他机器安装MySQL'},
        {name: 'Python', version: '2+', required: false, other: '可选,火焰图功能会用到Python'},
        {name: 'Perl', version: '5.16.3+', required: false, other: '可选,火焰图功能会用到Perl'}
    ]
}
