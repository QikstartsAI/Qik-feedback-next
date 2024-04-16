const COLLECTION_NAME = process.env.NEXT_PUBLIC_VITE_APP_COLLECTION_NAME
const CUSTOMERS_COLLECTION_NAME = process.env.NEXT_PUBLIC_CUSTOMERS_COLLECTION_NAME
const DASHBOARD_COLLECTION_NAME = 'qik_feedback'
const USERS_COLLECTION_NAME = 'businessUsers'
const BUCKET_NAME = 'qik_feedback_test'
const BUCKET_URL = `gs://${COLLECTION_NAME}`
const DSC_SOLUTIONS_ID = 'dsc-solutions'
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
    DSC_SOLUTIONS_ID
}
