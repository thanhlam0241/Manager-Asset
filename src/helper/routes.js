const sidebarRoutes = [
    {
        path: '/',
        name: 'OUTLINE',
        icon: 'image-computer-fluctuate-outline',
        collapse: false,
    },
    {
        path: '/assets',
        name: 'ASSET',
        icon: 'image-asset-varient',
        collapse: true,
        childPath: [
            {
                path: 'write-increase',
                name: 'WRITE_INCREASE',
            },
            {
                path: 'change-info',
                name: 'CHANGE_INFO',
            },
            {
                path: 're-review',
                name: 'RE_REVIEW',
            },
            {
                path: 'count-depreciation',
                name: 'COUNT_DEPRECIATION',
            },
            {
                path: 'control-change-assets',
                name: 'CONTROL_CHANGE_ASSETS',
            },
            {
                path: 'write-decrease',
                name: 'WRITE_DECREASE',
            },
            {
                path: 'check',
                name: 'CHECK',
            },
            {
                path: 'other',
                name: 'OTHER',
            }
        ]
    },
    {
        path: '/assets-htdb',
        name: 'ASSET_HTDB',
        icon: 'image-asset-outline',
        collapse: false,
    },
    {
        path: 'tool',
        name: 'TOOL',
        icon: 'image-tool-outline',
        collapse: false,
    },
    {
        path: 'catalog',
        name: 'CATALOG',
        icon: 'image-catalog-outline',
        collapse: false,
    },
    {
        path: 'search',
        name: 'SEARCH',
        icon: 'image-discover-outline',
        collapse: false,
    },
    {
        path: 'report',
        name: 'REPORT',
        icon: 'image-report-outline',
        collapse: false,
    },
]

export default sidebarRoutes;