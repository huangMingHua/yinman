const nav = [{
        name: 'demo',
        text: '个人中心',
        icon: 'gear',
        path: '/introduce',
        children: [{
                name: 'userManagement',
                path: '/userManagement',
                icon: 'userManagement',
                text: '用户管理',
                boff: true
            },

            {
                name: 'courseCreation',
                path: '/courseCreation',
                icon: 'courseCreation',
                text: '课程表管理',
                boff: true
            },
            {
                name: 'introduce',
                path: '/introduce',
                icon: 'introduce',
                text: '预约试课管理',
                boff: true
            },
            {
                name: 'registrationRecord',
                path: '/registrationRecord',
                icon: 'registrationRecord',
                text: '报名记录',
                boff: true
            },
            {
                name: 'schoolTransferCourse',
                path: '/schoolTransferCourse',
                icon: 'schoolTransferCourse',
                text: '学校调课',
                boff: false
            },

            {
                name: 'bookingTestRecord',
                path: '/bookingTestRecord',
                icon: 'bookingTestRecord',
                text: '预约试课管理',
                boff: false
            },

            {
                name: 'signUp',
                path: '/signUp',
                icon: 'signUp',
                text: '学生管理',
                boff: false
            },
            {
                name: 'teacherCreation',
                path: '/teacherCreation',
                icon: 'teacherCreation',
                text: '教师管理',
                boff: false
            },


            {
                name: 'classroomCreation',
                path: '/classroomCreation',
                icon: 'classroomCreation',
                text: '教室管理',
                boff: false
            },
            {
                name: 'terms',
                path: '/terms',
                icon: 'teacherInfo',
                text: '学期管理',
                boff: false
            },
            {
                name: 'courseTable',
                path: '/courseTable/list',
                icon: 'courseTableCreation',
                text: '课程表管理',
                boff: false
            },

            {
                name: 'teacherTookNotes',
                path: '/teacherTookNotes',
                icon: 'teacherTookNotes',
                text: '调课管理',
                boff: false
            },
            {
                name: 'courseManagement',
                path: '/courseManagement',
                icon: 'courseManagement',
                text: '调课、请假、补课记录',
                boff: true
            },
            {
                name: 'suspensionAndClasstransfer',
                path: '/suspensionAndClasstransfer',
                icon: 'suspensionAndClasstransfer',
                text: '停课和转班记录',
                boff: true
            },
            {
                name: 'existingStudents',
                path: '/existingStudents',
                icon: 'existingStudents',
                text: '已添加学生用户',
                boff: false
            },
            {
                name: 'userInfo',
                path: '/userInfo',
                icon: 'userInfo',
                text: '用户详细',
                boff: false
            },
            {
                name: 'studentInfo',
                path: '/studentInfo',
                icon: 'studentInfo',
                text: '学生详细',
                boff: false
            },
            {
                name: 'teacherInfo',
                path: '/teacherInfo',
                icon: 'teacherInfo',
                text: '教师详细',
                boff: false
            },
            {
                name: 'onlineGuide',
                path: '/onlineGuide',
                icon: 'teacherInfo',
                text: '在线指导',
                boff: false
            }
        ]
    },
    {
        name: 'dem',
        text: '关于音曼',
        icon: 'gear',
        path: '/introduce',
        children: [{
                name: 'voiceIntroduction',
                path: '/voiceIntroduction',
                icon: 'voiceIntroduction',
                text: '音曼介绍',
                boff: false
            },
            {
                name: 'about',
                path: '/about',
                icon: 'about',
                text: '关于音曼',
                boff: true
            },
            {
                name: 'teacherItroduction',
                path: '/teacherItroduction',
                icon: 'teacherItroduction',
                text: '音曼教师',
                boff: false
            },
            {
                name: 'rhythmCourse',
                path: '/rhythmCourse',
                icon: 'rhythmCourse',
                text: '音曼课程',
                boff: false
            },
            {
                name: 'abrsm',
                path: '/abrsm',
                icon: 'abrsm',
                text: '英皇考级',
                boff: false
            },
            {
                name: 'competitionPresentation',
                path: '/competitionPresentation',
                icon: 'competitionPresentation',
                text: '比赛介绍',
                boff: false
            },
        ]
    },
    {
        name: 'de',
        text: '展示中心',
        icon: 'gear',
        path: '/introduce',
        children: [{
            name: 'theHonorRoll',
            path: '/theHonorRoll',
            icon: 'theHonorRoll',
            text: '光荣榜',
            boff: true
        }, {
            name: 'exerciseShow',
            path: '/exerciseShow',
            icon: 'exerciseShow',
            text: '练习秀',
            boff: false
        }, {
            name: 'downLoad',
            path: '/downLoad',
            icon: 'downLoad',
            text: '下载中心',
            boff: true
        }]
    },
    {
        name: 'd',
        text: '参数配置',
        icon: 'gear',
        path: '/introduce',
        children: [{
            name: 'configure',
            path: '/configure',
            icon: 'configure',
            text: '参数配置',
            boff: true
        }]
    }
]
export default nav