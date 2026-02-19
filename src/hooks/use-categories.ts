'use client'

import { useQuery } from '@tanstack/react-query'
import { categoryService } from '@/services/category'
import { Category } from '@/types/category'

export function useCategories(activeOnly = true) {
  return useQuery({
    queryKey: ['categories', activeOnly ? 'active' : 'all'],
    queryFn: async () => {
      const res = await categoryService.list({ activeOnly, size: 100 })
      return res.data?.data || []
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
  })
}
