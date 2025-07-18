'use client'
import { useFormStore } from '@/app/store/formStore'
import initialFieldAttributes from '@/app/utils/initialFieldAttributes'

const ComponentPanel = () => {
  const formComponents = useFormStore(state => state.formComponents)
    const addFormComponent = useFormStore(state => state.addFormComponent)

    const onFieldComponentClick = (name: keyof typeof initialFieldAttributes) => {
        addFormComponent(name, formComponents.length)
    }   
    return (
        <div className="flex flex-col justify-between h-full w-[226px] lg:w-[300px]">
            <div className="flex flex-col h-screen flex-shrink-0 duration-200 bg-gray-50 border-x-[0.5px] border-gray-300 w-[226px] lg:w-[300px]">
                <div className="w-full p-4">
                    <div className="border border-[rgba(0,0,0,0.11)] focus-within:border-blue-400 shadow-sm bg-transparent transition file:border-0 file:bg-transparent file:font-medium file:text-foreground placeholder:text-muted-foreground focus-within:outline-none focus-within:ring-2 focus-within:ring-blue-200 disabled:cursor-not-allowed disabled:opacity-50 rounded-lg flex items-center h-min relative">
                    <div className="absolute left-2 text-gray-500 [&amp;&gt;svg]:h-4 [&amp;&gt;svg]:w-4 h-4 w-4 flex items-center justify-center pointer-events-none [&amp;:has(button)]:pointer-events-auto"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true" className="h-4 w-4"><path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd"></path></svg></div>
                        <input
                            className="border-0 focus:outline-none focus:ring-0 disabled:opacity-50 w-full rounded-lg h-9 px-3 py-2 text-sm pl-7"
                            placeholder="Search fields"
                        />
                    </div>
                </div>
                <div className="w-full px-4">
                    <p className="text-sm text-gray-400 font-medium mt-2">Frequetnly used</p>
                    <div className="grid grid-cols-2 lg:grid-cols-3 gap-2 mt-3 gap-y-4">
                        <button aria-roledescription="draggable" className="bg-white px-[3px] flex flex-col pt-3 pb-[6px] items-center  rounded-md cursor-pointer  border border-white shadow hover:shadow-md hover:shadow-gray-400/50 w-full"
                            onClick={() => onFieldComponentClick('EmailInput')}
                        >
                            <div className="p-1 rounded text-[rgb(34,197,94)] bg-[rgb(240,253,244)] border-[0.5px] border-[rgb(187,247,208)]">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true" className="h-5 w-5"><path fillRule="evenodd" d="M3 7a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 13a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd"></path></svg>
                            </div>
                            <div className="text-gray-700 text-xs font-medium flex justify-center mt-2 text-center leading-3 h-6 items-center">
                                Short answer
                            </div>
                        </button>
                        <button aria-roledescription="draggable"className="bg-white px-[3px] flex flex-col pt-3 pb-[6px] items-center  rounded-md cursor-pointer  border border-white shadow hover:shadow-md hover:shadow-gray-400/50 w-full"
                            onClick={() => onFieldComponentClick('ShortAnswerInput')}
                        >
                            <div className="p-1 rounded text-[rgb(34,197,94)] bg-[rgb(240,253,244)] border-[0.5px] border-[rgb(187,247,208)]">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true" className="h-5 w-5"><path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"></path><path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"></path></svg>
                            </div>
                            <div className="text-gray-700 text-xs font-medium flex justify-center mt-2 text-center leading-3 h-6 items-center">
                                Email input
                            </div>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ComponentPanel