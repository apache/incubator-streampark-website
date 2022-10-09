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
        {group: 'JM heap Memory', name: 'jobmanager.memory.heap.size', desc: 'JVM Heap Memory size for JobManager. The minimum recommended JVM Heap size is 128.000mb (134217728 bytes).'},
        {group: 'JM Off-heap Memory', name: 'jobmanager.memory.off-heap.size', desc: 'Off-heap Memory size for JobManager. This option covers all off-heap memory usage including direct and native memory allocation. The JVM direct memory limit of the JobManager process (-XX:MaxDirectMemorySize) will be set to this value if the limit is enabled by jobmanager.memory.enable-jvm-direct-memory-limit'},
        {group: 'JVM Metaspace', name: 'jobmanager.memory.jvm-metaspace.size', desc: 'JVM Metaspace Size for the JobManager.'},
        {group: 'JVM Size', name: 'jobmanager.memory.jvm-overhead.min', desc: 'Min JVM Overhead size for the JobManager. This is off-heap memory reserved for JVM overhead, such as thread stack space, compile cache, etc. This includes native memory but not direct memory, and will not be counted when Flink calculates JVM max direct memory size parameter. The size of JVM Overhead is derived to make up the configured fraction of the Total Process Memory. If the derived size is less or greater than the configured min or max size, the min or max size will be used. The exact size of JVM Overhead can be explicitly specified by setting the min and max size to the same value.'},
        {group: 'JVM Size', name: 'jobmanager.memory.jvm-overhead.max', desc: 'Max JVM Overhead size for the JobManager. This is off-heap memory reserved for JVM overhead, such as thread stack space, compile cache, etc. This includes native memory but not direct memory, and will not be counted when Flink calculates JVM max direct memory size parameter. The size of JVM Overhead is derived to make up the configured fraction of the Total Process Memory. If the derived size is less or greater than the configured min or max size, the min or max size will be used. The exact size of JVM Overhead can be explicitly specified by setting the min and max size to the same value.'},
        {group: 'JVM Size', name: 'jobmanager.memory.jvm-overhead.fraction', desc: 'Fraction of Total Process Memory to be reserved for JVM Overhead. This is off-heap memory reserved for JVM overhead, such as thread stack space, compile cache, etc. This includes native memory but not direct memory, and will not be counted when Flink calculates JVM max direct memory size parameter. The size of JVM Overhead is derived to make up the configured fraction of the Total Process Memory. If the derived size is less or greater than the configured min or max size, the min or max size will be used. The exact size of JVM Overhead can be explicitly specified by setting the min and max size to the same value.'},
        {group: 'Framework Heap Memory', name: 'taskmanager.memory.framework.heap.size', desc: 'Framework Heap Memory size for TaskExecutors. This is the size of JVM heap memory reserved for TaskExecutor framework, which will not be allocated to task slots.'},
        {group: 'Task Heap Memory', name: 'taskmanager.memory.task.heap.size', desc: 'Task Heap Memory size for TaskExecutors. This is the size of JVM heap memory reserved for tasks. If not specified, it will be derived as Total Flink Memory minus Framework Heap Memory, Framework Off-Heap Memory, Task Off-Heap Memory, Managed Memory and Network Memory.'},
        {group: 'Managed memory', name: 'taskmanager.memory.managed.size', desc: 'Managed Memory size for TaskExecutors. This is the size of off-heap memory managed by the memory manager, reserved for sorting, hash tables, caching of intermediate results and RocksDB state backend. Memory consumers can either allocate memory from the memory manager in the form of MemorySegments, or reserve bytes from the memory manager and keep their memory usage within that boundary. If unspecified, it will be derived to make up the configured fraction of the Total Flink Memory.'},
        {group: 'Managed memory', name: 'taskmanager.memory.managed.fraction', desc: 'Fraction of Total Flink Memory to be used as Managed Memory, if Managed Memory size is not explicitly specified.'},
        {
            group: 'Framework off-heap memory',
            name: 'taskmanager.memory.framework.off-heap.size',
            desc: 'Framework Off-Heap Memory size for TaskExecutors. This is the size of off-heap memory (JVM direct memory and native memory) reserved for TaskExecutor framework, which will not be allocated to task slots. The configured value will be fully counted when Flink calculates the JVM max direct memory size parameter.'
        },
        {
            group: 'Taskmanager off-heap memory',
            name: 'taskmanager.memory.task.off-heap.size',
            desc: 'Task Off-Heap Memory size for TaskExecutors. This is the size of off heap memory (JVM direct memory and native memory) reserved for tasks. The configured value will be fully counted when Flink calculates the JVM max direct memory size parameter.'
        },
        {group: 'JVM Metaspace', name: 'taskmanager.memory.jvm-metaspace.size', desc: 'JVM Metaspace Size for the TaskExecutors.'}
    ],
    totalMem: [
        {group: 'Flink total memory', tm: 'taskmanager.memory.flink.size', jm: 'jobmanager.memory.flink.size'},
        {group: 'Flink process total memory', tm: 'taskmanager.memory.process.size', jm: 'jobmanager.memory.process.size'}
    ],
    checkpoints: [
        {name: 'execution.checkpointing.interval', desc: 'Interval period of checkpoint', value: 'Duration'},
        {name: 'execution.checkpointing.timeout', desc: 'timeout', value: 'Duration'},
        {name: 'execution.checkpointing.mode', desc: 'semantics', value: ' EXACTLY_ONCE | AT_LEAST_ONCE '},
        {name: 'execution.checkpointing.unaligned', desc: 'unaligned', value: 'true | false'}
    ],
    backend: [
        {name: 'state.backend', desc: 'Type of backend storage', value: 'hashmap | rocksdb', mode: ''},
        {name: 'state.checkpoint-storage', desc: 'The checkpoint storage implementation to be used to checkpoint state.', value: 'jobmanager | filesystem ', mode: ''},
        {name: 'state.backend.incremental', desc: 'Whether to enable increment', value: ' true | false', mode: 'rocksdb'}
    ],
    fixedDelay: [
        {name: 'attempts', desc: 'Number of Flink attempts to restart', value: '3'},
        {name: 'delay', desc: 'Specify how long to restart after the task fails', value: 'none | s | m | min | h | d'},
    ],
    failureRate: [
        {name: 'max-failures-per-interval', desc: 'Maximum number of restarts in given time interval before failing a job', value: '3'},
        {name: 'failure-rate-interval', desc: 'Time interval for measuring failure', value: '无 | s | m | min | h | d'},
        {name: 'delay', desc: 'Delay between two consecutive restart attempts', value: '无 | s | m | min | h | d'}
    ],
    tables: [
        {name: 'planner', desc: 'Table Planner', value: 'blink | old | any'},
        {name: 'mode', desc: 'Table Mode', value: 'streaming | batch'},
        {name: 'catalog', desc: 'Catalog,Specifies that the will be used during initialization', value: ''},
        {name: 'database', desc: 'Database,Specifies that the will be used during initialization', value: ''},
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
