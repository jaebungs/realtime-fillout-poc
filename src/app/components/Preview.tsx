import { useFormStore } from '@/app/store/formStore'
import { renderComponent } from "@/app/utils/renderComponent" 

const Preview = () => {
  const formComponents = useFormStore(state => state.formComponents)

  return (
    <div className="relative flex w-full flex-col justify-center items-center max-w-[660px]">
        { formComponents.map((form, index) => {
          return <div 
            key={form.id}
             className={`w-full flex items-center py-1 pr-3`}
            >
              {renderComponent(form, 'preview')}
            </div>
        })
    }
    </div>
  )
}

export default Preview