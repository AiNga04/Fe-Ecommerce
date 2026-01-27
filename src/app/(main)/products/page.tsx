import { productService } from '@/services/product'
import { ProductList } from '@/components/product/product-list'

export const metadata = {
  title: 'Danh sách sản phẩm | E-Commerce',
  description: 'Khám phá các sản phẩm mới nhất của chúng tôi.',
}

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined }
}) {
  const page = Number(searchParams?.page) || 0
  const size = Number(searchParams?.size) || 12

  // Server-side fetch
  let initialData = undefined
  let initialPagination = undefined

  try {
    const res = await productService.getProducts({ page, size })
    if (res.data?.success) {
      initialData = res.data.data
      initialPagination = res.data.pagination
    }
  } catch (error) {
    console.error('Failed to fetch products on server:', error)
  }

  return (
    <div className='container max-w-7xl mx-auto px-4 py-8'>
      <div className='flex flex-col gap-8'>
        <div className='text-center space-y-2'>
          <h1 className='text-3xl font-bold tracking-tight'>Sản phẩm của chúng tôi</h1>
          <p className='text-muted-foreground max-w-2xl mx-auto'>
            Tìm kiếm những món đồ thời trang phong cách và chất lượng cao.
          </p>
        </div>

        {/* 
          Pass initialData to Client Component.
          Note: If params changes on client (pagination), Client Component handles fetching.
        */}
        <ProductList initialData={initialData} initialPagination={initialPagination} />
      </div>
    </div>
  )
}
