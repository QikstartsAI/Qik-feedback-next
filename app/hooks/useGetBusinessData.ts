import { useEffect, useState } from 'react'
import { findBusiness } from '@/app/services/business'
import { Business } from '@/app/types/business'
import { useSearchParams } from 'next/navigation'
import { findBrandInBusiness } from '../services/businessBrand'

function useGetBusinessData () {
  const [loading, setLoading] = useState('loading')
  const [business, setBusiness] = useState<Business | null>(null)
  const searchParams = useSearchParams()

  const businessId = searchParams.get('id')
  const branchId = searchParams.get('sucursal')
  const waiterId = searchParams.get('mesero')
  const brandId = searchParams.get('brand')
  const brandBranchId = searchParams.get('branch')

  useEffect(() => {
    if (!businessId) return
    const fetchData = async () => {
      setLoading('requesting')
      try {
        const res = !brandId
        ? await findBusiness(businessId, branchId, waiterId) || null
        : await findBrandInBusiness(businessId, brandId, brandBranchId) || null
        setBusiness(res)
      } catch (error) {
        console.error(error)
      } finally {
        setLoading('loaded')
      }
    }
    fetchData()
  }, [businessId, branchId, waiterId, brandId, brandBranchId])

  return {
    loading,
    business,
    businessId,
    branchId,
    waiterId,
    brandId,
    brandBranchId
  }
}

export default useGetBusinessData
