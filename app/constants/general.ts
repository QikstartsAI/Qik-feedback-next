const MAPBOX_API_KEY = process.env.NEXT_PUBLIC_MAPBOX_API_KEY
const COLLECTION_NAME = process.env.NEXT_PUBLIC_VITE_APP_COLLECTION_NAME
const CUSTOMERS_COLLECTION_NAME = process.env.NEXT_PUBLIC_CUSTOMERS_COLLECTION_NAME
const DASHBOARD_COLLECTION_NAME = 'qik_feedback'
const USERS_COLLECTION_NAME = 'businessUsers'
const BUCKET_NAME = 'qik_feedback_test'
const BUCKET_URL = `gs://${COLLECTION_NAME}`
const DSC_SOLUTIONS_ID = 'dsc-solutions'

// Custom Form IDs for Geolocation
const CUSTOM_HOOTERS_FORM_ID = 'hooters'
const CUSTOM_YOGURT_FORM_ID = 'yogurt-amazonas'
const CUSTOM_POLLOSDCAMPO_FORM_ID = 'pollos-del-campo'
const CUSTOM_CEBICHES_FORM_ID = 'cebiches-ruminahui'
const CUSTOM_INKA_BURGER_FORM_ID = 'inka-burger'
const CUSTOM_PIQUEOS_MORITOS_FORM_ID = 'piqueos-moritos'

const ASSETS_FOLDER = {
    icons: 'business/icons',
    background: 'business/background'
}

export {
    COLLECTION_NAME,
    CUSTOMERS_COLLECTION_NAME,
    BUCKET_NAME,
    BUCKET_URL,
    ASSETS_FOLDER,
    USERS_COLLECTION_NAME,
    DASHBOARD_COLLECTION_NAME,
    DSC_SOLUTIONS_ID,
    MAPBOX_API_KEY,
    CUSTOM_HOOTERS_FORM_ID,
    CUSTOM_YOGURT_FORM_ID,
    CUSTOM_POLLOSDCAMPO_FORM_ID,
    CUSTOM_CEBICHES_FORM_ID,
    CUSTOM_INKA_BURGER_FORM_ID,
    CUSTOM_PIQUEOS_MORITOS_FORM_ID
}
